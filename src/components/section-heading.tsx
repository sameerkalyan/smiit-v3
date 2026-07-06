"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

interface SectionHeadingProps {
  children: string;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}

export function SectionHeading({
  children,
  subtitle,
  as: Tag = "h2",
  className,
  delay = 0,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className ?? ""}`}>
      <Tag className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-[var(--ink)]">
        <motion.span
          style={{ display: "inline" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.5, ease: EASE, delay }}
        >
          {children}
        </motion.span>
      </Tag>
      {subtitle && (
        <p className="text-xs lg:text-sm font-mono text-[var(--ink3)] leading-relaxed mt-3 max-w-md">
          {subtitle}
        </p>
      )}
    </div>
  );
}
