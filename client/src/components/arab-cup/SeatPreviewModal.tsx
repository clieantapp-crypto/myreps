import { X, Eye, Armchair, MapPin, Ticket, Plus, Minus } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SeatPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  matchId: number;
  category: string;
  price: string;
  imageSrc: string;
}

export function SeatPreviewModal({ 
  isOpen, 
  onClose, 
  categoryId,
  matchId,
  category, 
  price, 
  imageSrc 
}: SeatPreviewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  
  // Parse numeric price for calculation
  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
  const total = numericPrice * quantity;

  const increment = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          matchId,
          categoryId,
          quantity,
        }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${quantity} ticket(s) for ${category} added to your cart.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add tickets to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header Image */}
          <div className="w-full h-[35vh] relative shrink-0">
             <img 
               src={imageSrc} 
               alt="Seat View" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pb-32">
              {/* Header Info */}
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{category}</h2>
                <div className="text-xl font-bold text-gray-600">{price}</div>
              </div>

              {/* What's Included */}
              <h3 className="text-lg font-bold text-gray-900 mb-6">What's included</h3>
              
              <div className="space-y-8">
                 {/* Feature 1 */}
                 <div className="flex gap-4">
                    <Eye className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">Ticket delivery</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         Tickets available in the Road to Qatar app
                       </div>
                    </div>
                 </div>

                 {/* Feature 2 */}
                 <div className="flex gap-4">
                    <Armchair className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">Seat allocation</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         Seat assignment anywhere within the chosen category
                       </div>
                    </div>
                 </div>

                 {/* Feature 3 */}
                 <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">Sit together guarantee</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         Tickets bought together are always seated together
                       </div>
                    </div>
                 </div>

                 {/* Feature 4 */}
                 <div className="flex gap-4">
                    <Ticket className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">Verified tickets</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         Tickets are reviewed and verified by the venue
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                   <button 
                     onClick={decrement}
                     className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                     disabled={quantity <= 1}
                   >
                      <Minus className="w-5 h-5 text-gray-600" />
                   </button>
                   <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                   <button 
                     onClick={increment}
                     className="w-10 h-10 rounded-full bg-[#8A1538] text-white flex items-center justify-center hover:bg-[#70102d] active:bg-[#5c0d25] transition-colors"
                   >
                      <Plus className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="text-xl font-bold text-gray-900">
                   QAR{total}
                </div>
             </div>

             <Button 
               className="w-full h-12 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-lg"
               onClick={() => addToCartMutation.mutate()}
               disabled={addToCartMutation.isPending}
             >
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
             </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
