"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

type Surface = "base" | "recessed" | "elevated" | "highlight";
type MotionTier = "active" | "supported" | "static";
type Spacing = "sm" | "md" | "lg";

interface SectionProps {
  children: ReactNode;
  id?: string;
  label?: string;
  index?: number | string;
  surface?: Surface;
  motionTier?: MotionTier;
  spacing?: Spacing;
  className?: string;
}

const surfaceMap: Record<Surface, string> = {
  base: "bg-[var(--surface-base)]",
  recessed: "bg-[var(--surface-recessed)]",
  elevated: "bg-[var(--surface-elevated)]",
  highlight: "bg-[var(--surface-highlight)] text-[var(--brutalist-accent-foreground)]",
};

const spacingMap: Record<Spacing, string> = {
  sm: "py-14",
  md: "py-16 lg:py-20",
  lg: "py-20 lg:py-24",
};

const activeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const supportedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE },
  },
};

const staticVariants: Variants = {
  hidden: {},
  visible: {},
};

const motionVariants: Record<MotionTier, Variants> = {
  active: activeVariants,
  supported: supportedVariants,
  static: staticVariants,
};

export function Section({
  children,
  id,
  label,
  index,
  surface = "base",
  motionTier = "supported",
  spacing = "md",
  className,
}: SectionProps) {
  const isHighlight = surface === "highlight";
  const showLabel = Boolean(label);

  return (
    <motion.section
      id={id}
      aria-label={label ? String(label).replace(/_/g, " ") : undefined}
      className={cn(
        "w-full px-6 lg:px-12",
        surfaceMap[surface],
        spacingMap[spacing],
        className
      )}
      variants={motionVariants[motionTier]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px 0px" }}
    >
      <div className="mx-auto max-w-7xl">
        {showLabel && (
          <div className="flex items-center gap-4 mb-8">
            <span
              className={cn(
                "brutalist-section-label",
                isHighlight && "text-[var(--brutalist-accent-foreground)]/50"
              )}
            >
              {index !== undefined ? `SECTION: ${label}` : label}
            </span>
            <div className="flex-1 border-t border-[var(--line)]" />
            {index !== undefined && (
              <span
                className={cn(
                  "brutalist-section-label",
                  isHighlight && "text-[var(--brutalist-accent-foreground)]/50"
                )}
              >
                {String(index).padStart(3, "0")}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.section>
  );
}
