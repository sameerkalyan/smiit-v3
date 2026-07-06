"use client";

import { useRef } from "react";
import { FrameworksMarquee } from "@/components/frameworks-marquee";
import { FRAMEWORKS } from "@/components/site-data";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

export function FrameworksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <Section
      id="frameworks"
      label="FRAMEWORKS"
      index={5}
      surface="base"
      motionTier="static"
      background={<GhostWord size="md" align="right" drift={90}>standards</GhostWord>}
    >
      <SectionHeading subtitle="Regulatory, security, and AI-specific frameworks integrated into our methodology.">
        Every engagement anchored to recognised standards.
      </SectionHeading>

      <FrameworksMarquee />

      <div ref={ref} className="mt-12">
        {FRAMEWORKS.map((fw, idx) => {
          const rowDelay = idx * 0.15;
          return (
            <div
              key={fw.id}
              className="grid grid-cols-[5rem_9rem_1fr] md:grid-cols-[6rem_10rem_1fr] items-center gap-2 md:gap-4 py-4 border-b border-[var(--line)] first:border-t"
            >
              <motion.span
                className="text-[10px] font-mono font-medium uppercase tracking-widest px-2 py-0.5 border-2 border-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-light)] w-fit"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: EASE, delay: rowDelay }}
              >
                {fw.category}
              </motion.span>
              <motion.span
                className="text-sm font-mono font-bold tracking-tight uppercase text-[var(--ink)]"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE, delay: rowDelay + 0.1 }}
              >
                {fw.name}
              </motion.span>
              <motion.span
                className="text-xs font-mono text-[var(--ink2)]"
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease: EASE, delay: rowDelay + 0.15 }}
              >
                {fw.description}
              </motion.span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
