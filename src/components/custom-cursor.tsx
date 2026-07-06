"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CustomCursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reducedMotion;

  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const dotX = useSpring(cursorX, { stiffness: 1200, damping: 45, mass: 0.1 });
  const dotY = useSpring(cursorY, { stiffness: 1200, damping: 45, mass: 0.1 });
  const ringSpringX = useSpring(ringX, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringSpringY = useSpring(ringY, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, [role='button'], [data-cursor]");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [enabled, cursorX, cursorY, ringX, ringY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div style={{ x: dotX, y: dotY }} className="absolute">
        <motion.div
          className="h-1.5 w-1.5 bg-white mix-blend-difference"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: hovering ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
      <motion.div style={{ x: ringSpringX, y: ringSpringY }} className="absolute">
        <motion.div
          className="h-8 w-8 border border-white mix-blend-difference"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: hovering ? 2 : 1, opacity: hovering ? 0.6 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </div>
  );
}
