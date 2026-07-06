"use client";

import { useState, useRef, useCallback, useMemo, type FormEvent } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { BLOG_ARTICLES } from "@/components/site-data";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ContentCard } from "@/components/content-card";
import type { BlogArticle } from "@/types";
import { EASE } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

type Filter = "All topics" | "AI Governance" | "Infrastructure" | "AI Agents" | "Transformation";

function FeaturedCard({ article, isInView }: { article: BlogArticle; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <ContentCard variant="accent" className="group h-full">
        <ContentCard.Header>
          <span className="brutalist-section-label" style={{ color: "rgba(255,255,255,0.6)" }}>
            FEATURED
          </span>
          <span className="brutalist-section-label" style={{ color: "rgba(255,255,255,0.5)" }}>
            001
          </span>
        </ContentCard.Header>
        <ContentCard.Body className="pt-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] font-mono border border-[var(--brutalist-accent-foreground)]/30 px-2 py-0.5 uppercase tracking-widest" style={{ color: "var(--brutalist-accent-foreground)" }}>
              {article.category}
            </span>
            <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{article.date}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>&middot;</span>
            <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{article.readTime}</span>
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase mb-5 leading-tight" style={{ color: "var(--brutalist-accent-foreground)" }}>
            {article.title}
          </h3>
          <p className="text-sm font-mono leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <span className="inline-flex items-center justify-center h-9 w-9 bg-[var(--brutalist-accent-foreground)] text-[var(--brutalist-accent)] shrink-0">
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-mono font-medium uppercase" style={{ color: "var(--brutalist-accent-foreground)" }}>Read article</span>
          </div>
        </ContentCard.Body>
        <div className="px-5 py-3 border-t-2" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium uppercase" style={{ color: "rgba(255,255,255,0.8)" }}>{article.author.toUpperCase()}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>&middot;</span>
            <span className="text-[10px] font-mono uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{article.role.toUpperCase()}</span>
          </div>
        </div>
      </ContentCard>
    </motion.div>
  );
}

function CompactList({ articles, isInView }: { articles: BlogArticle[]; isInView: boolean }) {
  return (
    <div className="border-2 border-[var(--line)] bg-[var(--surface)]">
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[var(--line)]">
        <span className="brutalist-section-label">MORE_READING</span>
        <span className="brutalist-section-label opacity-40">{String(articles.length).padStart(2, "0")}</span>
      </div>
      <div>
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            className="group px-5 py-4 hover:bg-[var(--line)] transition-colors cursor-pointer border-b border-[var(--line)] last:border-b-0"
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.8 + idx * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <span className="text-[10px] font-mono font-bold text-[var(--ink3)] shrink-0 mt-0.5">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-mono text-[var(--brutalist-accent-light)] uppercase tracking-widest">
                    {article.category}
                  </span>
                  <span className="text-[8px] text-[var(--ink3)]">&middot;</span>
                  <span className="text-[8px] font-mono text-[var(--ink3)]">{article.date}</span>
                </div>
                <h4 className="text-xs font-mono font-bold tracking-tight uppercase text-[var(--ink)] group-hover:text-[var(--brutalist-accent-light)] transition-colors leading-snug">
                  {article.title}
                </h4>
              </div>
              <span className="text-[9px] font-mono text-[var(--ink3)] shrink-0 mt-0.5">
                {article.readTime.replace(" read", "")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
  const rest = filtered.slice(1);

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
                : "border-[var(--line)] text-[var(--ink2)] hover:border-[var(--brutalist-accent-light)] hover:text-[var(--ink)]"
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
            {featured && (
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <FeaturedCard article={featured} isInView={isInView} />
                </div>
                <div className="md:col-span-2">
                  {rest.length > 0 && (
                    <CompactList articles={rest} isInView={isInView} />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 pt-8 border-t-2 border-[var(--brutalist-accent-light)]">
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
              className="flex-1 min-w-0 border-2 border-r-0 sm:border-r-0 border-[var(--brutalist-accent-light)] bg-[var(--pa)] px-4 py-3 text-xs font-mono text-[var(--ink)] placeholder:text-[var(--ink3)] focus:outline-2 focus:outline-[var(--brutalist-accent-light)] focus:outline-offset-2"
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="inline-flex items-center shrink-0 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--brutalist-accent-light)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
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
              Coming soon. Confirmation will be sent to your inbox.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
