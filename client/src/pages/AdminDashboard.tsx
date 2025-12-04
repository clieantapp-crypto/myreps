import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  FileText, 
  Activity, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  LogOut,
  CreditCard
} from "lucide-react";
import { 
  subscribeToVisitors, 
  subscribeToFormSubmissions, 
  getOnlineVisitorsCount,
  VisitorData,
  FormSubmission
} from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"info" | "payment">("info");

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (!user) return;
    
    const unsubVisitors = subscribeToVisitors((data) => {
      setVisitors(data);
      setIsLoading(false);
    });

    const unsubForms = subscribeToFormSubmissions((data) => {
      setFormSubmissions(data);
    });

    const unsubOnline = getOnlineVisitorsCount((count) => {
      setOnlineCount(count);
    });

    return () => {
      unsubVisitors();
      unsubForms();
      unsubOnline();
    };
  }, [user]);

  const buyerSubmissions = formSubmissions.filter(f => f.formType === "buyer_details");
  const paymentAttempts = formSubmissions.filter(f => f.formType === "payment_attempt");
  const successfulPayments = paymentAttempts.filter(f => f.success);

  const formatTime = (timestamp: any) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#8A1538] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#8A1538] text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-white/70 text-xs mt-1">FIFA Arab Cup Qatar 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">{onlineCount} Online</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Online</p>
                  <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Buyer Info</p>
                  <p className="text-2xl font-bold text-purple-600">{buyerSubmissions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Payments</p>
                  <p className="text-2xl font-bold text-[#8A1538]">{paymentAttempts.length}</p>
                  <p className="text-xs text-green-600">{successfulPayments.length} success</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#8A1538]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 mb-4">
          <Button
            onClick={() => setActiveView("info")}
            className={`flex-1 h-12 font-semibold rounded-xl ${
              activeView === "info" 
                ? "bg-[#8A1538] hover:bg-[#6b1030] text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Buyer Info
          </Button>
          <Button
            onClick={() => setActiveView("payment")}
            className={`flex-1 h-12 font-semibold rounded-xl ${
              activeView === "payment" 
                ? "bg-[#8A1538] hover:bg-[#6b1030] text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Data
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              {activeView === "info" ? (
                <>
                  <FileText className="w-5 h-5 text-[#8A1538]" />
                  Buyer Information ({buyerSubmissions.length})
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 text-[#8A1538]" />
                  Payment Attempts ({paymentAttempts.length})
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {activeView === "info" ? (
                  buyerSubmissions.length > 0 ? (
                    buyerSubmissions.map((submission, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-xl border bg-white border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            Buyer Details
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatTime(submission.timestamp)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Full Name</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.firstName} {submission.data?.lastName}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Email</span>
                              <span className="text-sm text-gray-900 font-medium break-all">
                                {submission.data?.email || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Phone</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.phone || "N/A"}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Gender</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.gender || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Country</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.country || "N/A"}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">City</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.city || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Nationality</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.nationality || "N/A"}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Favorite Team</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.favoriteTeam || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No buyer information yet</p>
                    </div>
                  )
                ) : (
                  paymentAttempts.length > 0 ? (
                    paymentAttempts.map((submission, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border ${
                          submission.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`${
                                submission.success 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              } border-0`}
                            >
                              Payment
                            </Badge>
                            {submission.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatTime(submission.timestamp)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Cardholder</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.cardholderName || "N/A"}
                              </span>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Card Number</span>
                              <span className="text-sm text-gray-900 font-medium font-mono">
                                •••• {submission.data?.cardLast4 || "****"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Expiry</span>
                              <span className="text-sm text-gray-900 font-medium font-mono">
                                {submission.data?.expiryDate || "N/A"}
                              </span>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Amount</span>
                              <span className="text-sm text-gray-900 font-bold">
                                QAR {submission.data?.amount || "0"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Tickets</span>
                              <span className="text-sm text-gray-900 font-medium">
                                {submission.data?.ticketCount || "0"} ticket(s)
                              </span>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <span className="text-xs text-gray-400 block">Status</span>
                              <span className={`text-sm font-medium ${submission.success ? 'text-green-600' : 'text-red-600'}`}>
                                {submission.success ? "Successful" : "Failed"}
                              </span>
                            </div>
                          </div>
                          {submission.data?.failureReason && (
                            <div className="bg-red-100 rounded-lg p-2">
                              <span className="text-xs text-red-500 block">Failure Reason</span>
                              <span className="text-sm text-red-700 font-medium">
                                {submission.data?.failureReason}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No payment attempts yet</p>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
