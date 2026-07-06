"use client";

import { useCallback, useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  captionText?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

const springConfig = { damping: 30, stiffness: 100, mass: 2 };
const tooltipSpringConfig = { stiffness: 350, damping: 30, mass: 1 };

function subscribe() { return () => {} }
function getSnapshot() { return typeof window !== "undefined" ? (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false) : false }
function getServerSnapshot() { return false }

export function TiltCard({
  children,
  captionText = "",
  rotateAmplitude = 6,
  scaleOnHover = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isTouch = useSyncExternalStore(
    () => () => {},
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    () => false
  );

  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scale = useSpring(1, springConfig);
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  const tooltipOpacity = useSpring(0, tooltipSpringConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || reducedMotion || isTouch) return;
      const rect = ref.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
      rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
      tooltipX.set(e.clientX - rect.left);
      tooltipY.set(e.clientY - rect.top);
    },
    [reducedMotion, isTouch, rotateAmplitude, rotateX, rotateY, tooltipX, tooltipY]
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion || isTouch) return;
    scale.set(scaleOnHover);
    tooltipOpacity.set(1);
  }, [reducedMotion, isTouch, scaleOnHover, scale, tooltipOpacity]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion || isTouch) return;
    tooltipOpacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }, [reducedMotion, isTouch, scale, rotateX, rotateY, tooltipOpacity]);

  return (
    <div
      ref={ref}
      className="tilt-card-container group/tilt"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilt-card-inner"
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          scale: reducedMotion ? 1 : scale,
        }}
      >
        {children}
      </motion.div>

      {captionText && (
        <motion.div
          className="tilt-card-tooltip"
          aria-hidden="true"
          style={{
            left: tooltipX,
            top: tooltipY,
            opacity: reducedMotion ? 0 : tooltipOpacity,
          }}
        >
          {captionText}
        </motion.div>
      )}
    </div>
  );
}
