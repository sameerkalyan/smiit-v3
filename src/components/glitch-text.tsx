"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GARBAGE_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789ABCDEF";

type Phase = "idle" | "scramble" | "slice" | "resolve" | "flash" | "done";

const PHASE_TIMINGS: { phase: Phase; duration: number }[] = [
  { phase: "scramble", duration: 240 },
  { phase: "slice", duration: 280 },
  { phase: "resolve", duration: 300 },
  { phase: "flash", duration: 200 },
];

interface GlitchTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function GlitchText({ text, delay = 0, className }: GlitchTextProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [display, setDisplay] = useState(text);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  useEffect(() => {
    setPhase("idle");
    setDisplay(text);
    clearAllTimers();

    const delayTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase("scramble");

      let scrambleFrame = 0;
      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        scrambleFrame++;
        setDisplay(
          text
            .split("")
            .map((c, i) =>
              scrambleFrame < 6 && Math.random() > 0.3 + i * 0.05
                ? GARBAGE_CHARS[Math.floor(Math.random() * GARBAGE_CHARS.length)]
                : c
            )
            .join("")
        );
        if (scrambleFrame >= 6) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 40);

      let accumulatedDelay = 0;
      for (const { phase: nextPhase, duration } of PHASE_TIMINGS) {
        accumulatedDelay += duration;
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          if (nextPhase === "resolve" || nextPhase === "done") {
            setDisplay(text);
          }
          setPhase(nextPhase);
        }, accumulatedDelay);
        timersRef.current.push(timer);
      }
    }, delay);

    timersRef.current.push(delayTimer);

    return () => {
      clearAllTimers();
    };
  }, [text, delay, clearAllTimers]);

  return (
    <span
      className={`glitch-text ${className ?? ""}`}
      data-text={display}
      data-phase={phase}
      aria-label={text}
    >
      {display}
    </span>
  );
}
