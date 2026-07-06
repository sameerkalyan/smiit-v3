"use client";

import { Section } from "@/components/section";
import { FeatureGrid } from "@/components/feature-grid";

const TRUST_SIGNALS = [
  {
    title: "SECURITY CERTIFIED",
    description: "SOC 2 Type II compliant. All client work isolated under ISO 27001-aligned controls.",
  },
  {
    title: "YOUR NDA, YOUR TERMS",
    description: "We work under your agreement. No mandatory contractor T&Cs.",
  },
  {
    title: "UK-BASED ENTITY",
    description: "London-headquartered. UK law governs all engagements. Professional liability insured.",
  },
];

export function TrustSecurity() {
  return (
    <Section
      label="TRUST"
      index={10}
      surface="recessed"
      motionTier="static"
      className="border-t border-[var(--line)]"
    >
      <FeatureGrid layout="timeline" stagger={0.08}>
        {TRUST_SIGNALS.map((signal, idx) => {
          const isAccent = idx === 1;
          return (
            <FeatureGrid.Item key={signal.title} step={idx + 1} accent={isAccent} isLast={idx === TRUST_SIGNALS.length - 1}>
              <h3 className="text-sm font-mono font-bold tracking-tight uppercase mb-1">
                {signal.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ink2)]">
                {signal.description}
              </p>
            </FeatureGrid.Item>
          );
        })}
      </FeatureGrid>
    </Section>
  );
}
