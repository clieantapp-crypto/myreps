import { ChevronLeft, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";

export function EventHero() {
  return (
    <div>
      {/* Dark Hero Section */}
      <div className="relative bg-[#2d0a16] text-white px-4 pt-4 pb-6">
        <Link href="/">
          <button className="mb-6 p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </Link>

        <div className="flex flex-col items-center mb-2">
           <img 
            src={trophyImage} 
            alt="Trophy" 
            className="h-32 w-auto opacity-90 drop-shadow-2xl"
          />
          <div className="mt-2 text-center font-bold tracking-wider uppercase text-gray-200">
             <div className="text-xl">FIFA Arab Cup</div>
             <div className="text-xl">Qatar 2025</div>
          </div>
        </div>
        
        <div className="mt-8">
          <h1 className="text-lg font-bold">FIFA Arab Cup Qatar 2025™</h1>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex flex-col gap-3 text-gray-600">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <span className="text-base">4 - 18 December 2025</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <span className="text-base">Various stadiums, Qatar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
