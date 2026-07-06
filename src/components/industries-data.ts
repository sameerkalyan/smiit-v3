import type { IndustryCard } from "@/types";

export const INDUSTRIES: IndustryCard[] = [
  {
    id: 1,
    name: "Financial Services & Insurance",
    label: "REGULATED",
    code: "FINSERV",
    description:
      "Full EU AI Act, DORA, GDPR, and FCA compliance for banks, insurers, and fintech operating in regulated markets.",
    recommended: true,
    ctaLabel: "EXPLORE FINSERV",
    features: [
      { label: "DORA ICT risk assessment", included: true },
      { label: "EU AI Act risk-classification", included: true },
      { label: "GDPR AI data-processing audit", included: true },
      { label: "FCA / PRA board reporting pack", included: true },
      { label: "Dedicated compliance engineer", included: true },
      { label: "Air-gapped deployment", included: false },
    ],
  },
  {
    id: 2,
    name: "Healthcare & Life Sciences",
    label: "CLINICAL",
    code: "HEALTH",
    description:
      "MDR, GDPR, ISO 13485, and NHS data governance for AI/ML systems in clinical and pharmaceutical environments.",
    ctaLabel: "EXPLORE HEALTH",
    features: [
      { label: "MDR AI system classification", included: true },
      { label: "GDPR health-data processing", included: true },
      { label: "ISO 13485 QMS integration", included: true },
      { label: "NHS DTAC compliance mapping", included: true },
      { label: "Dedicated compliance engineer", included: false },
      { label: "Air-gapped deployment", included: false },
    ],
  },
  {
    id: 3,
    name: "Energy & Critical Infrastructure",
    label: "CRITICAL",
    code: "CRITICAL",
    description:
      "NIS2, ISO 27001, and OT/ICS security architecture for energy, utilities, and national infrastructure operators.",
    ctaLabel: "EXPLORE CRITICAL",
    features: [
      { label: "NIS2 incident-response playbook", included: true },
      { label: "ISO 27001 ISMS alignment", included: true },
      { label: "OT/ICS network segmentation", included: true },
      { label: "CNI resilience audit framework", included: true },
      { label: "Dedicated compliance engineer", included: false },
      { label: "Air-gapped deployment", included: false },
    ],
  },
];
