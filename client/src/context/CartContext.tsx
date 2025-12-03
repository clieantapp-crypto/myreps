import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface CartItemWithDetails {
  id: number;
  sessionId: string;
  matchId: number;
  categoryId: number;
  quantity: number;
  categoryName: string | null;
  price: number | null;
  colorCode: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  matchCode: string | null;
  date: string | null;
  time: string | null;
  stadium: string | null;
}

interface CartContextType {
  items: CartItemWithDetails[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (matchId: number, categoryId: number, quantity: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  sessionId: string;
  refetch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'default';
  let sessionId = localStorage.getItem("cartSessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("cartSessionId", sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState<string>(() => getSessionId());
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${sessionId}/details`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
    enabled: !!sessionId,
  });

  const totalItems = items.reduce((sum: number, item: CartItemWithDetails) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum: number, item: CartItemWithDetails) => {
    const price = item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const addToCart = async (matchId: number, categoryId: number, quantity: number) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, matchId, categoryId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    await queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const updateQuantity = async (id: number, quantity: number) => {
    const response = await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update cart");
    await queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const removeItem = async (id: number) => {
    const response = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to remove item");
    await queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const clearCart = async () => {
    const response = await fetch(`/api/cart/session/${sessionId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to clear cart");
    await queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  };

  const value: CartContextType = {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    sessionId,
    refetch,
  };

  return (
    <CartContext.Provider value={value}>
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
