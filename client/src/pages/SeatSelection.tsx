import { MatchHeader } from "@/components/arab-cup/MatchHeader";
import { TicketCategoryCard } from "@/components/arab-cup/TicketCategoryCard";
import { FullPartnersList } from "@/components/arab-cup/FullPartnersList";
import { SeatPreviewModal } from "@/components/arab-cup/SeatPreviewModal";
import stadiumMap from "@assets/generated_images/stadium_seating_chart_map_top_down_view.png";
import viewCat1 from "@assets/generated_images/view_from_stadium_seats_category_1.png";
import viewCat2 from "@assets/generated_images/view_from_stadium_seats_category_2.png";
import viewCat3 from "@assets/generated_images/view_from_stadium_seats_category_3.png";
import { ArrowDownAZ, Accessibility } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const categoryImages: Record<string, string> = {
  "CAT 1": viewCat1,
  "CAT 2": viewCat2,
  "CAT 3": viewCat3,
};

export default function SeatSelection() {
  const params = useParams();
  const matchId = params.id;

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    category: string;
    price: string;
    imageSrc: string;
  } | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["seatCategories", matchId],
    queryFn: async () => {
      const response = await fetch(`/api/seat-categories?matchId=${matchId}`);
      if (!response.ok) throw new Error("Failed to fetch seat categories");
      return response.json();
    },
    enabled: !!matchId,
  });

  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      <MatchHeader />
      
      {/* Stadium Map Area */}
      <div className="w-full bg-white p-8 flex justify-center items-center min-h-[300px] relative">
         <img 
           src={stadiumMap} 
           alt="Stadium Map" 
           className="w-full max-w-xs object-contain"
         />
         {/* Legend Overlay */}
         <div className="absolute top-8 right-4 flex flex-col gap-2 text-[10px] font-bold uppercase">
            <div className="flex items-center gap-1.5">
               <div className="w-0.5 h-3 bg-[#1e3a8a]"></div>
               <span>CAT 1</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-0.5 h-3 bg-[#84cc16]"></div>
               <span>CAT 2</span>
            </div>
             <div className="flex items-center gap-1.5">
               <div className="w-0.5 h-3 bg-[#dc2626]"></div>
               <span>CAT 3</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
           <button className="flex-1 py-2 text-sm font-bold text-gray-900 bg-gray-100 rounded shadow-sm flex items-center justify-center gap-2">
              <span className="text-gray-500">::</span> Price list
           </button>
           <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
              <span className="text-gray-400">□</span> Your tickets
           </button>
        </div>
      </div>

      {/* Sort */}
      <div className="px-4 mb-4 flex justify-end">
         <button className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Sort by price <ArrowDownAZ className="w-3 h-3" />
         </button>
      </div>

      {/* Ticket List */}
      <div className="px-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading seat categories...</div>
        ) : (
          categories?.map((category: any) => {
            const imageSrc = categoryImages[category.category] || viewCat1;
            
            return (
              <TicketCategoryCard 
                key={category.id}
                category={category.category}
                price={category.available ? `QAR${category.price}` : undefined}
                imageSrc={imageSrc}
                color={category.colorCode}
                isUnavailable={!category.available}
                onClick={category.available ? () => setSelectedCategory({
                  id: category.id,
                  category: category.category,
                  price: `QAR${category.price}`,
                  imageSrc
                }) : undefined}
              />
            );
          })
        )}
        
        {/* Accessibility Info */}
        <div className="mt-6 flex gap-3 items-start text-xs text-[#008CBA]">
           <Accessibility className="w-5 h-5 shrink-0" />
           <div className="leading-relaxed">
              Accessibility tickets are available by emailing <br/>
              <span className="underline">accessibility.tickets@sc.qa</span>
           </div>
        </div>
      </div>

      <FullPartnersList />

      {/* Modal */}
      {selectedCategory && (
        <SeatPreviewModal 
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          categoryId={selectedCategory.id}
          matchId={parseInt(matchId || "1")}
          category={selectedCategory.category}
          price={selectedCategory.price}
          imageSrc={selectedCategory.imageSrc}
        />
      )}
    </div>
  );
}
