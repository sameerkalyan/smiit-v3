"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { motion } from "motion/react";
import { STAT_73PCT_NOTE } from "@/components/site-data";
import { EASE } from "@/lib/motion";

export function TheClaimStats() {
  return (
    <Section
      label="CLAIM"
      index={2}
      surface="base"
      motionTier="supported"
      className="border-y border-[var(--line)]"
      background={<GhostWord size="xl" align="left" drift={180} opacityRange={[0.04, 0.10, 0.04]}>73%</GhostWord>}
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <motion.span
            className="text-8xl md:text-[9rem] font-mono font-bold text-[var(--ink)] leading-[0.85] inline-block tabular-nums"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px 0px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            73<span className="text-[var(--brutalist-accent)]">%</span>
          </motion.span>
          <motion.h2
            className="text-xl md:text-2xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] mt-6 leading-snug"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px 0px" }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          >
            Of organisations have deployed AI without a governance framework.
          </motion.h2>
          <motion.p
            className="text-[10px] font-mono text-[var(--ink3)] mt-3 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px 0px" }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {STAT_73PCT_NOTE}
          </motion.p>
        </div>
        <motion.div
          className="pt-4 md:pt-8 border-l-2 border-[var(--brutalist-accent-light)] pl-6"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          <p className="text-sm font-mono text-[var(--ink2)] leading-relaxed mb-8">
            The governance gap is especially acute in regulated industries —
            financial services, healthcare, and critical infrastructure — where
            the consequences of ungoverned AI compound over time.
          </p>
          <blockquote className="border-l-2 border-[var(--brutalist-accent)] pl-6 py-1 mb-8">
            <p className="text-base font-mono text-[var(--ink)] leading-relaxed">
              The organisations that govern AI well will not just avoid
              regulatory risk — they will move faster, with greater confidence,
              than those who do not.
            </p>
          </blockquote>
          <Link
            href="#services"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)]"
          >
            EXPLORE OUR SERVICES <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}
