import { Header } from "@/components/arab-cup/Header";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const countries = [
  "Qatar", "Saudi Arabia", "UAE", "Egypt", "Morocco", "Tunisia", "Algeria", 
  "Palestine", "Iraq", "Jordan", "Kuwait", "Bahrain", "Oman", "Lebanon", 
  "Syria", "Yemen", "Libya", "Sudan", "Mauritania", "Somalia"
];

const countryCodes = [
  { code: "+974", country: "QA" },
  { code: "+966", country: "SA" },
  { code: "+971", country: "AE" },
  { code: "+20", country: "EG" },
  { code: "+212", country: "MA" },
  { code: "+216", country: "TN" },
  { code: "+213", country: "DZ" },
  { code: "+970", country: "PS" },
  { code: "+964", country: "IQ" },
];

const teams = [
  "Qatar", "Saudi Arabia", "UAE", "Egypt", "Morocco", "Tunisia", "Algeria",
  "Palestine", "Iraq", "Jordan", "Kuwait", "Bahrain", "Oman", "Lebanon"
];

export default function Checkout() {
  const { totalPrice, totalItems } = useCart();
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+974",
    phone: "",
    country: "",
    city: "",
    gender: "",
    nationality: "",
    favoriteTeam: "",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      localStorage.setItem("buyerDetails", JSON.stringify(formData));
      setLocation("/payment");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      
      <div className="bg-[#8A1538] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#6b1030] rounded-full px-3 py-1.5">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase tracking-wide">Order Summary</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            <span className="font-bold text-lg">QAR{totalPrice}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-[#6b1030] text-white px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span>{totalItems} Ticket(s)</span>
            <span>QAR{totalPrice}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl font-bold text-[#8A1538] mb-6">Buyer details</h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">First Name (as per ID)</Label>
            <Input
              data-testid="input-firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`mt-1 h-12 border-gray-300 ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Enter first name"
              dir="auto"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Last Name (as per ID)</Label>
            <Input
              data-testid="input-lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`mt-1 h-12 border-gray-300 ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Email ID</Label>
            <Input
              data-testid="input-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`mt-1 h-12 border-gray-300 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="flex gap-2">
            <div className="w-1/3">
              <Label className="text-xs text-gray-500">Country Code</Label>
              <Select 
                value={formData.countryCode} 
                onValueChange={(v) => handleInputChange("countryCode", v)}
              >
                <SelectTrigger data-testid="select-countryCode" className="mt-1 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map(cc => (
                    <SelectItem key={cc.code} value={cc.code}>
                      {cc.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-xs text-gray-500">Phone Number</Label>
              <Input
                data-testid="input-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`mt-1 h-12 border-gray-300 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">Country</Label>
            <Select 
              value={formData.country} 
              onValueChange={(v) => handleInputChange("country", v)}
            >
              <SelectTrigger data-testid="select-country" className={`mt-1 h-12 ${errors.country ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">City</Label>
            <Input
              data-testid="input-city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={`mt-1 h-12 border-gray-300 ${errors.city ? 'border-red-500' : ''}`}
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(v) => handleInputChange("gender", v)}
            >
              <SelectTrigger data-testid="select-gender" className={`mt-1 h-12 ${errors.gender ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Nationality</Label>
            <Select 
              value={formData.nationality} 
              onValueChange={(v) => handleInputChange("nationality", v)}
            >
              <SelectTrigger data-testid="select-nationality" className={`mt-1 h-12 ${errors.nationality ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Nationality" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
          </div>

          <div>
            <Label className="text-xs text-gray-500">Which team are you a fan of?</Label>
            <Select 
              value={formData.favoriteTeam} 
              onValueChange={(v) => handleInputChange("favoriteTeam", v)}
            >
              <SelectTrigger data-testid="select-team" className="mt-1 h-12">
                <SelectValue placeholder="Which team are you a fan of?" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          data-testid="button-pay"
          onClick={handleSubmit}
          className="w-full h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-lg"
        >
          Pay
        </Button>
      </div>
    </div>
  );
}
