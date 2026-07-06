"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ENGAGEMENT_PHASES } from "@/components/site-data";
import { Check } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { EASE } from "@/lib/motion";

export function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px 0px" });

  return (
    <Section
      id="how-we-work"
      label="OPERATING_MODEL"
      index={4}
      surface="recessed"
      motionTier="static"
    >
      <SectionHeading subtitle="Three phases. Six weeks. Structured and repeatable.">
        How engagements run.
      </SectionHeading>

      <div ref={ref} className="flex flex-col gap-8 md:gap-10">
        {ENGAGEMENT_PHASES.map((phase, idx) => {
          const isAccent = idx === 1;
          const delay = idx * 1;
          return (
            <motion.div
              key={phase.phase}
              className="relative flex gap-5 md:gap-8"
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: EASE, delay }}
            >
              <div className="relative z-10 shrink-0">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 font-mono font-bold text-sm md:text-base transition-colors duration-500 ${
                    isAccent
                      ? "border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                      : "border-[var(--brutalist-accent-light)] bg-[var(--pa2)] text-[var(--brutalist-accent-light)]"
                  }`}
                  aria-hidden="true"
                >
                  {phase.phase}
                </div>
                {idx < ENGAGEMENT_PHASES.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[40px] md:top-[56px] bottom-[-34px] w-[2px] bg-[var(--brutalist-accent-light)] opacity-20" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3
                  className={`text-sm font-mono font-bold uppercase tracking-tight mb-1 ${
                    isAccent ? "text-[var(--brutalist-accent)]" : "text-[var(--brutalist-accent-light)]"
                  }`}
                >
                  {phase.title}
                </h3>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink3)] mb-4">
                  {phase.duration}
                </p>
                <div className="flex flex-col gap-2.5">
                  {phase.deliverables.map((d, di) => (
                    <motion.div
                      key={di}
                      className="brutalist-feature-row"
                      initial={{ opacity: 0, x: -12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: EASE, delay: delay + 0.3 + di * 0.06 }}
                    >
                      <span className="feat-icon text-[var(--brutalist-accent-light)]">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <span className="text-xs leading-snug text-[var(--ink2)]">
                        {d}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
