export interface Service {
  id: number;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  sideItems: string[];
  frameworks?: string[];
  stackRows?: string[];
  coveredItems?: string[];
}

export interface BlogArticle {
  id: number;
  title: string;
  date: string;
  author: string;
  role: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export interface FrameworkRow {
  id: string;
  category: string;
  name: string;
  description: string;
}

export interface IndustryCard {
  id: number;
  name: string;
  label: string;
  code: string;
  description: string;
  price?: string;
  priceLabel?: string;
  recommended?: boolean;
  ctaLabel: string;
  features: { label: string; included: boolean }[];
}

export interface LeadMagnet {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  icon: string;
}

export interface ReadinessItem {
  label: string;
  pct: number;
}

export interface BookingType {
  id: number;
  label: string;
  href: string;
  duration: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
