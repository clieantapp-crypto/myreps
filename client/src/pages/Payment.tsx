import { Header } from "@/components/arab-cup/Header";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, CreditCard, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { OTPModal } from "@/components/arab-cup/OTPModal";
import { useToast } from "@/hooks/use-toast";

export default function Payment() {
  const { totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 44);
  const [showOTP, setShowOTP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
    return `${mins}:${secs.toString().padStart(2, '0')} min`;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const cardNum = cardData.cardNumber.replace(/\s/g, '');
    if (!cardNum) newErrors.cardNumber = "Card number is required";
    else if (cardNum.length < 16) newErrors.cardNumber = "Invalid card number";
    
    if (!cardData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    }
    
    if (!cardData.cvv) newErrors.cvv = "CVV is required";
    else if (cardData.cvv.length < 3) newErrors.cvv = "Invalid CVV";
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowOTP(true);
      }, 1500);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Failed",
      description: "Your card was declined. Please try a different payment method or contact your bank.",
      variant: "destructive",
    });
    
    setIsProcessing(false);
    setShowOTP(false);
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-[#8A1538] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#6b1030] rounded-full px-3 py-1.5">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase tracking-wide">Order Summary</span>
          <span className="font-bold text-lg">QAR{totalPrice}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8A1538] rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Card Payment</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Card Number</Label>
              <div className="relative mt-1">
                <Input
                  data-testid="input-cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  className={`h-12 pl-4 pr-12 ${errors.cardNumber ? 'border-red-500' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-[6px] text-white flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full -ml-1.5 opacity-80"></div>
                  </div>
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm text-gray-600">Expiry Date</Label>
                <Input
                  data-testid="input-expiry"
                  value={cardData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className={`mt-1 h-12 ${errors.expiryDate ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              <div className="flex-1">
                <Label className="text-sm text-gray-600">CVV</Label>
                <div className="relative mt-1">
                  <Input
                    data-testid="input-cvv"
                    type="password"
                    value={cardData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className={`h-12 pr-10 ${errors.cvv ? 'border-red-500' : ''}`}
                    placeholder="•••"
                    maxLength={4}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Cardholder Name</Label>
              <Input
                data-testid="input-cardholderName"
                value={cardData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                className={`mt-1 h-12 ${errors.cardholderName ? 'border-red-500' : ''}`}
                placeholder="Name on card"
              />
              {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{totalItems} Ticket(s)</span>
            <span className="font-semibold">QAR{totalPrice}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-[#8A1538] text-lg">QAR{totalPrice}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
          <Lock className="w-3 h-3" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          data-testid="button-confirmPayment"
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-lg"
        >
          {isProcessing ? "Processing..." : `Pay QAR${totalPrice}`}
        </Button>
      </div>

      <OTPModal 
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        isProcessing={isProcessing}
      />
    </div>
  );
}
