"use client";

import { useState, useRef, useCallback, useMemo, type FormEvent } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { BLOG_ARTICLES } from "@/components/site-data";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ContentCard } from "@/components/content-card";
import type { BlogArticle } from "@/types";
import { EASE } from "@/lib/motion";

type Filter = "All topics" | "AI Governance" | "Infrastructure" | "AI Agents" | "Transformation";

function FeaturedCard({ article, isInView }: { article: BlogArticle; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <ContentCard variant="ghost" className="glass-card group p-8 md:p-10 border border-white/[0.08] border-l-2 backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[9px] font-mono text-[var(--brutalist-accent)] border border-[var(--brutalist-accent)] px-2 py-0.5 uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-[9px] font-mono text-[var(--ink3)]">{article.date}</span>
          <span className="text-[9px] text-[var(--ink3)]">·</span>
          <span className="text-[9px] font-mono text-[var(--ink3)]">{article.readTime}</span>
        </div>
        <h3 className="text-lg md:text-xl font-mono font-bold tracking-tight uppercase text-[var(--ink)] mb-4 group-hover:text-[var(--brutalist-accent)] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm font-mono text-[var(--ink2)] leading-relaxed mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium text-[var(--ink)] uppercase">{article.author.toUpperCase()}</span>
          <span className="text-[9px] text-[var(--ink3)]">·</span>
          <span className="text-[10px] font-mono text-[var(--ink3)] uppercase">{article.role.toUpperCase()}</span>
        </div>
      </ContentCard>
    </motion.div>
  );
}

function SecondaryCard({ article, isInView, delay }: { article: BlogArticle; isInView: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
    >
      <ContentCard variant="ghost" className="glass-card group px-5 py-6 border border-white/[0.08] border-l-2 backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300 h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-mono text-[var(--brutalist-accent)] uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-[9px] text-[var(--ink3)]">·</span>
          <span className="text-[9px] font-mono text-[var(--ink3)]">{article.readTime}</span>
        </div>
        <h3 className="text-sm font-mono font-bold tracking-tight uppercase text-[var(--ink)] mb-3 group-hover:text-[var(--brutalist-accent)] transition-colors">
          {article.title}
        </h3>
        <p className="text-xs font-mono text-[var(--ink2)] leading-relaxed flex-1">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
          <span className="text-[9px] font-mono font-medium text-[var(--ink)] uppercase">{article.author.toUpperCase()}</span>
          <span className="text-[9px] text-[var(--ink3)]">·</span>
          <span className="text-[9px] font-mono text-[var(--ink3)] uppercase">{article.role.toUpperCase()}</span>
        </div>
      </ContentCard>
    </motion.div>
  );
}

function CompactCard({ article, isInView, delay }: { article: BlogArticle; isInView: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: EASE, delay }}
    >
      <div className="group flex flex-col gap-2 py-4 border-b border-white/[0.06] last:border-b-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[var(--brutalist-accent)] uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-[9px] text-[var(--ink3)]">·</span>
          <span className="text-[9px] font-mono text-[var(--ink3)]">{article.date}</span>
        </div>
        <h3 className="text-xs font-mono font-bold tracking-tight uppercase text-[var(--ink)] group-hover:text-[var(--brutalist-accent)] transition-colors">
          {article.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function InsightsSection() {
  const [filter, setFilter] = useState<Filter>("All topics");
  const [filterKey, setFilterKey] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: false, margin: "-60px 0px" });

  const handleSubscribe = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus("idle"), 4000);
    }, 800);
  }, [newsletterEmail]);

  const filters = useMemo<Filter[]>(
    () => ["All topics", "AI Governance", "Infrastructure", "AI Agents", "Transformation"],
    []
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectFilter = useCallback((f: Filter) => {
    setFilter(f);
    setFilterKey((k) => k + 1);
  }, []);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const tabs = tabRefs.current;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (idx + 1) % filters.length;
        selectFilter(filters[next]);
        tabs[next]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (idx - 1 + filters.length) % filters.length;
        selectFilter(filters[prev]);
        tabs[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        selectFilter(filters[0]);
        tabs[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        selectFilter(filters[filters.length - 1]);
        tabs[filters.length - 1]?.focus();
      }
    },
    [selectFilter, filters]
  );

  const filtered = filter === "All topics" ? BLOG_ARTICLES : BLOG_ARTICLES.filter((a) => a.category === filter);
  const featured = filtered[0];
  const secondary = filtered.slice(1, 3);
  const compact = filtered.slice(3);

  return (
    <Section
      id="insights"
      label="INSIGHTS"
      index={6}
      surface="recessed"
      motionTier="static"
    >
      <SectionHeading>
        Analysis for compliance and engineering leaders.
      </SectionHeading>

      <div className="flex flex-nowrap gap-0 overflow-x-auto scrollbar-hide mb-12" role="tablist" aria-label="Article categories">
        {filters.map((f, idx) => (
          <button
            key={f}
            role="tab"
            id={`insights-tab-${f.replace(/\s/g, "-").toLowerCase()}`}
            aria-selected={filter === f}
            aria-controls="insights-tabpanel"
            tabIndex={filter === f ? 0 : -1}
            ref={(el) => { tabRefs.current[idx] = el; }}
            onClick={() => selectFilter(f)}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
            className={`px-4 py-2 text-[10px] font-mono font-medium uppercase tracking-wider border-2 whitespace-nowrap cursor-pointer ${
              filter === f
                ? "border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                : "border-[var(--line)] text-[var(--ink2)] hover:border-[var(--brutalist-accent)] hover:text-[var(--ink)]"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div ref={gridRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={filterKey}
            role="tabpanel"
            id="insights-tabpanel"
            aria-labelledby={`insights-tab-${filter.replace(/\s/g, "-").toLowerCase()}`}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {featured && <FeaturedCard article={featured} isInView={isInView} />}

            {secondary.length > 0 && (
              <div className="grid md:grid-cols-2 gap-0 mt-0">
                {secondary.map((article, idx) => (
                  <SecondaryCard key={article.id} article={article} isInView={isInView} delay={0.5 + idx * 0.5} />
                ))}
              </div>
            )}

            {compact.length > 0 && (
              <div className="mt-2 md:ml-8 md:max-w-md">
                {compact.map((article, idx) => (
                  <CompactCard key={article.id} article={article} isInView={isInView} delay={1 + idx * 0.3} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 pt-8 border-t-2 border-[var(--brutalist-accent)]">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="max-w-md">
            <p className="text-[10px] font-mono text-[var(--ink3)] uppercase tracking-widest mb-3">
              Newsletter
            </p>
            <h3 className="text-lg font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-2">
              The SMIIT Intelligence Brief
            </h3>
            <p className="text-xs font-mono text-[var(--ink2)]">
              Fortnightly analysis for technology and compliance leaders. No noise, just signal.
            </p>
          </div>
          <form
            className="flex flex-col sm:flex-row gap-0 w-full md:w-auto"
            onSubmit={handleSubscribe}
          >
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 min-w-0 border-2 border-r-0 sm:border-r-0 border-[var(--brutalist-accent)] bg-[var(--pa)] px-4 py-3 text-xs font-mono text-[var(--ink)] placeholder:text-[var(--ink3)] focus:outline-2 focus:outline-[var(--brutalist-accent)] focus:outline-offset-2"
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="inline-flex items-center shrink-0 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
            >
              <span className="flex items-center justify-center w-9 h-10 bg-[var(--pa2)] text-[var(--ink)] shrink-0">
                {newsletterStatus === "success" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                )}
              </span>
              <span className="px-4 py-3 whitespace-nowrap">
                {newsletterStatus === "loading" ? "SENDING..."
                  : newsletterStatus === "success" ? "SUBSCRIBED"
                  : "SUBSCRIBE"}
              </span>
            </button>
          </form>
          {newsletterStatus === "success" && (
            <p className="text-[10px] font-mono text-[var(--ink3)] mt-3">
              Confirmation sent. Check your inbox.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
