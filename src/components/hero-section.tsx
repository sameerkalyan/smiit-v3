"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import dynamic from "next/dynamic";

const CyberCityBackground = dynamic(
  () => import("@/components/cyber-city-background").then((mod) => ({ default: mod.CyberCityBackground })),
  { ssr: false }
);

import { AnimatedButton } from "@/components/animated-button";

const LINE1 = "EU AI ACT ENFORCEMENT";
const LINE2 = "HAS BEGUN.";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "-40px 0px", amount: 0.05 });
  const line1 = useTypewriter({
    text: LINE1,
    enabled: isVisible,
    speed: 45,
    jitter: 30,
  });
  const line2 = useTypewriter({
    text: LINE2,
    enabled: line1.done,
    speed: 65,
    jitter: 25,
    startDelay: 200,
  });
  const typingDone = line1.done && line2.done;

  return (
    <section className="hero-dark relative w-full px-6 pt-24 pb-20 lg:px-12 lg:pt-28 lg:pb-24 bg-[var(--pa)] overflow-hidden">
      <CyberCityBackground active={typingDone} />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[70%] z-10 pointer-events-none rounded-full blur-3xl opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, var(--pa) 20%, transparent 80%)",
        }}
      />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[var(--pa)]" />

      <div ref={ref} className="relative z-20 mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-tight uppercase text-[var(--ink)] mb-6"
            style={{ textWrap: "balance" }}
          >
            <span aria-hidden="true">{line1.display}</span>
            <span className="sr-only">{LINE1}</span>
            <span className="block mt-2 text-[var(--brutalist-accent)]">
              <span aria-hidden="true">{line2.display}</span>
              <span className="sr-only">{LINE2}</span>
            </span>
          </h1>

          <p
            className="text-sm md:text-base font-mono text-[var(--ink2)] leading-relaxed mb-6 transition-opacity duration-500"
            style={{ opacity: typingDone ? 1 : 0 }}
          >
            We help regulated organisations move from obligation to evidence — governance programmes,
            cloud architecture, and forward-deployed engineers who ship.
          </p>

          <p
            className="text-xs font-mono text-[var(--ink3)] mb-10 transition-opacity duration-500"
            style={{ opacity: typingDone ? 1 : 0 }}
          >
            For Heads of Compliance, CISOs, and AI platform owners in financial services,
            healthcare, and critical infrastructure.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 transition-opacity duration-500"
            style={{ opacity: typingDone ? 1 : 0 }}
          >
            <AnimatedButton
              href="#booking"
              className="brutalist-cta inline-flex w-auto"
              tapScale={0.96}
            >
              <span className="brutalist-cta-icon" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
              <span className="brutalist-cta-label px-4">BOOK A DISCOVERY CALL</span>
            </AnimatedButton>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)]"
            >
              EXPLORE OUR SERVICES <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
