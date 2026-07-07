"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const SPRING_CONFIG = { stiffness: 320, damping: 22, mass: 0.5 };

// Default (floating) vs compact (sticky/scrolled) sizes. When the navbar shrinks
// to the full-width sticky bar, the dock must scale down so it doesn't overflow
// the shorter bar.
const SIZES = {
  default: { distance: 110, magnification: 1.7, base: 42, lift: 10 },
  compact: { distance: 80, magnification: 1.45, base: 30, lift: 8 },
} as const;

function useDockItemScale(
  mouseX: MotionValue<number>,
  ref: React.RefObject<HTMLLIElement | null>,
  compact: boolean
) {
  const { distance: DISTANCE, magnification: MAGNIFICATION, base: BASE_ITEM_SIZE, lift: LIFT } =
    compact ? SIZES.compact : SIZES.default;
  const MAGNIFIED_ITEM_SIZE = BASE_ITEM_SIZE * MAGNIFICATION;

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const itemCenter = rect.x + rect.width / 2;
    return val - itemCenter;
  });

  const sizeTransform = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [BASE_ITEM_SIZE, MAGNIFIED_ITEM_SIZE, BASE_ITEM_SIZE]
  );
  const size = useSpring(sizeTransform, SPRING_CONFIG);

  const yTransform = useTransform(distance, [-DISTANCE, 0, DISTANCE], [0, -LIFT, 0]);
  const y = useSpring(yTransform, SPRING_CONFIG);

  return { size, y };
}

function DockItem({
  mouseX,
  children,
  label,
  href,
  compact,
}: {
  mouseX: MotionValue<number>;
  children: ReactNode;
  label: string;
  href: string;
  compact: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { size, y } = useDockItemScale(mouseX, ref, compact);
  const [hovered, setHovered] = useState(false);

  return (
    <li
      ref={ref}
      className="relative flex items-end justify-center list-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div style={{ y }} className="flex items-end justify-center">
        <motion.div style={{ width: size, height: size }} className="flex items-center justify-center">
          <Link href={href} aria-label={label} className="dock-icon">
            {children}
          </Link>
        </motion.div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0, y: 4, x: "-50%" }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4, x: "-50%" }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="dock-tooltip pointer-events-none"
      >
        {label}
      </motion.span>
    </li>
  );
}

export function Dock({
  items,
  compact = false,
}: {
  items: { label: string; href: string; icon: ReactNode }[];
  compact?: boolean;
}) {
  const mouseX = useMotionValue(Infinity);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reducedMotion;

  const onMouseMove = (e: React.MouseEvent) => {
    if (!enabled) return;
    // Store the absolute viewport X so it shares the same coordinate space as
    // the per-item centers computed in useDockItemScale (which use viewport-absolute
    // getBoundingClientRect().x). Mixing container-relative and viewport-absolute
    // coordinates broke the magnification centering.
    mouseX.set(e.clientX);
  };

  const onMouseLeave = () => {
    if (!enabled) return;
    mouseX.set(Infinity);
  };

  return (
    <motion.ul
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`dock${compact ? " dock-compact" : ""}`}
    >
      {items.map((item) => (
        <DockItem key={item.label} mouseX={mouseX} label={item.label} href={item.href} compact={compact}>
          {item.icon}
        </DockItem>
      ))}
    </motion.ul>
  );
}
