import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Boxes, Newspaper, MessageSquare } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "#services", icon: LayoutGrid },
  { label: "Frameworks", href: "#frameworks", icon: Boxes },
  { label: "Insights", href: "#insights", icon: Newspaper },
  { label: "Talk to us", href: "#booking", icon: MessageSquare },
];

export const BOOKING_TYPES = [
  {
    id: 1,
    label: "Initial Discovery",
    duration: "30 min",
    href: "https://cal.com/smiit-cyberai/initial-discovery",
    description:
      "Discuss your AI governance and infrastructure needs with a senior consultant.",
  },
  {
    id: 2,
    label: "Technical Consulting",
    duration: "60 min",
    href: "https://cal.com/smiit-cyberai/technical-consulting",
    description:
      "Deep-dive into architecture, compliance frameworks, or technical implementation.",
  },
  {
    id: 3,
    label: "Partnership",
    duration: "30 min",
    href: "https://cal.com/smiit-cyberai/partnership",
    description: "Explore how we can support your organisation as a strategic partner.",
  },
] as const;

export const SERVICES = [
  {
    id: 1,
    tag: "AI Governance",
    title: "AI Governance",
    description:
      "Governance programmes that satisfy regulators without slowing your teams. We build practical compliance from policy to audit trail.",
    bullets: [
      "Governance framework design & implementation",
      "EU AI Act readiness & compliance",
      "NIST AI RMF mapping",
      "ISO 42001 certification support",
      "DORA alignment for financial services",
      "GDPR + AI data-processing obligations",
    ],
    sideItems: ["Regulation", "Framework", "Standard"],
    frameworks: ["EU AI Act", "NIST AI RMF", "ISO 42001", "DORA"],
    stackRows: ["EU AI Act", "NIST AI RMF", "ISO 42001", "DORA", "GDPR"],
  },
  {
    id: 2,
    tag: "Infrastructure",
    title: "AI Infrastructure",
    description:
      "The technical foundations AI adoption actually requires. Cloud architecture, data systems, and platform engineering for regulated industries.",
    bullets: [
      "Cloud landing zone architecture",
      "Data pipeline and lakehouse design",
      "AI/ML platform infrastructure",
      "Cost governance and FinOps",
      "Platform engineering and IDP",
      "Developer AI tooling integration",
    ],
    sideItems: ["Infrastructure", "Cloud", "Platform"],
    frameworks: ["AWS", "Azure", "GCP", "Terraform"],
    stackRows: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"],
  },
];

export const BLOG_ARTICLES = [
  {
    id: 1,
    title: "Connecting Enterprise Systems to AI via MCP: An Architecture Guide",
    date: "May 2026",
    author: "Priya Nair",
    role: "Infrastructure Lead",
    category: "AI Infrastructure",
    excerpt:
      "How Model Context Protocol bridges your existing enterprise data and AI systems—architecture patterns for regulated organisations.",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "EU AI Act Enforcement: What Regulated Organisations Must Do Now",
    date: "April 2026",
    author: "James Aldridge",
    role: "Head of Governance",
    category: "AI Governance",
    excerpt:
      "EU AI Act enforcement has begun. Here is the compliance roadmap for financial services, healthcare, and critical infrastructure.",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Cloud Architecture for AI Workloads in Regulated Industries",
    date: "March 2026",
    author: "Sarah Okonkwo",
    role: "Cloud Architect",
    category: "Infrastructure",
    excerpt:
      "Designing cloud infrastructure that meets both AI performance demands and regulatory requirements—landing zones, networking, and identity.",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "The Real Cost of AI Governance Debt",
    date: "March 2026",
    author: "James Aldridge",
    role: "Head of Governance",
    category: "AI Governance",
    excerpt:
      "Governance debt is real. It compounds silently and becomes catastrophically expensive to address. Here is how to measure and reduce it.",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Governing Autonomous AI Systems: Accountability, Audit & Control",
    date: "February 2026",
    author: "Dr. Amira Hassan",
    role: "AI Risk Specialist",
    category: "AI Governance",
    excerpt:
      "Autonomous AI systems challenge traditional governance models. A practical framework for accountability and audit in agent-based systems.",
    readTime: "9 min read",
  },
  {
    id: 6,
    title: "Why AI Transformation Programmes Stall After the Pilot",
    date: "January 2026",
    author: "Marcus Wei",
    role: "Transformation Director",
    category: "Transformation",
    excerpt:
      "Most AI transformation stalls after the successful pilot. Why—and how to build governance infrastructure that scales.",
    readTime: "6 min read",
  },
];

export const FRAMEWORKS = [
  {
    id: "eu-ai-act",
    category: "Regulation",
    name: "EU AI ACT",
    description: "Risk-based regulation for AI in EU markets",
  },
  {
    id: "nist-ai-rmf",
    category: "Framework",
    name: "NIST AI RMF",
    description: "Govern, Map, Measure, Manage",
  },
  {
    id: "iso-42001",
    category: "Standard",
    name: "ISO 42001",
    description: "AI management systems",
  },
  {
    id: "iso-27001",
    category: "Standard",
    name: "ISO 27001",
    description: "Information Security for AI systems",
  },
  {
    id: "dora",
    category: "Regulation",
    name: "DORA",
    description: "EU financial sector ICT resilience",
  },
  {
    id: "owasp-ai",
    category: "Security",
    name: "OWASP AI",
    description: "Top 10 AI/LLM risks",
  },
  {
    id: "gdpr-ai",
    category: "Regulation",
    name: "GDPR + AI",
    description: "Data-processing obligations for AI",
  },
];

export { INDUSTRIES } from "./industries-data";

export const LEAD_MAGNETS = [
  {
    id: 1,
    title: "Free Assessment",
    subtitle: "AI Governance Readiness Check",
    description:
      "A six-dimension diagnostic you can complete in 10 minutes, with a gap report within 24 hours.",
    cta: "Start the check →",
    icon: "check",
  },
  {
    id: 2,
    title: "Whitepaper",
    subtitle: "AI Infrastructure for Regulated Industries",
    description:
      "Our 24-page guide to cloud architecture, data systems, and governance for AI in regulated environments.",
    cta: "Download →",
    icon: "download",
  },
];

export const PROOF_ITEMS = [
  {
    metric: "40+",
    label: "Engagements delivered across financial services, healthcare, and critical infrastructure",
    pill: "Book a call",
  },
  {
    metric: "6",
    label: "Governance dimensions assessed per client engagement",
    pill: "See frameworks",
  },
  {
    metric: "72hr",
    label: "Average gap-report turnaround after readiness assessment",
    pill: "Read the note",
  },
] as const;

export const STAT_73PCT_NOTE = "OECD.AI (2024). Based on a survey of 4,500 organisations across 20 countries.";

export const ENGAGEMENT_PHASES = [
  {
    phase: "01",
    title: "Discovery + inventory",
    duration: "Week 1–2",
    deliverables: [
      "AI system inventory and risk classification",
      "Regulatory obligation map (EU AI Act, NIST, ISO 42001)",
      "Stakeholder alignment workshop",
    ],
  },
  {
    phase: "02",
    title: "Governance architecture + controls",
    duration: "Week 3–4",
    deliverables: [
      "Governance framework tailored to your operating model",
      "Model register and risk assessment templates",
      "Cloud landing zone patterns for regulated AI workloads",
    ],
  },
  {
    phase: "03",
    title: "Evidence pack + audit trail",
    duration: "Week 5–6",
    deliverables: [
      "Policy pack, runbooks, and decision logs",
      "Audit trail and evidence repository",
      "Handover to your teams with implementation support",
    ],
  },
] as const;

export const READINESS_DATA = [
  { label: "Policy & Framework", pct: 72 },
  { label: "AI Risk Management", pct: 58 },
  { label: "AI System Inventory", pct: 45 },
  { label: "Regulatory Compliance", pct: 65 },
  { label: "Infrastructure Controls", pct: 52 },
  { label: "Agent Accountability", pct: 38 },
] as const;

export const FOOTER_LINKS = {
  services: [
    { label: "AI Governance", href: "#services" },
    { label: "AI Infrastructure", href: "#services" },
    { label: "Extended capabilities", href: "#services", note: "via partner network" },
  ],
  intelligence: [
    { label: "All articles", href: "#insights" },
  ],
  frameworks: [
    { label: "EU AI Act", href: "#frameworks" },
    { label: "NIST AI RMF", href: "#frameworks" },
    { label: "ISO 42001", href: "#frameworks" },
    { label: "ISO 27001", href: "#frameworks" },
    { label: "DORA", href: "#frameworks" },
  ],
  company: [
    { label: "Contact", href: "#booking" },
  ],
};

export const MARQUEE_ITEMS = [
  "EU AI Act",
  "NIST AI RMF 1.1",
  "ISO/IEC 42001",
  "AI Governance",
  "AI Infrastructure",
  "Forward-Deployed Engineering",
  "Red Teaming",
  "Zero Trust CNAPP",
  "Secrets Management",
  "MCP Integrations",
  "DORA Compliance",
  "AWS",
  "Azure",
  "GCP",
  "MITRE ATLAS",
  "OWASP AI Top 10",
];

export const MARQUEE_REPEATS = 3;
