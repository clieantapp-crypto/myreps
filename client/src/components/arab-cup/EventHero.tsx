import { ChevronRight, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";

export function EventHero() {
  return (
    <div dir="rtl">
      <div className="relative bg-[#2d0a16] text-white px-4 pt-4 pb-6">
        <Link href="/">
          <button className="mb-6 p-1 -mr-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </Link>

        <div className="flex flex-col items-center mb-2">
          <img
            src={"/3072082_655725_1763366704671.png"}
            alt="Trophy"
            className="h-32 w-auto opacity-90 drop-shadow-2xl"
          />
        </div>

        <div className="mt-8">
          <h1 className="text-lg font-bold">كأس العرب FIFA قطر 2025™</h1>
        </div>
      </div>

      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex flex-col gap-3 text-gray-600">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <span className="text-base">٤ - ١٨ ديسمبر ٢٠٢٥</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <span className="text-base">ملاعب متعددة، قطر</span>
          </div>
        </div>
      </div>
    </div>
  );
}
