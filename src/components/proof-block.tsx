"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { PROOF_ITEMS, STAT_73PCT_NOTE } from "@/components/site-data";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { motion, useInView } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowRight } from "lucide-react";

const SPRING = { type: "spring", stiffness: 220, damping: 22, mass: 0.7 } as const;
const CARD_W = 300;

function useCountUp(target: string, isActive: boolean, duration = 1200) {
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || isNaN(numericPart)) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numericPart * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive, numericPart, duration]);

  if (isNaN(numericPart)) return target;
  return `${count}${suffix}`;
}

// deterministic pseudo-random in [0,1) so the pile looks natural but stable
function jitter(seed: number) {
  const x = Math.sin(seed * 127.1 + 0.5) * 43758.5453;
  return x - Math.floor(x);
}

function ProofCard({
  card,
  index,
  hovered,
  inView,
}: {
  card: { metric: string; label: string; pill: string };
  index: number;
  hovered: boolean;
  inView: boolean;
}) {
  const display = useCountUp(card.metric, inView);

  return (
    <div className="brutalist-card w-[300px] p-5 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <span className="brutalist-section-label">PROOF</span>
        <span className="brutalist-section-label opacity-40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <span className="text-4xl font-mono font-bold leading-none tabular-nums text-[var(--ink)]">
        {display}
      </span>
      <p className="text-xs font-mono leading-relaxed text-[var(--ink2)] min-h-[3.5rem]">
        {card.label}
      </p>
      <motion.span
        className="inline-flex items-center gap-1.5 self-start border-2 border-[var(--brutalist-accent-light)] rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--brutalist-accent-light)]"
        animate={{ scale: hovered ? 1.07 : 1, y: hovered ? -1 : 0 }}
        transition={SPRING}
      >
        <span>{card.pill}</span>
        <ArrowRight size={12} strokeWidth={2.5} />
      </motion.span>
    </div>
  );
}

export function ProofBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const coarse = useMediaQuery("(pointer: coarse)");

  const n = PROOF_ITEMS.length;
  const center = (n - 1) / 2;

  const cards = useMemo(
    () =>
      PROOF_ITEMS.map((item, i) => {
        const j1 = jitter(i + 1);
        const j2 = jitter(i + 5.3);
        return {
          ...item,
          jitterRot: (j1 - 0.5) * 5,
          jitterX: (j2 - 0.5) * 12,
          jitterScale: 1 - j1 * 0.05,
        };
      }),
    []
  );

  const spread = active ? 16 : 2.5;

  return (
    <Section
      label="PROOF"
      index={1}
      surface="recessed"
      motionTier="static"
      spacing="sm"
      className="border-y border-[var(--line)]"
      background={<GhostWord size="md" align="right" drift={80}>evidence</GhostWord>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-12 items-center">
        <div className="flex flex-col gap-5">
          <SectionHeading subtitle="Real engagements, measurable outcomes." className="mb-0">
            Evidence, not assurances
          </SectionHeading>
          <p className="text-sm font-mono leading-relaxed text-[var(--ink2)] max-w-prose">
            Every engagement is scoped, measured, and shipped. The numbers below are pulled
            from live client work — not marketing estimates.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink3)]">
            {STAT_73PCT_NOTE}
          </p>
        </div>

        <div ref={ref} className="flex justify-center">
          <div
            className="proof-deck relative touch-none w-full max-w-[640px]"
            style={{ height: 440 }}
            onMouseEnter={() => {
              if (!coarse) setActive(true);
            }}
            onMouseLeave={() => {
              if (!coarse) setActive(false);
            }}
            onClick={() => {
              if (coarse) setActive((v) => !v);
            }}
          >
            {cards.map((card, i) => {
              const offset = i - center;
              const angle = offset * spread + card.jitterRot;
              const isH = hovered === i;
              return (
                <motion.div
                  key={card.metric}
                  className="absolute bottom-4 left-1/2"
                  style={{
                    width: CARD_W,
                    originY: 1,
                    zIndex: active ? (isH ? 50 : 30 - Math.round(Math.abs(offset) * 5)) : i,
                  }}
                  animate={{
                    rotate: angle,
                    x: -CARD_W / 2 + card.jitterX + (active ? offset * 34 : 0),
                    y: active ? -Math.abs(offset) * 8 : i * 7,
                    scale: card.jitterScale * (isH ? 1.05 : 1),
                  }}
                  transition={SPRING}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <ProofCard card={card} index={i} hovered={isH} inView={isInView} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
