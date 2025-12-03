import { Header } from "@/components/arab-cup/Header";
import { EventHero } from "@/components/arab-cup/EventHero";
import { MatchCard } from "@/components/arab-cup/MatchCard";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const MATCHES = [
  {
    id: "1",
    date: "4 DEC 2025",
    dayTime: "THURSDAY - 17:30",
    matchTitle: "M10 - Palestine v. Tunisia",
    stadium: "Lusail Stadium",
    stadiumAr: "استاد لوسيل",
    price: "QAR40",
    status: "few" as const
  },
  {
    id: "2",
    date: "4 DEC 2025",
    dayTime: "THURSDAY - 21:00",
    matchTitle: "M11 - Qatar v. Bahrain",
    stadium: "Al Bayt Stadium",
    stadiumAr: "استاد البيت",
    price: "QAR60",
    status: "available" as const
  },
  {
    id: "3",
    date: "5 DEC 2025",
    dayTime: "FRIDAY - 15:00",
    matchTitle: "M12 - Egypt v. Algeria",
    stadium: "Education City Stadium",
    stadiumAr: "استاد المدينة التعليمية",
    price: "QAR40",
    status: "available" as const
  },
  {
    id: "4",
    date: "5 DEC 2025",
    dayTime: "FRIDAY - 19:00",
    matchTitle: "M13 - Saudi Arabia v. Morocco",
    stadium: "Al Thumama Stadium",
    stadiumAr: "استاد الثمامة",
    price: "QAR50",
    status: "sold_out" as const
  },
  {
    id: "5",
    date: "6 DEC 2025",
    dayTime: "SATURDAY - 16:00",
    matchTitle: "M14 - UAE v. Iraq",
    stadium: "974 Stadium",
    stadiumAr: "استاد 974",
    price: "QAR40",
    status: "available" as const
  }
];

export default function EventDetails() {
  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      <Header />
      <EventHero />
      
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold text-[#8A1538] mb-4">Matches</h2>
        
        <Button 
          variant="outline" 
          className="mb-6 h-10 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 justify-start px-4 font-medium w-auto"
        >
          <Calendar className="mr-2 h-4 w-4 text-gray-600" />
          Search by date
        </Button>

        {MATCHES.map((match) => (
          <MatchCard key={match.id} {...match} />
        ))}
      </div>
    </div>
  );
}
