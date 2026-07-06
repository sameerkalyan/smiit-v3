"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CyberCityCanvas } from "./cyber-city-canvas";

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function CyberCityBackground({ active = false }: { active?: boolean }) {
  const mounted = useHydrated();
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out bg-[#11141b]"
      style={{ opacity: mounted ? 1 : 0 }}
      aria-hidden="true"
    >
      {mounted && <CyberCityCanvas active={active && inView} />}
    </div>
  );
}
