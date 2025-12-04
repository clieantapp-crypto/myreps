import { X, Eye, Armchair, MapPin, Ticket, Plus, Minus } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
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
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
  const total = numericPrice * quantity;

  const increment = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(matchId, categoryId, quantity);
      toast({
        title: "تمت الإضافة للسلة",
        description: `تمت إضافة ${quantity} تذكرة لـ ${category} إلى سلتك.`,
      });
      setQuantity(1);
      onClose();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل إضافة التذاكر للسلة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-[35vh] relative shrink-0">
             <img 
               src={imageSrc} 
               alt="منظر المقعد" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto" dir="rtl">
            <div className="p-6 pb-32">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{category}</h2>
                <div className="text-xl font-bold text-gray-600">{price}</div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-6">ما المتضمن</h3>
              
              <div className="space-y-8">
                 <div className="flex gap-4">
                    <Eye className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">توصيل التذاكر</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         التذاكر متاحة في تطبيق Road to Qatar
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <Armchair className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">تخصيص المقعد</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         تعيين المقعد في أي مكان ضمن الفئة المختارة
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">ضمان الجلوس معاً</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         التذاكر المشتراة معاً تُجلس دائماً معاً
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <Ticket className="w-6 h-6 text-gray-800 shrink-0" />
                    <div>
                       <div className="font-bold text-gray-900 mb-1">تذاكر موثقة</div>
                       <div className="text-sm text-gray-600 leading-relaxed">
                         التذاكر يتم مراجعتها والتحقق منها من قبل المكان
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb" dir="rtl">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                   <button 
                     onClick={decrement}
                     className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
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
                   {total} ريال
                </div>
             </div>

             <Button 
               className="w-full h-12 bg-[#8A1538] hover:bg-[#70102d] text-white text-lg font-bold rounded-lg"
               onClick={handleAddToCart}
               disabled={isAdding}
             >
                {isAdding ? "جاري الإضافة..." : "أضف للسلة"}
             </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
