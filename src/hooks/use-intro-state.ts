"use client";

import { useCallback, useEffect, useState } from "react";

export interface IntroState {
  showIntro: boolean;
  introComplete: boolean;
  skipIntro: () => void;
  completeIntro: () => void;
}

export function useIntroState(): IntroState {
  // Render the intro overlay from the VERY FIRST paint (SSR + first client
  // render) so the real hero never flashes underneath before the intro mounts.
  // The only reason to skip is prefers-reduced-motion, decided after mount.
  const [forceComplete, setForceComplete] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mql) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const showIntro = !forceComplete;
  const introComplete = forceComplete || reduced;

  const skipIntro = useCallback(() => setForceComplete(true), []);
  const completeIntro = useCallback(() => setForceComplete(true), []);

  return {
    showIntro,
    introComplete,
    skipIntro,
    completeIntro,
  };
}
