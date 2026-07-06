"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

interface GhostWordProps {
  children: string;
  className?: string;
  drift?: number;
  opacityRange?: [number, number, number];
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "right" | "center";
}

const sizeMap = {
  sm: "text-[10rem] lg:text-[14rem]",
  md: "text-[14rem] lg:text-[18rem]",
  lg: "text-[18rem] lg:text-[24rem]",
  xl: "text-[24rem] lg:text-[32rem]",
} as const;

const alignMap = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
} as const;

export function GhostWord({
  children,
  className = "",
  drift = 120,
  opacityRange = [0.03, 0.09, 0.03],
  size = "lg",
  align = "right",
}: GhostWordProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], opacityRange);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute top-1/2 -translate-y-1/2 ${alignMap[align]} pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      <motion.span
        style={{ y, opacity }}
        className={`block ${sizeMap[size]} font-mono font-bold leading-[0.85] tracking-tighter uppercase whitespace-nowrap text-[var(--ink)]`}
      >
        {children}
      </motion.span>
    </div>
  );
}

export type { MotionValue };
