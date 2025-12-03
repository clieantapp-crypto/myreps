import { Menu, User, ShoppingCart } from "lucide-react";
export function Header() {
  return (
    <header className="bg-primary text-white h-16 px-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
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
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
