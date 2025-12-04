import { Calendar, MapPin } from "lucide-react";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";
import { Link } from "wouter";

export function EventCard() {
  return (
    <Link href="/event/1">
      <div className="px-4 py-6 cursor-pointer transition-transform active:scale-95">
        <div className="w-full bg-primary rounded-lg overflow-hidden shadow-lg">
          {/* Card Image/Banner Area */}
          <div className="relative h-48 bg-primary flex items-center justify-center p-6">
            {/* Background Pattern Effect (Simulated) */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

            <div className="flex flex-col items-center justify-center z-10">
              <img
                src={"/logo.svg"}
                alt="Trophy"
                className="h-32 w-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="mt-4 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            FIFA Arab Cup Qatar 2025™
          </h2>

          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-base">4 - 18 December 2025</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-base">Various stadiums, Qatar</span>
          </div>

          <div className="font-bold text-lg pt-1">QAR25</div>
        </div>
      </div>
    </Link>
  );
}
