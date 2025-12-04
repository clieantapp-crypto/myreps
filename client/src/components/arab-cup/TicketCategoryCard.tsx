import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCategoryCardProps {
  category: string;
  price?: string;
  imageSrc: string;
  color: string;
  isUnavailable?: boolean;
  onClick?: () => void;
}

export function TicketCategoryCard({ 
  category, 
  price, 
  imageSrc, 
  color, 
  isUnavailable,
  onClick 
}: TicketCategoryCardProps) {
  return (
    <div 
      onClick={!isUnavailable ? onClick : undefined}
      className={cn(
        "bg-white border border-gray-200 rounded-lg overflow-hidden mb-3 flex shadow-sm relative",
        !isUnavailable && "cursor-pointer hover:shadow-md transition-shadow"
      )}
      dir="rtl"
    >
      <div 
        className="w-1.5 absolute right-0 top-0 bottom-0" 
        style={{ backgroundColor: color }}
      />

      <div className="flex w-full pr-1.5">
        <div className="w-32 h-24 bg-gray-100 shrink-0">
          <img 
            src={imageSrc} 
            alt={`منظر من ${category}`} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-3 flex flex-col justify-center">
          <div className="font-bold text-gray-900 text-sm mb-1">{category}</div>
          
          {isUnavailable ? (
             <div className="bg-[#E31B23] text-white text-xs p-2 rounded leading-tight font-medium">
               لا توجد تذاكر متاحة حالياً. يرجى المحاولة مرة أخرى بعد قليل.
             </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-gray-900 text-lg">{price}</span>
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
