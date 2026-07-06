"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <span className="text-7xl md:text-[9rem] font-mono font-bold text-[var(--destructive)]/[0.15] leading-none select-none">
        ERR
      </span>
      <h1 className="text-2xl md:text-3xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] mt-[-1.5rem]">
        Something went wrong
      </h1>
      <p className="text-sm font-mono text-[var(--ink2)] mt-4 max-w-md leading-relaxed">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <button
          onClick={reset}
          className="brutalist-cta inline-flex"
        >
          <span className="brutalist-cta-icon h-9" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
            ↻
          </span>
          <span className="brutalist-cta-label text-[10px]">TRY AGAIN</span>
        </button>
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)] transition-colors">
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
