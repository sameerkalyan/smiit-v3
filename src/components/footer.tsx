import Link from "next/link";
import { FOOTER_LINKS } from "@/components/site-data";
import { Mail } from "lucide-react";

const FOOTER_GROUPS = [
  { title: "Services", links: FOOTER_LINKS.services },
  { title: "Intelligence", links: FOOTER_LINKS.intelligence },
  { title: "Frameworks", links: FOOTER_LINKS.frameworks },
  { title: "Company", links: FOOTER_LINKS.company },
];

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--pa)] border-t-2 border-[var(--brutalist-accent-light)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6" aria-label="SMIIT CyberAI home">
              <span className="inline-flex items-center justify-center h-7 w-7 bg-[var(--brutalist-accent)] font-mono text-[10px] font-bold text-[var(--brutalist-accent-foreground)]">
                SC
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--pa)]">
                SMIIT CyberAI
              </span>
            </Link>
            <p className="text-sm text-[var(--pa)]/70 leading-relaxed max-w-xs mb-6">
              AI Governance and Infrastructure Consultancy for regulated enterprise.
              Specialist, independent, and anchored in practice. London, UK.
            </p>
            <Link
              href="mailto:hello@smiitcyberai.com"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--pa)]/60 hover:text-[var(--pa)] transition-colors duration-150"
              aria-label="Email hello@smiitcyberai.com"
            >
              <Mail size={14} /> hello@smiitcyberai.com
            </Link>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-mono text-[var(--pa)] uppercase tracking-widest mb-4">
                {group.title}
              </p>
              <nav aria-label={`${group.title} links`}>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="footer-link text-xs font-mono uppercase tracking-wider text-[var(--pa)]/70 hover:text-[var(--pa)] transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t-2 border-[var(--pa)]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-mono text-[var(--pa)]/50 uppercase tracking-widest">
              © 2026 SMIIT CyberAI Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-[10px] font-mono text-[var(--pa)]/50 uppercase tracking-widest hover:text-[var(--pa)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[10px] font-mono text-[var(--pa)]/50 uppercase tracking-widest hover:text-[var(--pa)] transition-colors">
                Terms of Service
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}