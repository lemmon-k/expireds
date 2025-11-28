import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => {
    // Avoid errors on server-side rendering
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
