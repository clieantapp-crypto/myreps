import { ChevronLeft, Info, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";

export function MatchHeader() {
  return (
    <div className="bg-[#8A1538] text-white px-4 py-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/event/1">
            <button className="mt-1 p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-tight mb-1">M10 - Palestine v. Tunisia</h1>
            <div className="text-xs text-white/90 font-medium mb-1">FIFA Arab Cup Qatar 2025™</div>
            <div className="flex items-center gap-3 text-xs text-white/80">
               <div className="flex items-center gap-1">
                 <Calendar className="w-3 h-3" />
                 {/* Placeholder date/time logic if dynamic */}
               </div>
               <div className="flex items-center gap-1">
                 <MapPin className="w-3 h-3" />
                 <span>Lusail Stadium</span>
                 <span className="font-arabic">استاد لوسيل</span>
               </div>
            </div>
          </div>
        </div>

        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <Info className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
