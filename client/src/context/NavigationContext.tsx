import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocation } from "wouter";

interface NavigationContextType {
  isNavigating: boolean;
  navigateTo: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [, setLocation] = useLocation();

  const navigateTo = useCallback((path: string) => {
    setIsNavigating(true);
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        setLocation(path);
        setIsNavigating(false);
      }, 150);
    });
  }, [setLocation]);

  return (
    <NavigationContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
