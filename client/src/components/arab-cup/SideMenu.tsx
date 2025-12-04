import { X, Home, HelpCircle, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useNavigation } from "@/context/NavigationContext";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [location] = useLocation();
  const { navigateTo } = useNavigation();

  const handleNavigation = (path: string) => {
    onClose();
    if (location !== path) {
      navigateTo(path);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#0a7f3f] z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-[#8A1538] h-16 px-4 flex items-center">
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-closeMenu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 py-2">
          <button
            onClick={() => handleNavigation("/")}
            data-testid="menu-matches"
            className={`w-full flex items-center gap-4 px-6 py-4 text-white font-medium text-base transition-colors ${
              location === "/" || location.startsWith("/event") 
                ? "bg-[#e87722]" 
                : "hover:bg-white/10"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Matches</span>
          </button>

          <button
            onClick={() => handleNavigation("/help")}
            data-testid="menu-help"
            className={`w-full flex items-center gap-4 px-6 py-4 text-white font-medium text-base transition-colors ${
              location === "/help" 
                ? "bg-[#e87722]" 
                : "hover:bg-white/10"
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </button>
        </nav>

        <div className="mt-auto border-t border-white/20">
          <button 
            className="w-full flex items-center justify-center gap-2 py-4 text-white bg-white/10 hover:bg-white/20 transition-colors"
            data-testid="button-language"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">English UK</span>
          </button>
          
          <div className="px-6 py-4 text-white/80 text-sm">
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
              <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Legal Warning</a>
              <span>·</span>
            </div>
            <a href="#" className="hover:text-white transition-colors block mb-4">Privacy Policy</a>
            <p className="text-white/60">© Copyright 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}
