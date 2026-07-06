"use client";

import { useRef } from "react";
import Link from "next/link";
import { LEAD_MAGNETS } from "@/components/site-data";
import { ArrowRight, FileDown, ClipboardCheck } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ContentCard } from "@/components/content-card";
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
    >
      <SectionHeading subtitle="Free assessment and a 24-page whitepaper for regulated AI environments.">
        Start here, at no cost.
      </SectionHeading>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-5 gap-0">
        {LEAD_MAGNETS.map((magnet, idx) => {
          const isAccent = idx === 0;
          const IconComponent = magnet.icon === "check" ? ClipboardCheck : FileDown;
          const cardDelay = idx * 0.2;
          return (
            <motion.div
              key={magnet.id}
              className={idx === 0 ? "md:col-span-3" : "md:col-span-2"}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: EASE, delay: cardDelay }}
            >
              <ContentCard variant={isAccent ? "accent" : "default"} className="h-full">
                <ContentCard.Header>
                  <span className="brutalist-section-label">
                    {magnet.title.toUpperCase().replace(/\s/g, "_")}
                    {isAccent && <span className="brutalist-badge ml-2">FREE</span>}
                  </span>
                  <span className="brutalist-section-label opacity-40">{String(idx + 1).padStart(2, "0")}</span>
                </ContentCard.Header>

                <ContentCard.Body>
                  <motion.div
                    className={`inline-flex items-center justify-center w-9 h-9 mb-3 ${isAccent ? "bg-[var(--brutalist-accent-foreground)] text-[var(--brutalist-accent)]" : "bg-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-foreground)]"}`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: cardDelay + 0.2 }}
                  >
                    <IconComponent size={16} strokeWidth={2.5} />
                  </motion.div>
                  <p
                    className={`text-[10px] leading-relaxed mb-2 ${
                      isAccent ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink3)]"
                    }`}
                  >
                    {"// "}{magnet.title}
                  </p>
                  <h3 className="text-base font-mono font-bold tracking-tight leading-snug mb-3">
                    {magnet.subtitle}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isAccent ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink2)]"
                    }`}
                  >
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
    </Section>
  );
}
