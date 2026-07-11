"use client";

import { useRef } from "react";
import Link from "next/link";
import { FOOTER_LINKS } from "@/components/site-data";
import { Mail, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

const FOOTER_GROUPS = [
  { title: "Services", links: FOOTER_LINKS.services },
  { title: "Intelligence", links: FOOTER_LINKS.intelligence },
  { title: "Frameworks", links: FOOTER_LINKS.frameworks },
  { title: "Company", links: FOOTER_LINKS.company },
];

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <footer className="bg-[var(--ink)] text-[var(--pa)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brutalist-accent-light)]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Link href="/" className="flex items-center gap-2.5 mb-6 group" aria-label="SMIIT CyberAI home">
                <span className="inline-flex items-center justify-center h-7 w-7 bg-[var(--brutalist-accent-light)] font-mono text-[10px] font-bold text-[var(--ink)] group-hover:bg-[var(--brutalist-accent-foreground)] transition-colors duration-200">
                  SC
                </span>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--pa)]">
                  SMIIT CyberAI
                </span>
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-[var(--pa)]/60 leading-relaxed max-w-xs mb-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
            >
              AI Governance and Infrastructure Consultancy for regulated enterprise.
              Specialist, independent, and anchored in practice. London, UK&nbsp;&mdash;&nbsp;working across the EU and beyond.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            >
              <Link
                href="mailto:hello@smiitcyberai.com"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--pa)]/50 hover:text-[var(--pa)] transition-colors duration-150 group"
                aria-label="Email hello@smiitcyberai.com"
              >
                <Mail size={14} className="group-hover:text-[var(--brutalist-accent-light)] transition-colors" />
                hello@smiitcyberai.com
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          </div>

          {FOOTER_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1 + gi * 0.08 }}
            >
              <p className="text-[10px] font-mono text-[var(--pa)]/40 uppercase tracking-widest mb-4">
                {group.title}
              </p>
              <nav aria-label={`${group.title} links`}>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="footer-link text-xs font-mono uppercase tracking-wider text-[var(--pa)]/60 hover:text-[var(--pa)] transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pt-8 mt-8 border-t border-[var(--pa)]/8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
        >
          <p className="text-[10px] font-mono text-[var(--pa)]/40 uppercase tracking-widest">
            &copy; 2026 SMIIT CyberAI Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[10px] font-mono text-[var(--pa)]/40 uppercase tracking-widest hover:text-[var(--pa)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] font-mono text-[var(--pa)]/40 uppercase tracking-widest hover:text-[var(--pa)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
