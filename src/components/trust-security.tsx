"use client";

import { useRef } from "react";
import { Shield, Lock, Building2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { EASE, DURATION } from "@/lib/motion";

const TRUST_SIGNALS = [
  {
    icon: Shield,
    title: "SECURITY CERTIFIED",
    description:
      "SOC 2 Type II compliant. All client work isolated under ISO 27001-aligned controls.",
  },
  {
    icon: Lock,
    title: "YOUR NDA, YOUR TERMS",
    description:
      "We work under your agreement. No mandatory contractor T&Cs.",
  },
  {
    icon: Building2,
    title: "UK-BASED ENTITY",
    description:
      "London-headquartered. UK law governs all engagements. Professional liability insured.",
  },
];

export function TrustSecurity() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <Section
      label="TRUST"
      index={10}
      surface="recessed"
      motionTier="static"
      className="border-t border-[var(--line)]"
      background={<GhostWord size="md" align="left" drift={100}>secure</GhostWord>}
    >
      <SectionHeading subtitle="Independent, regulated, and accountable. Our engagement model is designed for enterprise requirements.">
        Trust and security
      </SectionHeading>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {TRUST_SIGNALS.map((signal, idx) => {
          const isAccent = idx === 1;
          const delay = idx * 0.15;

          return (
            <motion.div
              key={signal.title}
              className={`relative p-6 md:p-8 ${
                isAccent
                  ? "bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                  : "text-[var(--ink)]"
              } ${idx > 0 ? "border-l-0 border-t md:border-t-0 md:border-l border-[var(--line)]" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: DURATION.normal, ease: EASE, delay }}
            >
              <motion.div
                className={`inline-flex items-center justify-center w-10 h-10 mb-5 ${
                  isAccent
                    ? "bg-[var(--brutalist-accent-foreground)] text-[var(--brutalist-accent)]"
                    : "bg-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-foreground)]"
                }`}
                initial={{ scale: 0, rotate: -20 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
                transition={{ duration: 0.4, ease: EASE, delay: delay + 0.15 }}
              >
                <signal.icon size={16} strokeWidth={2.5} />
              </motion.div>

              <div className="flex items-center gap-2 mb-2">
                <span className="brutalist-section-label" style={isAccent ? { color: "rgba(255,255,255,0.6)" } : undefined}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className={`w-4 h-[2px] ${isAccent ? "bg-[var(--brutalist-accent-foreground)]/30" : "bg-[var(--brutalist-accent-light)]"}`} />
              </div>

              <h3 className={`text-sm font-mono font-bold tracking-tight uppercase mb-3 ${
                isAccent ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink)]"
              }`}>
                {signal.title}
              </h3>

              <p className={`text-sm leading-relaxed ${
                isAccent ? "text-[var(--brutalist-accent-foreground)]/80" : "text-[var(--ink2)]"
              }`}>
                {signal.description}
              </p>

              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                  isAccent ? "bg-[var(--brutalist-accent-foreground)]/20" : "bg-[var(--brutalist-accent-light)]"
                } origin-left`}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: delay + 0.3 }}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}
      >
        <span className="brutalist-section-label text-[var(--ink3)]" style={{ letterSpacing: "0.12em" }}>
          Fully insured. Enterprise-grade engagement terms.
        </span>
        <div className="flex-1 border-t border-[var(--line)]" />
      </motion.div>
    </Section>
  );
}
