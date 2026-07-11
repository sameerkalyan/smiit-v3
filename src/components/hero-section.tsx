"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { AnimatedButton } from "@/components/animated-button";
import { Magnetic } from "@/components/magnetic";
import { DiaTextReveal } from "@/components/dia-text-reveal";
import dynamic from "next/dynamic";

const InfrastructureGrid = dynamic(
  () => import("@/components/infrastructure-grid").then((mod) => ({ default: mod.InfrastructureGrid })),
  { ssr: false }
);

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

          <p
            className="text-base md:text-lg leading-relaxed mb-6 transition-opacity duration-500 max-w-2xl mx-auto"
            style={{
              opacity: typingDone ? 1 : 0,
              color: "#D6D6D6",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
            }}
          >
            <DiaTextReveal
              text="We help regulated organisations move from obligation to evidence — governance programmes, cloud architecture, and forward-deployed engineers who ship."
              active={typingDone}
            />
          </p>

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
