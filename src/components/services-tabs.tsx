"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { SERVICES } from "@/components/site-data";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ContentCard } from "@/components/content-card";
import { Check } from "lucide-react";
import { EASE } from "@/lib/motion";

export function ServicesTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const active = SERVICES[activeIndex];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-80px 0px" });

  const selectTab = useCallback((idx: number) => {
    setActiveIndex(idx);
    setPanelKey((k) => k + 1);
  }, []);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const tabs = tabRefs.current;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        selectTab((idx + 1) % SERVICES.length);
        tabs[(idx + 1) % SERVICES.length]?.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + SERVICES.length) % SERVICES.length;
        selectTab(prev);
        tabs[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        selectTab(0);
        tabs[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        selectTab(SERVICES.length - 1);
        tabs[SERVICES.length - 1]?.focus();
      }
    },
    [selectTab]
  );

  return (
    <Section
      id="services"
      label="SERVICES"
      index={3}
      surface="base"
      motionTier="static"
    >
      <div ref={sectionRef} className="flex flex-col lg:flex-row gap-8">
        <motion.div
          className="flex lg:flex-col flex-wrap gap-0 shrink-0"
          role="tablist"
          aria-label="Service categories"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {SERVICES.map((s, idx) => (
            <button
              type="button"
              key={s.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              role="tab"
              id={`services-tab-${s.id}`}
              aria-selected={activeIndex === idx}
              aria-controls="services-tabpanel"
              tabIndex={activeIndex === idx ? 0 : -1}
              onClick={() => selectTab(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`px-5 py-2.5 text-xs font-mono font-medium uppercase tracking-wider border-2 transition-colors cursor-pointer ${
                activeIndex === idx
                  ? "border-[var(--brutalist-accent)] bg-[var(--brutalist-accent)] text-[var(--brutalist-accent-foreground)]"
                  : "border-[var(--line)] text-[var(--ink2)] hover:border-[var(--brutalist-accent)] hover:text-[var(--ink)]"
              }`}
            >
              {s.title}
            </button>
          ))}
          <p className="text-[10px] font-mono text-[var(--ink3)] pt-3 leading-relaxed">
            Extended capabilities via partner network.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            role="tabpanel"
            id="services-tabpanel"
            aria-labelledby={`services-tab-${active.id}`}
            tabIndex={0}
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ContentCard variant="default" className="p-6 md:p-8">
              <div className="flex flex-col xl:flex-row gap-8">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
                >
                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-medium border-2 border-[var(--brutalist-accent)] text-[var(--brutalist-accent)] bg-transparent mb-4">
                    {active.tag.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-mono font-bold tracking-tight uppercase text-[var(--ink)] mb-4">
                    {active.title}
                  </h3>
                  <p className="text-sm font-mono text-[var(--ink2)] leading-relaxed mb-6">
                    {active.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    {active.bullets.map((b, i) => (
                      <div key={i} className="brutalist-feature-row">
                        <span className="feat-icon text-[var(--brutalist-accent)]">
                          <Check size={14} strokeWidth={2.5} />
                        </span>
                        <span className="text-sm font-mono text-[var(--ink2)] leading-snug">
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                {active.frameworks && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
                  >
                    <ContentCard.Aside>
                      <p className="text-[10px] font-mono text-[var(--ink3)] uppercase tracking-widest">
                        Frameworks
                      </p>
                      <ul className="space-y-2">
                        {active.frameworks.map((f) => (
                          <li
                            key={f}
                            className="flex items-center justify-between text-sm font-mono py-1.5 border-b-2 border-[var(--line)]"
                          >
                            <span className="text-[var(--ink2)]">{f}</span>
                            <span className="text-[9px] font-mono text-[var(--ink3)] uppercase tracking-wider px-2 py-0.5 border-2 border-[var(--brutalist-accent)] text-[var(--brutalist-accent)]">
                              {active.sideItems[0]}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--ink3)] uppercase tracking-widest">
                          Stack coverage
                        </span>
                        <span className="text-[10px] font-mono text-[var(--brutalist-accent)] uppercase">
                          Covered
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {active.stackRows?.map((s, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono px-2 py-1 border-2 border-[var(--line)] text-[var(--ink2)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </ContentCard.Aside>
                  </motion.div>
                )}
              </div>
            </ContentCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
