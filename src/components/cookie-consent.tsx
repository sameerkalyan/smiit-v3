"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_KEY = "smiit-cookie-consent";

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function CookieConsent() {
  const mounted = useHydrated();
  const [dismissed, setDismissed] = useState(false);

  const hasConsented = mounted ? Boolean(localStorage.getItem(CONSENT_KEY)) : true;
  const shouldShow = mounted && !dismissed && !hasConsented;

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setDismissed(true);
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setDismissed(true);
  }, []);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] border-t-2 border-[var(--line)] bg-[var(--pa)]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-xs font-mono text-[var(--ink2)] leading-relaxed flex-1">
          We use essential cookies to ensure this site functions correctly. By continuing, you agree to our{" "}
          <Link href="/privacy" className="text-[var(--brutalist-accent-light)] hover:underline">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-[10px] font-mono font-medium uppercase tracking-wider border-2 border-[var(--line)] text-[var(--ink2)] hover:border-[var(--ink3)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="brutalist-cta inline-flex"
          >
            <span className="brutalist-cta-icon h-9" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span className="brutalist-cta-label text-[10px]">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
