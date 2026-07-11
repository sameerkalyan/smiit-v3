"use client";

import { useRef } from "react";
import Link from "next/link";
import { LEAD_MAGNETS } from "@/components/site-data";
import { ArrowRight, FileDown, ClipboardCheck } from "lucide-react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { ContentCard } from "@/components/content-card";
import { DiaTextReveal } from "@/components/dia-text-reveal";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

export function FreeResourcesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <Section
      id="free-resources"
      label="FREE_RESOURCES"
      index={9}
      surface="base"
      motionTier="static"
      background={<GhostWord size="lg" align="left" drift={130}>assess</GhostWord>}
    >
      <SectionHeading subtitle="Free assessment and a 24-page whitepaper for regulated AI environments.">
        Start here, at no cost.
      </SectionHeading>

      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {LEAD_MAGNETS.map((magnet, idx) => {
          const isAccent = idx === 0;
          const IconComponent = magnet.icon === "check" ? ClipboardCheck : FileDown;
          const cardDelay = idx * 0.2;

          return (
            <motion.div
              key={magnet.id}
              className={isAccent ? "lg:col-span-7" : "lg:col-span-5"}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: EASE, delay: cardDelay }}
            >
              <ContentCard variant={isAccent ? "accent" : "default"} className="h-full">
                <ContentCard.Header>
                  <span className="brutalist-section-label" style={isAccent ? { color: "rgba(255,255,255,0.6)" } : undefined}>
                    {magnet.title.toUpperCase().replace(/\s/g, "_")}
                    {isAccent && <span className="brutalist-badge ml-2">FREE</span>}
                  </span>
                  <span className="brutalist-section-label" style={isAccent ? { color: "rgba(255,255,255,0.5)", opacity: undefined } : { opacity: 0.4 }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </ContentCard.Header>

                <ContentCard.Body>
                  <motion.div
                    className={`inline-flex items-center justify-center w-9 h-9 mb-3 ${
                      isAccent
                        ? "bg-[var(--brutalist-accent-foreground)] text-[var(--brutalist-accent)]"
                        : "bg-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-foreground)]"
                    }`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: cardDelay + 0.2 }}
                  >
                    <IconComponent size={16} strokeWidth={2.5} />
                  </motion.div>

                  <p className="text-[10px] leading-relaxed mb-2 text-[var(--ink3)]">
                    {"// "}{magnet.title}
                  </p>

                  <h3 className="text-base font-mono font-bold tracking-tight leading-snug mb-3">
                    <DiaTextReveal text={magnet.subtitle} active={isInView} stagger={0.03} delay={cardDelay + 0.25} />
                  </h3>

                  <p className={`text-xs leading-relaxed ${
                    isAccent ? "text-[var(--brutalist-accent-foreground)]/80" : "text-[var(--ink2)]"
                  }`}>
                    {magnet.description}
                  </p>
                </ContentCard.Body>

                <div className="flex-1" />

                <ContentCard.Footer className={isAccent ? "" : "border-t-2 brutalist-divider"}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: cardDelay + 0.5 }}
                  >
                    <Link
                      href="#booking"
                      className="brutalist-cta inline-flex no-underline cursor-pointer group/btn"
                    >
                      <span className="brutalist-cta-icon transition-transform duration-250 group-hover/btn:translate-x-[3px]">
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
                      <span className="brutalist-cta-label">{magnet.cta.replace(" →", "").toUpperCase()}</span>
                    </Link>
                  </motion.div>
                </ContentCard.Footer>
              </ContentCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-8 flex items-center gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}
      >
        <span className="brutalist-section-label text-[var(--ink3)]" style={{ letterSpacing: "0.12em" }}>
          No commitment required. Response within one business day.
        </span>
        <div className="flex-1 border-t border-[var(--line)]" />
      </motion.div>
    </Section>
  );
}
