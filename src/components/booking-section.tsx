"use client";

import { useRef } from "react";
import Link from "next/link";
import { BOOKING_TYPES } from "@/components/site-data";
import { Calendar, Clock } from "lucide-react";
import { motion, useInView } from "motion/react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { Magnetic } from "@/components/magnetic";
import { EASE, DURATION } from "@/lib/motion";

export function BookingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px 0px" });

  return (
    <Section
      id="booking"
      label="BOOKING"
      index={8}
      surface="recessed"
      motionTier="static"
      className="border-t border-[var(--line)]"
      background={<GhostWord size="lg" align="right" drift={140}>engage</GhostWord>}
    >
      <SectionHeading subtitle="Senior-level engagement from the first call. No charge. Response within one business day.">
        A direct conversation. No process required.
      </SectionHeading>

      <div ref={ref} className="flex flex-col gap-6 md:gap-8">
        {BOOKING_TYPES.map((type, idx) => {
          const isAccent = idx === 1;
          const delay = idx * 0.12;

          return (
            <motion.div
              key={type.id}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE, delay }}
            >
              <div className="grid grid-cols-[48px_1fr_auto] md:grid-cols-[56px_1fr_auto] gap-4 md:gap-6 items-start">
                <motion.div
                  className={`relative z-10 shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 font-mono font-bold text-sm md:text-base ${
                    isAccent
                      ? "border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                      : "border-[var(--brutalist-accent-light)] bg-[var(--pa2)] text-[var(--brutalist-accent-light)]"
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: delay + 0.1 }}
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, "0")}
                </motion.div>

                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`text-base font-mono font-bold tracking-tight uppercase ${
                        isAccent ? "text-[var(--brutalist-accent)]" : "text-[var(--ink)]"
                      }`}
                    >
                      {type.label}
                    </h3>
                    {isAccent && <span className="brutalist-badge">RECOMMENDED</span>}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={12} className="text-[var(--ink3)]" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink3)]">
                      {type.duration}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--ink2)] leading-relaxed max-w-lg">
                    {type.description}
                  </p>
                </div>

                <div className="pt-1">
                  <Magnetic strength={0.3}>
                    <Link
                      href={type.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center no-underline cursor-pointer ${
                        isAccent
                          ? "brutalist-cta"
                          : "border-2 border-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-light)] hover:bg-[var(--brutalist-accent)] hover:text-[var(--brutalist-accent-foreground)] hover:border-[var(--brutalist-accent)] transition-colors"
                      }`}
                      aria-label={`Book ${type.label} (opens in new window)`}
                    >
                      {isAccent ? (
                        <>
                          <span className="brutalist-cta-icon">
                            <Calendar size={14} strokeWidth={2.5} />
                          </span>
                          <span className="brutalist-cta-label text-[10px]">BOOK NOW</span>
                        </>
                      ) : (
                        <span className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                          <Calendar size={14} strokeWidth={2.5} />
                          BOOK NOW
                        </span>
                      )}
                    </Link>
                  </Magnetic>
                </div>
              </div>

              {idx < BOOKING_TYPES.length - 1 && (
                <div className="ml-[23px] md:ml-[27px] mt-4 mb-2 w-[2px] h-6 bg-[var(--brutalist-accent-light)] opacity-20" />
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center gap-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="brutalist-pulse-dot sm" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink3)]">
            All calls are with senior consultants — not sales.
          </span>
        </div>
        <div className="flex-1 hidden sm:block border-t border-[var(--line)]" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--brutalist-accent-light)]">
          Response within 1 business day
        </span>
      </motion.div>
    </Section>
  );
}
