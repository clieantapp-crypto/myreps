import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { NavigationProvider, useNavigation } from "@/context/NavigationContext";
import { useTracking } from "@/hooks/useTracking";
import { PageLoader } from "@/components/arab-cup/PageLoader";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EventDetails from "@/pages/EventDetails";
import SeatSelection from "@/pages/SeatSelection";
import Checkout from "@/pages/Checkout";
import Payment from "@/pages/Payment";
import AdminDashboard from "@/pages/AdminDashboard";
import Help from "@/pages/Help";

function Router() {
  useTracking();
  const { isNavigating } = useNavigation();
  
  return (
    <>
      <PageLoader isLoading={isNavigating} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/event/:id" component={EventDetails} />
        <Route path="/event/:id/seats" component={SeatSelection} />
        <Route path="/event/:eventId/match/:matchId/seats" component={SeatSelection} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/payment" component={Payment} />
        <Route path="/help" component={Help} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <NavigationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </NavigationProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
