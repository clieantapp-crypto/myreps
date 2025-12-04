import { Calendar, MapPin } from "lucide-react";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";
import { Link } from "wouter";

export function EventCard() {
  return (
    <Link href="/event/1">
      <div className="px-4 py-6 cursor-pointer transition-transform active:scale-95" dir="rtl">
        <div className="w-full bg-primary rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-48 bg-primary flex items-center justify-center p-6">
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

        <div className="mt-4 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            كأس العرب FIFA قطر 2025™
          </h2>

          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-base">٤ - ١٨ ديسمبر ٢٠٢٥</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-base">ملاعب متعددة، قطر</span>
          </div>

          <div className="font-bold text-lg pt-1">٢٥ ريال قطري</div>
        </div>
      </div>
    </Link>
  );
}
