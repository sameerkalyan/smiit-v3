"use client";

import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface AnimatedButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  children: ReactNode;
  href?: string;
  tapScale?: number;
  withArrow?: boolean;
}

export function AnimatedButton({
  children,
  className = "",
  href,
  tapScale = 0.96,
  style: customStyle,
  ...props
}: AnimatedButtonProps) {
  const content = (
    <motion.span
      className={className}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
      style={{ display: "inline-flex", alignItems: "center", ...customStyle }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex no-underline">
        {content}
      </Link>
    );
  }

  return <>{content}</>;
}
