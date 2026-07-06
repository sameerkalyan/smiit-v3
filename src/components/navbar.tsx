"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/components/site-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { Magnetic } from "@/components/magnetic";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const ulRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const nav = mobileNavRef.current;
    if (!nav) return;

    const focusable = nav.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    first?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const moveIndicator = (el: HTMLElement | null) => {
    if (!el || !ulRef.current) return;
    const ulRect = ulRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - ulRect.left,
      width: elRect.width,
      visible: true,
    });
  };

  const handleItemEnter = (index: number) => {
    const el = itemRefs.current[index];
    moveIndicator(el);
  };

  const handleUlLeave = () => {
    setIndicator((prev) => ({ ...prev, visible: false }));
  };

  return (
    <header
      data-scrolled={scrolled}
      className={`fixed z-50 navbar-transition ${scrolled ? "navbar-scrolled" : "navbar-floating"}`}
    >
      <nav className="mx-auto px-8 flex items-center justify-between lg:px-10 relative z-[1] navbar-inner">
        <Link href="/" prefetch={false} className="flex items-center gap-2.5 shrink-0" aria-label="SMIIT CyberAI home">
          <span className="inline-flex items-center justify-center h-7 w-7 bg-[var(--brutalist-accent)] font-mono text-[10px] font-bold text-[var(--brutalist-accent-foreground)]">
            SC
          </span>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--ink)]">
            SMIIT CyberAI
          </span>
        </Link>

        <div
          className="hidden md:flex items-center gap-9"
          onMouseLeave={handleUlLeave}
        >
          <ul
            ref={ulRef}
            className="flex items-center gap-2 relative p-1"
          >
            <div
              className={`nav-indicator ${indicator.visible ? "visible" : ""}`}
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />
            {NAV_ITEMS.map((item, index) => (
              <li
                key={item.label}
                ref={(el) => { itemRefs.current[index] = el; }}
                onMouseEnter={() => handleItemEnter(index)}
                className="list-none"
              >
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 pl-7 border-l-2 border-[var(--line)]">
            <ThemeToggle />
            <Magnetic strength={0.35}>
            <Link
              href="#booking"
              className="brutalist-cta inline-flex"
              aria-label="Book a call"
            >
              <span className="brutalist-cta-icon h-9" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
                <ArrowRight size={12} strokeWidth={2.5} />
              </span>
              <span className="brutalist-cta-label text-[10px]">BOOK A CALL</span>
            </Link>
            </Magnetic>
          </div>
        </div>

        <button
          ref={menuButtonRef}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-11 w-11 text-[var(--ink)]"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
        <div className="md:hidden flex items-center">
          <ThemeToggle />
        </div>
      </nav>

      {mobileOpen && (
        <div ref={mobileNavRef} className="md:hidden border-t-2 border-[var(--brutalist-accent-light)] bg-[var(--pa)] mobile-nav-enter" role="dialog" aria-label="Mobile navigation">
          <div className="px-6 py-5 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-mono uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)] focus-visible:text-[var(--brutalist-accent-light)] transition-colors duration-150"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#booking"
              className="brutalist-cta inline-flex w-fit"
              onClick={() => setMobileOpen(false)}
              aria-label="Book a call"
            >
              <span className="brutalist-cta-icon h-9" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
                <ArrowRight size={12} strokeWidth={2.5} />
              </span>
              <span className="brutalist-cta-label text-[10px]">BOOK A CALL</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
