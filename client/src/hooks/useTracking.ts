import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackVisitor, updateOnlineStatus, trackPageView } from "@/lib/firebase";

export function useTracking() {
  const [location] = useLocation();

  useEffect(() => {
    trackVisitor(location);

    const handleVisibilityChange = () => {
      updateOnlineStatus(!document.hidden);
    };

    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    const heartbeat = setInterval(() => {
      if (!document.hidden) {
        updateOnlineStatus(true);
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(heartbeat);
    };
  }, []);

  useEffect(() => {
    if (location) {
      trackPageView(location);
    }
  }, [location]);
}
