import { Calendar, MapPin, Bell, CheckCircle2, XCircle } from "lucide-react";
import trophyImage from "@assets/generated_images/abstract_silver_and_burgundy_trophy_cup_logo.png";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface MatchCardProps {
  id: string;
  date: string;
  dayTime: string;
  matchTitle: string;
  stadium: string;
  stadiumAr: string;
  price: string;
  status: "few" | "available" | "sold_out";
}

export function MatchCard({
  id,
  date,
  dayTime,
  matchTitle,
  stadium,
  stadiumAr,
  price,
  status,
}: MatchCardProps) {
  return (
    <Link href={`/event/${id}/seats`}>
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 mb-6 cursor-pointer hover:shadow-md transition-all group">
        {/* Card Image Banner */}
        <div className="relative h-40 bg-primary flex items-center justify-center p-4 overflow-hidden">
          {/* Background Pattern Effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <div className="flex items-center gap-3 z-10 group-hover:scale-105 transition-transform duration-500">
            <img
              src={"/3072082_655725_1763366704671.png"}
              alt="Trophy"
              className="h-24 w-auto drop-shadow-xl"
            />
          </div>
        </div>

        {/* Match Details */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
            <span className="text-gray-400">•</span>
            <span>{dayTime}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{matchTitle}</h3>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <div className="flex gap-2 items-baseline">
              <span>{stadium}</span>
              <span className="font-arabic text-sm">{stadiumAr}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {status === "few" && (
              <Badge
                variant="secondary"
                className="bg-red-50 text-red-600 hover:bg-red-100 border-0 rounded-sm px-2 py-1 font-normal flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 fill-current" />
                Few tickets left
              </Badge>
            )}
            {status === "available" && (
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-600 hover:bg-green-100 border-0 rounded-sm px-2 py-1 font-normal flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tickets Available
              </Badge>
            )}
            {status === "sold_out" && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-0 rounded-sm px-2 py-1 font-normal flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Sold Out
              </Badge>
            )}
          </div>

          <div className="font-bold text-lg text-gray-900">{price}</div>
        </div>
      </div>
    </Link>
  );
}
