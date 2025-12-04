import { Menu, User, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { SideMenu } from "./SideMenu";
import { useCart } from "@/context/CartContext";
import { useNavigation } from "@/context/NavigationContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigateTo } = useNavigation();
  const { totalItems } = useCart();

  return (
    <>
      <header className="bg-primary text-white h-16 px-4 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-openMenu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={"/logo.svg"}
              alt="Logo"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateTo("/checkout")}
            className="p-1 hover:bg-white/10 rounded-full transition-colors relative"
            data-testid="button-cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e87722] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
