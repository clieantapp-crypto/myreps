import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setTimeLeft(120);
      setCanResend(false);
      setTimeout(() => inputRef.current?.focus(), 100);
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
    inputRef.current?.focus();
  };

  const handleVerify = () => {
    if (otp.length >= 4) {
      onVerify(otp);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
  };

  const isComplete = otp.length >= 4;
  const displayOtp = otp.padEnd(6, "•").split("");

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
                {displayOtp.map((char, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold ${
                      otp[i] ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {char}
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

              <div className="mb-5">
                <Input
                  ref={inputRef}
                  data-testid="input-otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={isProcessing}
                  placeholder="أدخل رمز التحقق"
                  className={`h-14 text-center text-2xl font-mono tracking-[0.3em] rounded-xl border-2 transition-all duration-200 ${
                    otp.length > 0
                      ? 'border-[#8A1538] bg-[#8A1538]/5 text-[#8A1538]' 
                      : error 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  dir="ltr"
                  maxLength={8}
                />
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
