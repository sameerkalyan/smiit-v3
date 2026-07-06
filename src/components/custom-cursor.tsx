"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CustomCursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reducedMotion;

  const [active, setActive] = useState(false);

  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const ringSpringX = useSpring(ringX, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringSpringY = useSpring(ringY, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, [role='button'], [data-cursor]");
      setActive(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [enabled, ringX, ringY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div style={{ x: ringSpringX, y: ringSpringY }} className="absolute">
        <motion.div
          className="h-8 w-8 border border-[var(--brutalist-accent-light)]"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1.6 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </div>
  );
}
