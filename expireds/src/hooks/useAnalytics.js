import { useEffect } from "react";
import ReactGA from "react-ga4";

export function useAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV === "prod") {
      const GA_KEY = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY;
      if (!GA_KEY) {
        console.warn("Google Analytics key is missing");
        return;
      }

      ReactGA.initialize(GA_KEY);
      ReactGA.send("pageview");
    }
  }, []);
}
