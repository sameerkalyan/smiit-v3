"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={isVisible ? undefined : true}
      className={`back-to-top fixed bottom-8 right-8 z-40 inline-flex items-center justify-center w-12 h-12 bg-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-foreground)] border-2 border-[var(--ink)] active:scale-95 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={18} strokeWidth={3} />
    </button>
  );
}