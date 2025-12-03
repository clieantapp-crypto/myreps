import { Header } from "@/components/arab-cup/Header";
import { EventHero } from "@/components/arab-cup/EventHero";
import { MatchCard } from "@/components/arab-cup/MatchCard";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function EventDetails() {
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches", 1],
    queryFn: async () => {
      const response = await fetch("/api/matches?eventId=1");
      if (!response.ok) throw new Error("Failed to fetch matches");
      return response.json();
    },
  });

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

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading matches...</div>
        ) : (
          matches?.map((match: any) => (
            <MatchCard 
              key={match.id}
              id={match.id.toString()}
              date={match.date}
              dayTime={`${match.dayOfWeek} - ${match.time}`}
              matchTitle={`${match.matchCode} - ${match.homeTeam} v. ${match.awayTeam}`}
              stadium={match.stadium}
              stadiumAr={match.stadiumAr || ""}
              price={`QAR${match.basePrice}`}
              status={match.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
