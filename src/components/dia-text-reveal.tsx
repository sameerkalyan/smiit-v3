"use client";

import { motion } from "motion/react";

interface DiaTextRevealProps {
  text: string;
  active: boolean;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function DiaTextReveal({
  text,
  active,
  className = "",
  stagger = 0.035,
  delay = 0,
}: DiaTextRevealProps) {
  const words = text.split(" ");

  return (
    <span className={`dia-reveal ${active ? "active" : ""} ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="dia-word"
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={
            active
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 6, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
          {" "}
        </motion.span>
      ))}
    </span>
  );
}
