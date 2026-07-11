"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { DiaTextReveal } from "@/components/dia-text-reveal";
import { Magnetic } from "@/components/magnetic";
import { EASE } from "@/lib/motion";

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <Section
      label="FINAL_CTA"
      index={11}
      surface="highlight"
      motionTier="supported"
      spacing="lg"
      className="overflow-hidden"
      background={<GhostWord size="xl" align="center" drift={60} opacityRange={[0.04, 0.08, 0.04]}>governed</GhostWord>}
    >
      <div ref={ref} className="flex flex-col items-center text-center">
        <motion.div
          className="w-24 h-[2px] bg-[var(--brutalist-accent-foreground)]/20 mb-10 origin-center"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold uppercase tracking-tight mb-6">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px 0px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            YOUR AI.{" "}
          </motion.span>
          <motion.span
            className="inline-block text-[var(--brutalist-accent-foreground)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px 0px" }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          >
            PROPERLY GOVERNED.
          </motion.span>
        </h2>

        <DiaTextReveal
          text="Free assessments and senior conversations. No strings. No process."
          active={isInView}
          stagger={0.02}
          delay={0.6}
          className="text-base leading-relaxed mb-3 max-w-lg text-[var(--brutalist-accent-foreground)]/80"
        />

        <motion.p
          className="text-sm text-[var(--brutalist-accent-foreground)]/60 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 1.0 }}
        >
          First step towards compliant, confident AI adoption.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
        >
          <Magnetic strength={0.25}>
            <Link
              href="#booking"
              className="brutalist-cta inline-flex no-underline"
            >
              <span className="brutalist-cta-icon">
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
              <span className="brutalist-cta-label">BOOK A DISCOVERY CALL</span>
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Link
              href="#free-resources"
              className="inline-flex items-center gap-2 no-underline text-sm font-mono font-bold uppercase tracking-wider text-[var(--brutalist-accent-foreground)]/90 hover:text-[var(--brutalist-accent-foreground)] transition-colors"
            >
              TAKE THE FREE ASSESSMENT <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </Section>
  );
}
