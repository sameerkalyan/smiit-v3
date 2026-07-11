"use client";

import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  text: string;
  enabled?: boolean;
  speed?: number;
  jitter?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  enabled = true,
  speed = 55,
  jitter = 35,
  startDelay = 0,
  onComplete,
}: UseTypewriterOptions) {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mql) return;
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const [display, setDisplay] = useState(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return reduced ? text : "";
  });
  const [done, setDone] = useState(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return reduced ?? false;
  });

  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (done) {
      onCompleteRef.current?.();
    }
  }, [done]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (prefersReduced) {
      setDisplay(text);
      setDone(true);
    } else {
      setDisplay("");
      setDone(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [text, prefersReduced]);

  useEffect(() => {
    if (!enabled || prefersReduced) return;

    let startTime: number | null = null;
    let charIndex = 0;
    let lastCharAt = 0;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now + startDelay;
        lastCharAt = startTime;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (now < startTime) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const interval = speed + (Math.random() * jitter - jitter / 2);
      if (now - lastCharAt >= interval && charIndex <= text.length) {
        charIndex += 1;
        setDisplay(text.slice(0, charIndex));
        lastCharAt = now;
        if (charIndex >= text.length) {
          setDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, prefersReduced, text, speed, jitter, startDelay]);

  return { display, done };
}
