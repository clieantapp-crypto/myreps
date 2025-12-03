import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CartItem {
  id: number;
  sessionId: string;
  matchId: number;
  categoryId: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (matchId: number, categoryId: number, quantity: number, price: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  sessionId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getSessionId = () => {
  let sessionId = localStorage.getItem("cartSessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("cartSessionId", sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(getSessionId);
  const [priceMap, setPriceMap] = useState<Record<number, number>>({});
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum: number, item: CartItem) => {
    const price = priceMap[item.categoryId] || 60;
    return sum + (price * item.quantity);
  }, 0);

  const addToCart = async (matchId: number, categoryId: number, quantity: number, price: number) => {
    setPriceMap(prev => ({ ...prev, [categoryId]: price }));
    
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, matchId, categoryId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const updateQuantity = async (id: number, quantity: number) => {
    const response = await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update cart");
    queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const removeItem = async (id: number) => {
    const response = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to remove item");
    queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const clearCart = async () => {
    const response = await fetch(`/api/cart/session/${sessionId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to clear cart");
    queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      totalItems,
      totalPrice,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      sessionId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
