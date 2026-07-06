"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressValue = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [ariaNow, setAriaNow] = useState(0);

  useEffect(() => {
    const unsubscribe = progressValue.on("change", (v) => {
      setAriaNow(Math.round(v));
    });
    return unsubscribe;
  }, [progressValue]);

  return (
    <motion.div
      role="progressbar"
      aria-valuenow={ariaNow}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--brutalist-accent)] z-50 origin-left"
      style={{ scaleX }}
    />
  );
}
