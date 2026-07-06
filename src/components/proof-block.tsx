"use client";

import { useRef, useEffect, useState } from "react";
import { PROOF_ITEMS } from "@/components/site-data";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

function useCountUp(target: string, isActive: boolean, duration = 1200) {
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || isNaN(numericPart)) return;
    setCount(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numericPart * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive, numericPart, duration]);

  if (isNaN(numericPart)) return target;
  return `${count}${suffix}`;
}

function StatItem({
  metric,
  label,
  idx,
  isInView,
  isLast,
  isFirst,
}: {
  metric: string;
  label: string;
  idx: number;
  isInView: boolean;
  isLast: boolean;
  isFirst: boolean;
}) {
  const displayValue = useCountUp(metric, isInView);
  const stagger = idx * 0.18;

  return (
    <div
      className={`flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 py-6 md:py-0 md:px-8 ${
        isFirst ? "md:pl-0" : ""
      } ${!isLast ? "border-b-2 md:border-b-0 md:border-r-2 border-[var(--line)]" : ""}`}
    >
      <motion.span
        className="text-3xl md:text-4xl font-mono font-bold leading-none tabular-nums text-[var(--ink)]"
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease: EASE, delay: stagger }}
      >
        {displayValue}
      </motion.span>
      <motion.span
        className="text-xs font-mono leading-relaxed text-[var(--ink2)] max-w-[28ch]"
        initial={{ opacity: 0, x: -12 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={{ duration: 0.4, ease: EASE, delay: stagger + 0.1 }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export function ProofBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <Section
      label="PROOF"
      index={1}
      surface="recessed"
      motionTier="static"
      spacing="sm"
      className="border-y border-[var(--line)]"
      background={<GhostWord size="md" align="right" drift={80}>evidence</GhostWord>}
    >
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {PROOF_ITEMS.map((item, idx) => (
          <StatItem
            key={item.metric}
            metric={item.metric}
            label={item.label}
            idx={idx}
            isInView={isInView}
            isLast={idx === PROOF_ITEMS.length - 1}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </Section>
  );
}
