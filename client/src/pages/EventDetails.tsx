import { Header } from "@/components/arab-cup/Header";
import { EventHero } from "@/components/arab-cup/EventHero";
import { MatchCard } from "@/components/arab-cup/MatchCard";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        <MatchCard />
        {/* Duplicate for demo purposes if needed, but user asked for specific card */}
      </div>
    </div>
  );
}
