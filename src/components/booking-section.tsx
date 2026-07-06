"use client";

import Link from "next/link";
import { BOOKING_TYPES } from "@/components/site-data";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { FeatureGrid } from "@/components/feature-grid";

export function BookingSection() {
  return (
    <Section
      id="booking"
      label="BOOKING"
      index={8}
      surface="recessed"
      motionTier="static"
    >
      <SectionHeading subtitle="Senior-level engagement from the first call. No charge. Response within one business day.">
        A direct conversation. No process required.
      </SectionHeading>

      <FeatureGrid layout="timeline" stagger={0.08}>
        {BOOKING_TYPES.map((type, idx) => {
          const isAccent = idx === 1;
          return (
            <FeatureGrid.Item key={type.id} step={idx + 1} accent={isAccent} isLast={idx === BOOKING_TYPES.length - 1}>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`text-base font-mono font-bold tracking-tight uppercase ${isAccent ? "text-[var(--brutalist-accent)]" : "text-[var(--ink)]"}`}
                    >
                      {type.label}
                    </h3>
                    {isAccent && <span className="brutalist-badge">RECOMMENDED</span>}
                  </div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink3)] mb-2">
                    {type.duration}
                  </p>
                  <p className="text-sm text-[var(--ink2)] leading-relaxed">
                    {type.description}
                  </p>
                </div>
                <Link
                  href={type.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--emphasis-text)] transition-colors"
                  aria-label={`Book ${type.label} (opens in new window)`}
                >
                  BOOK NOW <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </FeatureGrid.Item>
          );
        })}
      </FeatureGrid>
    </Section>
  );
}
