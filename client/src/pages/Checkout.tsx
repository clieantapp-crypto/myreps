import { Header } from "@/components/arab-cup/Header";
import { useCart } from "@/context/CartContext";
import { useNavigation } from "@/context/NavigationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { saveFormSubmission } from "@/lib/firebase";

const countries = [
  "Qatar",
  "Saudi Arabia",
  "UAE",
  "Egypt",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Palestine",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Lebanon",
  "Syria",
  "Yemen",
  "Libya",
  "Sudan",
  "Mauritania",
  "Somalia",
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
  { code: "+962", country: "JO" },
  { code: "+965", country: "KW" },
  { code: "+973", country: "BH" },
  { code: "+968", country: "OM" },
  { code: "+961", country: "LB" },
];

const teams = [
  "Qatar",
  "Saudi Arabia",
  "UAE",
  "Egypt",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Palestine",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Lebanon",
];

export default function Checkout() {
  const { totalPrice, totalItems } = useCart();
  const { navigateTo } = useNavigation();
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
    return `${mins}:${secs.toString().padStart(2, "0")} min`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      localStorage.setItem("buyerDetails", JSON.stringify(formData));

      try {
        await saveFormSubmission(
          "buyer_details",
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: `${formData.countryCode}${formData.phone}`,
            country: formData.country,
            city: formData.city,
            gender: formData.gender,
            nationality: formData.nationality,
            favoriteTeam: formData.favoriteTeam,
          },
          true,
        );
      } catch (error) {
        console.error("Failed to save form submission:", error);
      }

      navigateTo("/payment");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans pb-24">
      <Header />

      <div className="sticky top-0 z-10 bg-[#8A1538] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 bg-[#6b1030] rounded-full px-4 py-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider opacity-80">
            Order Summary
          </span>
          <span className="font-bold text-xl">QAR{totalPrice}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="bg-[#6b1030] text-white px-4 py-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="opacity-80">{totalItems} Ticket(s)</span>
            <span className="font-semibold">QAR{totalPrice}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#8A1538] mb-6">
            Buyer details
          </h2>

          <div className="space-y-5">
            <div className="relative">
              <Input
                data-testid="input-firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.firstName ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
                dir="auto"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
                First Name (as per ID)
              </label>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                data-testid="input-lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.lastName ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
                Last Name (as per ID)
              </label>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                data-testid="input-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.email ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
                Email ID
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="w-28">
                <Select
                  value={formData.countryCode}
                  onValueChange={(v) => handleInputChange("countryCode", v)}
                >
                  <SelectTrigger
                    data-testid="select-countryCode"
                    className="h-14 rounded-xl border-gray-200"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((cc) => (
                      <SelectItem key={cc.code} value={cc.code}>
                        {cc.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 relative">
                <Input
                  data-testid="input-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.phone ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                  placeholder=" "
                />
                <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
                  Phone Number
                </label>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Select
                value={formData.country}
                onValueChange={(v) => handleInputChange("country", v)}
              >
                <SelectTrigger
                  data-testid="select-country"
                  className={`h-14 rounded-xl ${errors.country ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                >
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.country}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                data-testid="input-city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`h-14 pt-5 pb-2 px-4 text-base border-gray-200 rounded-xl ${errors.city ? "border-red-400 bg-red-50" : "focus:border-[#8A1538]"}`}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
                City
              </label>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>
              )}
            </div>

            <div>
              <Select
                value={formData.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
              >
                <SelectTrigger
                  data-testid="select-gender"
                  className={`h-14 rounded-xl ${errors.gender ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                >
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.gender}
                </p>
              )}
            </div>

            <div>
              <Select
                value={formData.nationality}
                onValueChange={(v) => handleInputChange("nationality", v)}
              >
                <SelectTrigger
                  data-testid="select-nationality"
                  className={`h-14 rounded-xl ${errors.nationality ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                >
                  <SelectValue placeholder="Nationality" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nationality && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.nationality}
                </p>
              )}
            </div>

            <div>
              <Select
                value={formData.favoriteTeam}
                onValueChange={(v) => handleInputChange("favoriteTeam", v)}
              >
                <SelectTrigger
                  data-testid="select-team"
                  className="h-14 rounded-xl border-gray-200"
                >
                  <SelectValue placeholder="Which team are you a fan of?" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <Button
          data-testid="button-pay"
          onClick={handleSubmit}
          className="w-full h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-xl shadow-lg"
        >
          Pay
        </Button>
      </div>
    </div>
  );
}
