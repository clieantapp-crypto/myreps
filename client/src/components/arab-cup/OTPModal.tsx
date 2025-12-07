import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Smartphone, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isProcessing: boolean;
  error?: string | null;
}

export function OTPModal({ isOpen, onClose, onVerify, isProcessing, error }: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(120);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
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
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length >= 4) {
      onVerify(otpValue);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const otpValue = otp.join("");
  const isComplete = otpValue.length >= 4;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl p-0 overflow-hidden" dir="rtl">
        <div className="bg-gradient-to-br from-[#8A1538] to-[#5a0d25] p-6 text-white text-center">
          <div className="relative mx-auto w-20 h-36 bg-slate-900 rounded-2xl border-4 border-slate-700 shadow-2xl mb-4">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-slate-700 rounded-full"></div>
            <div className="absolute inset-2 top-5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg flex flex-col items-center justify-center p-2">
              <div className="w-8 h-8 rounded-full bg-[#8A1538]/30 flex items-center justify-center mb-2">
                <Lock className="w-4 h-4 text-[#8A1538]" />
              </div>
              <div className="text-[8px] text-slate-400 mb-1">رمز التحقق</div>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold ${
                      otp[i] ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {otp[i] || "•"}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-slate-700 rounded-full"></div>
          </div>
          
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  التحقق الآمن
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              {isProcessing 
                ? "يرجى الانتظار بينما نتحقق من الرمز..."
                : "أدخل الرمز المرسل إلى هاتفك"
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {!isProcessing && (
            <>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 mb-5">
                <Smartphone className="w-4 h-4 text-[#8A1538]" />
                <span>تم إرسال SMS إلى <span dir="ltr" className="font-mono">+974 •••• ••87</span></span>
              </div>

              <div className="flex justify-center gap-2 mb-5" dir="ltr" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isProcessing}
                    data-testid={`input-otp-${index}`}
                    className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8A1538]/20 ${
                      digit 
                        ? 'border-[#8A1538] bg-[#8A1538]/5 text-[#8A1538]' 
                        : error 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    maxLength={1}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded-lg mb-4 text-center font-medium flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  {error}
                </div>
              )}

              <div className="text-center text-xs text-gray-500 mb-4">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-full border-2 border-[#8A1538]/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#8A1538]">{Math.floor(timeLeft / 60)}</span>
                    </div>
                    <span>إعادة الإرسال بعد</span>
                    <span className="font-mono font-bold text-[#8A1538] bg-[#8A1538]/10 px-2 py-0.5 rounded">{formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleResend}
                    className="text-[#8A1538] font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>

              <Button
                data-testid="button-verifyOtp"
                onClick={handleVerify}
                disabled={!isComplete || isProcessing}
                className={`w-full h-12 font-bold rounded-xl text-white transition-all duration-300 ${
                  isComplete 
                    ? 'bg-gradient-to-r from-[#8A1538] to-[#a01c45] hover:from-[#70102d] hover:to-[#8A1538] shadow-lg shadow-[#8A1538]/30' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isComplete ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    تأكيد والدفع
                  </span>
                ) : (
                  "أدخل رمز التحقق"
                )}
              </Button>

              <button 
                onClick={onClose}
                disabled={isProcessing}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors"
              >
                إلغاء العملية
              </button>
            </>
          )}

          {isProcessing && (
            <div className="py-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#8A1538]/20"></div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#8A1538] animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#8A1538]" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium">جاري التحقق من رمز التأكيد...</p>
              <p className="text-gray-400 text-xs mt-1">يرجى عدم إغلاق هذه الصفحة</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
