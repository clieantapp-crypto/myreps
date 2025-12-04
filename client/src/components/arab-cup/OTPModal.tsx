import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isProcessing: boolean;
  error?: string | null;
}

export function OTPModal({ isOpen, onClose, onVerify, isProcessing, error }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setTimeLeft(120);
      setCanResend(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setTimeLeft(120);
    setCanResend(false);
    setOtp("");
  };

  const handleVerify = () => {
    if (otp.length >= 4) {
      onVerify(otp);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOtp(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl" dir="rtl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#8A1538]/10 rounded-full flex items-center justify-center mb-4">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-[#8A1538] animate-spin" />
            ) : (
              <Shield className="w-8 h-8 text-[#8A1538]" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isProcessing ? "جاري التحقق..." : "تأكيد الدفع"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isProcessing 
              ? "يرجى الانتظار بينما نتحقق من الرمز..."
              : "أدخل رمز التحقق المرسل إلى رقم هاتفك المسجل"
            }
          </DialogDescription>
        </DialogHeader>

        {!isProcessing && (
          <>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 my-4">
              <Smartphone className="w-4 h-4" />
              <span>تم إرسال الرمز إلى +974 •••• ••87</span>
            </div>

            <div className="my-6">
              <Input
                data-testid="input-otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                disabled={isProcessing}
                placeholder="أدخل رمز التحقق"
                className={`h-14 text-center text-2xl font-mono tracking-widest rounded-xl ${
                  error ? 'border-red-500 border-2' : 'border-gray-300'
                }`}
                dir="ltr"
                maxLength={8}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 text-center font-medium">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mb-4">
              {!canResend ? (
                <span>إعادة إرسال الرمز بعد <span className="font-semibold text-[#8A1538]">{formatTime(timeLeft)}</span></span>
              ) : (
                <button 
                  onClick={handleResend}
                  className="text-[#8A1538] font-semibold hover:underline"
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </div>

            <Button
              data-testid="button-verifyOtp"
              onClick={handleVerify}
              disabled={otp.length < 4 || isProcessing}
              className="w-full h-12 bg-[#8A1538] hover:bg-[#70102d] text-white font-bold rounded-lg"
            >
              تأكيد والدفع
            </Button>

            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              إلغاء
            </button>
          </>
        )}

        {isProcessing && (
          <div className="py-8 text-center">
            <p className="text-gray-500 text-sm">جاري التحقق من رمز التأكيد...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
