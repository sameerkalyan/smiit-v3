"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { AnimatedButton } from "@/components/animated-button";
import { Magnetic } from "@/components/magnetic";

import dynamic from "next/dynamic";

const InfrastructureGrid = dynamic(
  () => import("@/components/infrastructure-grid").then((mod) => ({ default: mod.InfrastructureGrid })),
  { ssr: false }
);

const GREEN = "#9BEF74";

const CLAIM_WORDS: { t: string; accent?: boolean }[] = [
  { t: "We" },
  { t: "build" },
  { t: "governed" },
  { t: "AI" },
  { t: "systems" },
  { t: "that" },
  { t: "regulators" },
  { t: "trust", accent: true },
  { t: "and" },
  { t: "engineers" },
  { t: "ship", accent: true },
  { t: "." },
];

const PILLARS = [
  "Governance programmes",
  "Cloud architecture",
  "Forward-deployed engineers",
];

function ClaimLine({ active }: { active: boolean }) {
  return (
    <p className="text-base md:text-lg leading-relaxed mb-2 max-w-2xl mx-auto">
      {CLAIM_WORDS.map((w, i) => (
        <motion.span
          key={`${w.t}-${i}`}
          className="inline-block mr-[0.22em]"
          style={{
            color: w.accent ? GREEN : "#D6D6D6",
            textShadow: w.accent ? "0 0 6px rgba(155,239,116,0.18)" : "none",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.04 }}
        >
          {w.t}
          {i < CLAIM_WORDS.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

function PillarRow({ active }: { active: boolean }) {
  return (
    <div className="mt-4 mb-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
      {PILLARS.map((p, i) => (
        <motion.span
          key={p}
          className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em]"
          style={{
            borderColor: "rgba(155,239,116,0.35)",
            color: GREEN,
            textShadow: "0 0 6px rgba(155,239,116,0.12)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.55 + i * 0.08 }}
        >
          {p}
        </motion.span>
      ))}
    </div>
  );
}

const LINE1 = "EU AI ACT ENFORCEMENT";
const LINE2 = "HAS BEGUN.";

interface HeroSectionProps {
  introComplete?: boolean;
}

export function HeroSection({ introComplete = true }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "-40px 0px", amount: 0.05 });
  const skipTyping = introComplete;
  const line1 = useTypewriter({
    text: LINE1,
    enabled: skipTyping ? false : isVisible,
    speed: 45,
    jitter: 30,
  });
  const line2 = useTypewriter({
    text: LINE2,
    enabled: skipTyping ? false : line1.done,
    speed: 65,
    jitter: 25,
    startDelay: 200,
  });
  const typingDone = skipTyping ? true : line1.done && line2.done;

  return (
    <section
      id="hero"
      className="relative w-full px-6 pt-32 pb-20 lg:px-12 lg:pt-44 lg:pb-24 overflow-hidden"
      style={{ background: "#050505" }}
    >
      <InfrastructureGrid active={typingDone} />

      <div className="infrastructure-grid" />
      <div className="infrastructure-grid-dots" />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[70%] z-10 pointer-events-none rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, rgba(155,239,116,0.08) 20%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, transparent, #050505)" }}
      />

      <div ref={ref} className="relative z-20 mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="hero-heading text-center mb-6"
            style={{
              fontSize: "clamp(56px, 9vw, 110px)",
              textWrap: "balance",
            }}
          >
            <span aria-hidden="true">{skipTyping ? LINE1 : line1.display}</span>
            <span className="sr-only">{LINE1}</span>
            <span className="block mt-2" style={{ color: "#9BEF74", textShadow: "0 0 8px rgba(155,239,116,0.2)" }}>
              <span aria-hidden="true">{skipTyping ? LINE2 : line2.display}</span>
              <span className="sr-only">{LINE2}</span>
            </span>
          </h1>

          <ClaimLine active={typingDone} />

          <PillarRow active={typingDone} />

          <p
            className="text-xs mb-10 transition-opacity duration-500"
            style={{
              opacity: typingDone ? 1 : 0,
              color: "#8C8C8C",
              fontFamily: "var(--font-sans)",
            }}
          >
            For Heads of Compliance, CISOs, and AI platform owners in financial services,
            healthcare, and critical infrastructure.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 transition-opacity duration-500"
            style={{ opacity: typingDone ? 1 : 0 }}
          >
            <Magnetic strength={0.3}>
              <AnimatedButton
                href="#booking"
                className="inline-flex w-auto"
                tapScale={0.96}
                style={{
                  fontFamily: "var(--font-intro-mono), monospace",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.75rem",
                  background: "#0C8A63",
                  color: "#F4F4F4",
                }}
              >
                <span
                  className="inline-flex items-center justify-center"
                  style={{ width: "2.25rem", height: "2.75rem", background: "#0a7050", flexShrink: 0 }}
                >
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
                <span className="px-4 py-2.5">BOOK A DISCOVERY CALL</span>
              </AnimatedButton>
            </Magnetic>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ fontFamily: "var(--font-intro-mono), monospace", color: "#F4F4F4" }}
            >
              <span className="hover:opacity-70 transition-opacity">EXPLORE OUR SERVICES</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
