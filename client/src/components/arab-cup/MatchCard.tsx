import { Calendar, MapPin, Bell } from "lucide-react";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function MatchCard() {
  return (
    <Link href="/event/1/seats">
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 mb-6 cursor-pointer hover:shadow-md transition-all">
        {/* Card Image Banner */}
        <div className="relative h-40 bg-primary flex items-center justify-center p-4 overflow-hidden">
           {/* Background Pattern Effect */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <div className="flex items-center gap-3 z-10">
            <img 
              src={trophyImage} 
              alt="Trophy" 
              className="h-24 w-auto drop-shadow-xl"
            />
            <div className="flex flex-col text-white font-bold uppercase tracking-wider leading-tight">
               <span className="text-lg">FIFA Arab Cup</span>
               <span className="text-lg">Qatar 2025</span>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-3">
            <Calendar className="w-4 h-4" />
            <span>4 DEC 2025</span>
            <span className="text-gray-400">•</span>
            <span>THURSDAY - 17:30</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            M10 - Palestine v. Tunisia
          </h3>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <div className="flex gap-2 items-baseline">
               <span>Lusail Stadium</span>
               <span className="font-arabic text-sm">استاد لوسيل</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border-0 rounded-sm px-2 py-1 font-normal flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 fill-current" />
              Few tickets left
            </Badge>
          </div>

          <div className="font-bold text-lg text-gray-900">
            QAR40
          </div>
        </div>
      </div>
    </Link>
  );
}
