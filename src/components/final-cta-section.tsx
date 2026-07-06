"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { Magnetic } from "@/components/magnetic";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

export function FinalCTASection() {
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
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="w-24 h-[2px] bg-[var(--brutalist-accent-light)] mb-10 origin-center"
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
        <p className="text-base leading-relaxed mb-8 max-w-lg text-[var(--brutalist-accent-foreground)]/80">
          Free assessments and senior conversations. No strings. No process. First step towards compliant,
          confident AI adoption.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Magnetic strength={0.25}>
          <Link
            href="#booking"
            className="inline-flex items-center font-mono text-xs font-bold uppercase tracking-wider"
            style={{
              background: "var(--ink)",
              color: "var(--pa2)",
            }}
          >
            <span className="flex items-center justify-center w-9 h-11 bg-[var(--pa2)] text-[var(--ink)] shrink-0">
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
            <span className="px-4 py-3 whitespace-nowrap">BOOK A DISCOVERY CALL</span>
          </Link>
          </Magnetic>
          <Link
            href="#services"
            className="inline-flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider text-[var(--brutalist-accent-foreground)] hover:text-[var(--pa2)] transition-colors"
          >
            TAKE THE FREE ASSESSMENT <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </Section>
  );
}
