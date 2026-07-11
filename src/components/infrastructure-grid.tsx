"use client";

import { useEffect, useRef } from "react";

interface InfrastructureGridProps {
  active: boolean;
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phase: number;
  pulsePhase: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export function InfrastructureGrid({ active }: InfrastructureGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let lastPulseSpawn = 0;
    let startTime = 0;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
      generateNodes();
    }

    function generateNodes() {
      nodes = [];
      const spacing = 80;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offsetX = (r % 2) * (spacing / 2);
          const baseX = c * spacing + offsetX - spacing / 2;
          const baseY = r * spacing - spacing / 2;
          nodes.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            phase: Math.random() * Math.PI * 2,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function spawnPulse() {
      if (nodes.length < 2) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = Math.floor(Math.random() * nodes.length);
      if (toIdx === fromIdx) toIdx = (toIdx + 1) % nodes.length;
      const dist = Math.hypot(
        nodes[toIdx].x - nodes[fromIdx].x,
        nodes[toIdx].y - nodes[fromIdx].y
      );
      if (dist > 200) return;
      pulses.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: 0.004 + Math.random() * 0.006,
      });
    }

    function draw(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      ctx!.clearRect(0, 0, width, height);

      const driftX = Math.sin(elapsed * 0.00008) * 3;
      const driftY = Math.cos(elapsed * 0.00006) * 2;

      for (const node of nodes) {
        node.x = node.baseX + Math.sin(elapsed * 0.0003 + node.phase) * 1.5 + driftX;
        node.y = node.baseY + Math.cos(elapsed * 0.0002 + node.phase) * 1.5 + driftY;
      }

      ctx!.strokeStyle = "rgba(155, 239, 116, 0.04)";
      ctx!.lineWidth = 0.5;
      const maxDist = 110;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.06;
            ctx!.strokeStyle = `rgba(155, 239, 116, ${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      if (now - lastPulseSpawn > 800) {
        spawnPulse();
        lastPulseSpawn = now;
      }

      pulses = pulses.filter((p) => p.progress < 1);
      for (const p of pulses) {
        p.progress += p.speed;
        if (p.progress > 1) continue;
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) continue;
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        ctx!.fillStyle = "rgba(155, 239, 116, 0.6)";
        ctx!.shadowBlur = 6;
        ctx!.shadowColor = "rgba(155, 239, 116, 0.4)";
        ctx!.beginPath();
        ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      for (const node of nodes) {
        const pulseIntensity = (Math.sin(elapsed * 0.0005 + node.pulsePhase) + 1) / 2;
        const alpha = 0.08 + pulseIntensity * 0.12;
        ctx!.fillStyle = `rgba(155, 239, 116, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 1, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    if (active) {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: active ? 1 : 0, transition: "opacity 1.5s ease-in-out" }}
      aria-hidden="true"
    />
  );
}
