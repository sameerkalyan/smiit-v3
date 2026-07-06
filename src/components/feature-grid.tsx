"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/motion";

type FeatureGridLayout = "timeline" | "grid";

interface FeatureGridProps {
  children: ReactNode;
  layout?: FeatureGridLayout;
  columns?: 2 | 3 | 4;
  className?: string;
  stagger?: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

function FeatureGridRoot({
  children,
  layout = "grid",
  columns = 3,
  className,
  stagger = 0.1,
}: FeatureGridProps) {
  if (layout === "timeline") {
    return (
      <motion.div
        className={`flex flex-col gap-6 relative ${className ?? ""}`}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: 0 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px 0px" }}
      >
        {children}
      </motion.div>
    );
  }

  const colMap: Record<number, string> = {
    2: "grid grid-cols-1 md:grid-cols-2",
    3: "grid grid-cols-1 md:grid-cols-3",
    4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={`${colMap[columns]} gap-0 ${className ?? ""}`}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: 0 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px 0px" }}
    >
      {children}
    </motion.div>
  );
}

interface FeatureItemProps {
  children: ReactNode;
  step?: string | number;
  accent?: boolean;
  isLast?: boolean;
  className?: string;
}

function FeatureItem({ children, step, accent, isLast, className }: FeatureItemProps) {
  if (step !== undefined) {
    return (
      <motion.div
        className={`relative flex gap-5 md:gap-8 ${className ?? ""}`}
        variants={itemVariants}
      >
        <div className="relative z-10 shrink-0">
          <div
            className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 font-mono font-bold text-sm md:text-base ${
              accent
                ? "border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                : "border-[var(--brutalist-accent)] bg-[var(--pa2)] text-[var(--brutalist-accent)]"
            }`}
            aria-hidden="true"
          >
            {step}
          </div>
          {!isLast && (
            <div className="absolute left-1/2 -translate-x-1/2 top-[40px] md:top-[56px] bottom-[-24px] w-[2px] bg-[var(--brutalist-accent)] opacity-20" />
          )}
        </div>
        <div className="flex-1 pt-1">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export const FeatureGrid = Object.assign(FeatureGridRoot, {
  Item: FeatureItem,
});
