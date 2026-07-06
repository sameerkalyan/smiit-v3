"use client";

import { INDUSTRIES } from "@/components/site-data";
import type { IndustryCard } from "@/types";
import { ArrowRight, Check, Minus } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Section } from "@/components/section";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeading } from "@/components/section-heading";
import { TiltCard } from "@/components/tilt-card";
import { ContentCard } from "@/components/content-card";
import { EASE } from "@/lib/motion";

function FeatureList({
  features,
  isInverted,
}: {
  features: IndustryCard["features"];
  isInverted: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {features.map((feat, fi) => (
        <motion.div
          key={fi}
          className={`brutalist-feature-row ${feat.included ? "" : "excluded"}`}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: EASE, delay: fi * 0.06 }}
        >
          {feat.included ? (
            <span
              className={`feat-icon ${
                isInverted ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--brutalist-accent-light)]"
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
            </span>
          ) : (
            <span
              className={`feat-icon ${
                isInverted ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink3)]"
              } opacity-30`}
            >
              <Minus size={14} strokeWidth={2} />
            </span>
          )}
          <span
            className={`text-xs leading-snug ${
              feat.included
                ? ""
                : isInverted
                  ? "text-[var(--brutalist-accent-foreground)] line-through opacity-50"
                  : "text-[var(--ink3)] line-through opacity-40"
            }`}
          >
            {feat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function IndustryCardInner({
  ind,
  index,
  isInverted,
}: {
  ind: IndustryCard;
  index: number;
  isInverted: boolean;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px 0px" }}
    >
      <ContentCard variant={isInverted ? "accent" : "default"} className="h-full">
        <ContentCard.Header>
          <span className="brutalist-section-label">
            {ind.label}
            {isInverted && <span className="brutalist-badge ml-2">RECOMMENDED</span>}
          </span>
          <span
            className="brutalist-section-label"
            style={!isInverted ? { opacity: 0.4 } : { color: "var(--brutalist-accent-foreground)", opacity: 0.7 }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </ContentCard.Header>

        <ContentCard.Body>
          <p
            className={`text-[10px] leading-relaxed mb-2 ${
              isInverted ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink3)]"
            }`}
            style={{ letterSpacing: "0.02em" }}
          >
            {ind.code}
          </p>
          <h3 className="text-base font-bold tracking-tight leading-snug mb-3">
            {ind.name}
          </h3>
          <p
            className={`text-xs leading-relaxed ${
              isInverted ? "text-[var(--brutalist-accent-foreground)]" : "text-[var(--ink2)]"
            }`}
          >
            {ind.description}
          </p>
        </ContentCard.Body>

        <div className={`flex-1 px-5 py-4 border-t-2 ${isInverted ? "brutalist-divider" : ""}`}>
          <FeatureList features={ind.features} isInverted={isInverted} />
        </div>

        <ContentCard.Footer>
          <Link
            href="#booking"
            className="brutalist-cta inline-flex w-fit"
          >
            <span
              className="brutalist-cta-icon"
              style={{
                background: isInverted ? "var(--ink)" : "var(--pa2)",
                color: isInverted ? "var(--pa2)" : "var(--ink)",
              }}
            >
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
            <span className="brutalist-cta-label">{ind.ctaLabel}</span>
          </Link>
        </ContentCard.Footer>
      </ContentCard>
    </motion.div>
  );
}

export function IndustriesSection() {
  return (
    <Section
      id="industries"
      label="INDUSTRIES"
      index={7}
      surface="recessed"
      motionTier="static"
      background={<GhostWord size="lg" align="left" drift={130}>regulated</GhostWord>}
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div className="flex flex-col gap-3">
          <SectionHeading subtitle="Each industry carries distinct regulatory obligations. Choose the category that matches your operational context." className="mb-0">
            Select your industry
          </SectionHeading>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[var(--ink3)] uppercase font-mono">
          <span className="brutalist-pulse-dot sm" />
          <span>active industries: 3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {INDUSTRIES.map((ind, idx) => (
          <TiltCard key={ind.id} captionText={ind.code}>
            <IndustryCardInner
              ind={ind}
              index={idx}
              isInverted={ind.recommended ?? false}
            />
          </TiltCard>
        ))}
      </div>

      <motion.div
        className="flex items-center gap-3 mt-6"
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px 0px" }}
      >
        <span
          className="brutalist-section-label text-[var(--ink3)]"
          style={{ letterSpacing: "0.12em" }}
        >
          * All engagements billed on engagement basis. NDA available on
          request.
        </span>
        <div className="flex-1 border-t border-[var(--line)]" />
      </motion.div>
    </Section>
  );
}
