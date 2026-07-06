"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "motion/react";
import { READINESS_DATA, STAT_73PCT_NOTE } from "@/components/site-data";
import { GhostWord } from "@/components/ghost-word";

function BarItem({ pct, label, barProgress }: { pct: number; label: string; barProgress: MotionValue<number> }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-mono text-[var(--ink3)] w-40 shrink-0 text-right pr-3 leading-tight">
        {label}
      </span>
      <div className="flex-1 h-5 bg-[var(--pa2)] border-2 border-[var(--line)] relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[var(--brutalist-accent-light)]"
          style={{
            width: `${pct}%`,
            scaleX: barProgress,
            transformOrigin: "left center",
          }}
        />
        <span className="absolute inset-0 flex items-center justify-end pr-3 text-[9px] font-mono font-bold tabular-nums text-[var(--ink)]">
          {pct}%
        </span>
      </div>
    </div>
  );
}

export function TheClaimStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.08) { setCount(0); return; }
    if (v > 0.65) { setCount(73); return; }
    setCount(Math.round(((v - 0.08) / 0.57) * 73));
  });

  const bar1 = useTransform(scrollYProgress, [0.1, 0.38], [0, 1]);
  const bar2 = useTransform(scrollYProgress, [0.17, 0.45], [0, 1]);
  const bar3 = useTransform(scrollYProgress, [0.24, 0.52], [0, 1]);
  const bar4 = useTransform(scrollYProgress, [0.31, 0.59], [0, 1]);
  const bar5 = useTransform(scrollYProgress, [0.38, 0.66], [0, 1]);
  const bar6 = useTransform(scrollYProgress, [0.45, 0.73], [0, 1]);
  const barProgresses = [bar1, bar2, bar3, bar4, bar5, bar6];

  const contentProgress = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);
  const scrollBarProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full flex flex-col justify-center px-6 lg:px-12">
          <GhostWord size="xl" align="left" drift={180} opacityRange={[0.04, 0.10, 0.04]}>73%</GhostWord>

          <div className="relative z-10 mx-auto max-w-7xl w-full pt-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <div className="mb-8">
                  <motion.span
                    className="text-[clamp(5rem,14vw,10rem)] font-mono font-bold text-[var(--ink)] leading-[0.85] inline-block tabular-nums"
                  >
                    {count}
                    <span className="text-[var(--brutalist-accent)]">%</span>
                  </motion.span>
                  <motion.div
                    className="h-1 bg-[var(--brutalist-accent-light)] origin-left"
                    style={{ scaleX: useTransform(scrollYProgress, [0.08, 0.45], [0, 1]) }}
                  />
                </div>
                <motion.h2
                  className="text-xl md:text-2xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] leading-snug"
                  style={{ opacity: contentProgress }}
                >
                  Of organisations have deployed AI without a governance framework.
                </motion.h2>
                <motion.p
                  className="text-[10px] font-mono text-[var(--ink3)] mt-3 leading-relaxed"
                  style={{ opacity: contentProgress }}
                >
                  {STAT_73PCT_NOTE}
                </motion.p>
              </div>

              <div className="pt-4 md:pt-0">
                <p className="text-xs font-mono text-[var(--ink3)] uppercase tracking-widest mb-6">
                  Average readiness by dimension
                </p>
                <div className="flex flex-col gap-4">
                  {READINESS_DATA.map((item, i) => (
                    <BarItem key={item.label} pct={item.pct} label={item.label} barProgress={barProgresses[i]} />
                  ))}
                </div>

                <motion.div
                  className="mt-8 border-l-2 border-[var(--brutalist-accent-light)] pl-6"
                  style={{ opacity: contentProgress }}
                >
                  <p className="text-sm font-mono text-[var(--ink2)] leading-relaxed mb-6">
                    The governance gap is especially acute in regulated industries —
                    financial services, healthcare, and critical infrastructure — where
                    the consequences of ungoverned AI compound over time.
                  </p>
                  <blockquote className="border-l-2 border-[var(--brutalist-accent)] pl-6 py-1 mb-8">
                    <p className="text-sm font-mono text-[var(--ink)] leading-relaxed">
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
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--pa2)]">
            <motion.div
              className="h-full bg-[var(--brutalist-accent-light)] origin-left"
              style={{ scaleX: scrollBarProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
