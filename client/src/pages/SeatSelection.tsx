import { MatchHeader } from "@/components/arab-cup/MatchHeader";
import { TicketCategoryCard } from "@/components/arab-cup/TicketCategoryCard";
import { FullPartnersList } from "@/components/arab-cup/FullPartnersList";
import { SeatPreviewModal } from "@/components/arab-cup/SeatPreviewModal";
import stadiumMap from "@assets/generated_images/stadium_seating_chart_map_top_down_view.png";
import viewCat1 from "@assets/generated_images/view_from_stadium_seats_category_1.png";
import viewCat2 from "@assets/generated_images/view_from_stadium_seats_category_2.png";
import viewCat3 from "@assets/generated_images/view_from_stadium_seats_category_3.png";
import {
  ArrowDownAZ,
  Accessibility,
  Ticket,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useCart, CartItemWithDetails } from "@/context/CartContext";
import { useNavigation } from "@/context/NavigationContext";
import { Button } from "@/components/ui/button";

const categoryImages: Record<string, string> = {
  "CAT 1": viewCat1,
  "CAT 2": viewCat2,
  "CAT 3": viewCat3,
};

export default function SeatSelection() {
  const params = useParams();
  const { navigateTo } = useNavigation();
  const matchId = params.id || params.matchId;
  const { items, totalItems, totalPrice, removeItem, updateQuantity } =
    useCart();

  const [activeTab, setActiveTab] = useState<"price" | "tickets">("price");
  const [showCartSummary, setShowCartSummary] = useState(false);
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

  const handleBuyTickets = () => {
    if (totalItems > 0) {
      navigateTo("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans pb-32">
      <MatchHeader />

      <div className="w-full bg-white p-6 flex justify-center items-center min-h-[280px] relative shadow-sm">
        <img
          src={stadiumMap}
          alt="Stadium Map"
          className="w-full max-w-xl object-contain"
        />
        <div className="absolute top-6 right-4 flex flex-col gap-2 text-[10px] font-bold uppercase">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 bg-[#1e3a8a] rounded-full"></div>
            <span className="text-gray-700">CAT 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 bg-[#84cc16] rounded-full"></div>
            <span className="text-gray-700">CAT 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 bg-[#dc2626] rounded-full"></div>
            <span className="text-gray-700">CAT 3</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
          <button
            data-testid="tab-priceList"
            onClick={() => setActiveTab("price")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "price"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-gray-400">:::</span> Price list
          </button>
          <button
            data-testid="tab-yourTickets"
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "tickets"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Ticket className="w-4 h-4" /> Your tickets
            {totalItems > 0 && (
              <span className="bg-[#8A1538] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "price" && (
        <>
          <div className="px-4 mb-4 flex justify-end">
            <button className="text-xs font-medium text-gray-500 flex items-center gap-1 hover:text-gray-700">
              Sort by price <ArrowDownAZ className="w-3 h-3" />
            </button>
          </div>

          <div className="px-4">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                Loading seat categories...
              </div>
            ) : (
              categories?.map((category: any) => {
                const imageSrc = categoryImages[category.category] || viewCat1;

                return (
                  <TicketCategoryCard
                    key={category.id}
                    category={category.category}
                    price={
                      category.available ? `QAR${category.price}` : undefined
                    }
                    imageSrc={imageSrc}
                    color={category.colorCode}
                    isUnavailable={!category.available}
                    onClick={
                      category.available
                        ? () =>
                            setSelectedCategory({
                              id: category.id,
                              category: category.category,
                              price: `QAR${category.price}`,
                              imageSrc,
                            })
                        : undefined
                    }
                  />
                );
              })
            )}

            <div className="mt-6 flex gap-3 items-start text-xs text-[#008CBA] bg-blue-50 rounded-xl p-4">
              <Accessibility className="w-5 h-5 shrink-0" />
              <div className="leading-relaxed">
                Accessibility tickets are available by emailing <br />
                <span className="underline font-medium">
                  accessibility.tickets@sc.qa
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "tickets" && (
        <div className="px-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tickets selected
              </h3>
              <p className="text-gray-500 text-sm">
                Select tickets from the price list to add them to your cart
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItemWithDetails) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        {item.categoryName || "Category"}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.matchCode} - {item.homeTeam} v. {item.awayTeam}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.date} • {item.time}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-lg font-bold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.min(10, item.quantity + 1),
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-[#8A1538]">
                      QAR{(item.price || 0) * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={() => setShowCartSummary(!showCartSummary)}
            className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <ChevronUp
                className={`w-4 h-4 transition-transform ${showCartSummary ? "rotate-180" : ""}`}
              />
              <Ticket className="w-4 h-4" />
              <span className="font-semibold">{totalItems} Tickets</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              QAR{totalPrice}
            </span>
          </button>

          {showCartSummary && (
            <div className="px-4 py-3 bg-gray-50 max-h-40 overflow-y-auto">
              {items.map((item: CartItemWithDetails) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-1.5"
                >
                  <span className="text-gray-600">
                    {item.quantity}x {item.categoryName}
                  </span>
                  <span className="font-medium">
                    QAR{(item.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="p-4">
            <Button
              data-testid="button-buyTickets"
              onClick={handleBuyTickets}
              className="w-full h-14 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-xl shadow-lg"
            >
              Buy Your Tickets
            </Button>
          </div>
        </div>
      )}
      <FullPartnersList />

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
