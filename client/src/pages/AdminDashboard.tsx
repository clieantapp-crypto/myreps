import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  Globe, 
  Eye, 
  FileText, 
  Activity, 
  Clock, 
  MapPin, 
  Monitor, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
  LogOut
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const countryStats = visitors.reduce((acc, v) => {
    acc[v.country] = (acc[v.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageStats = visitors.reduce((acc, v) => {
    acc[v.currentPage] = (acc[v.currentPage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sortedPages = Object.entries(pageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const buyerSubmissions = formSubmissions.filter(f => f.formType === "buyer_details");
  const paymentAttempts = formSubmissions.filter(f => f.formType === "payment_attempt");
  const successfulPayments = paymentAttempts.filter(f => f.success);

  const formatTime = (timestamp: any) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#8A1538] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#8A1538] text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">FIFA Arab Cup Qatar 2025 - Visitor Insights</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{onlineCount} Online Now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{visitors.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Online Now</p>
                  <p className="text-3xl font-bold text-green-600">{onlineCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Form Submissions</p>
                  <p className="text-3xl font-bold text-purple-600">{buyerSubmissions.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Payment Attempts</p>
                  <p className="text-3xl font-bold text-[#8A1538]">{paymentAttempts.length}</p>
                  <p className="text-xs text-green-600 mt-1">{successfulPayments.length} successful</p>
                </div>
                <div className="w-12 h-12 bg-[#8A1538]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#8A1538]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visitors" className="space-y-4">
          <TabsList className="bg-white shadow-sm border-0 p-1 rounded-xl">
            <TabsTrigger value="visitors" className="rounded-lg data-[state=active]:bg-[#8A1538] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Live Visitors
            </TabsTrigger>
            <TabsTrigger value="countries" className="rounded-lg data-[state=active]:bg-[#8A1538] data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="pages" className="rounded-lg data-[state=active]:bg-[#8A1538] data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="forms" className="rounded-lg data-[state=active]:bg-[#8A1538] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Form Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-[#8A1538]" />
                  Live Visitor Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {visitors.map((visitor, index) => {
                      const isOnlineRecently = visitor.isOnline && 
                        visitor.lastSeen?.toDate && 
                        (new Date().getTime() - visitor.lastSeen.toDate().getTime()) < 5 * 60 * 1000;
                      
                      return (
                        <div 
                          key={visitor.visitorId || index} 
                          className={`p-4 rounded-xl border ${isOnlineRecently ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOnlineRecently ? 'bg-green-200' : 'bg-gray-200'}`}>
                                <Users className={`w-5 h-5 ${isOnlineRecently ? 'text-green-700' : 'text-gray-500'}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {visitor.visitorId?.substring(0, 12)}...
                                  </span>
                                  {isOnlineRecently ? (
                                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Online</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">Offline</Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {visitor.city}, {visitor.country}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {visitor.currentPage}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Monitor className="w-3 h-3" />
                                    {visitor.screenSize}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-400">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {getTimeAgo(visitor.lastSeen)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {visitors.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No visitors tracked yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-[#8A1538]" />
                  Visitors by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedCountries.map(([country, count], index) => (
                    <div key={country} className="flex items-center gap-4">
                      <span className="w-6 text-center font-bold text-gray-400">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{country}</span>
                          <span className="text-sm text-gray-500">{count} visitors</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#8A1538] to-[#c42a5a] rounded-full transition-all"
                            style={{ width: `${(count / visitors.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {sortedCountries.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No country data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-[#8A1538]" />
                  Page Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedPages.map(([page, count], index) => (
                    <div key={page} className="flex items-center gap-4">
                      <span className="w-6 text-center font-bold text-gray-400">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 font-mono text-sm">{page || "/"}</span>
                          <span className="text-sm text-gray-500">{count} views</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${(count / Math.max(...Object.values(pageStats))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {sortedPages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No page views tracked yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-[#8A1538]" />
                  Form Submissions & Payment Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {formSubmissions.map((submission, index) => (
                      <div 
                        key={index} 
                        className={`p-5 rounded-xl border ${
                          submission.formType === "payment_attempt" 
                            ? submission.success 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`${
                                submission.formType === "buyer_details" 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : submission.success 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                              } border-0`}
                            >
                              {submission.formType === "buyer_details" ? "Buyer Details" : "Payment"}
                            </Badge>
                            {submission.formType === "payment_attempt" && (
                              submission.success ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatTime(submission.timestamp)}
                          </span>
                        </div>
                        
                        {submission.formType === "buyer_details" && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Full Name</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.firstName} {submission.data?.lastName}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Email</span>
                                <span className="text-gray-900 font-medium break-all">
                                  {submission.data?.email || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Phone</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.phone || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Gender</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.gender || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Country</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.country || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">City</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.city || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Nationality</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.nationality || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Favorite Team</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.favoriteTeam || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {submission.formType === "payment_attempt" && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Cardholder Name</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.cardholderName || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Card Number</span>
                                <span className="text-gray-900 font-medium font-mono">
                                  •••• •••• •••• {submission.data?.cardLast4 || "****"}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Expiry Date</span>
                                <span className="text-gray-900 font-medium font-mono">
                                  {submission.data?.expiryDate || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Amount</span>
                                <span className="text-gray-900 font-bold text-lg">
                                  QAR {submission.data?.amount || "0"}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Tickets</span>
                                <span className="text-gray-900 font-medium">
                                  {submission.data?.ticketCount || "0"} ticket(s)
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-xs text-gray-400 block mb-1">Status</span>
                                <span className={`font-medium ${submission.success ? 'text-green-600' : 'text-red-600'}`}>
                                  {submission.success ? "Successful" : "Failed"}
                                </span>
                              </div>
                            </div>
                            {submission.data?.failureReason && (
                              <div className="bg-red-100 rounded-lg p-3">
                                <span className="text-xs text-red-500 block mb-1">Failure Reason</span>
                                <span className="text-red-700 font-medium">
                                  {submission.data?.failureReason}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {formSubmissions.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No form submissions yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
