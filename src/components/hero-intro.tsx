"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EUROPE_MAP, EUROPE_NODE_POSITIONS, EUROPE_CONNECTIONS } from "@/lib/europe-map";

interface HeroIntroProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TerminalLine {
  text: string;
  id: number;
}

const PHASE_DURATIONS = {
  phase1End: 800,
  phase2End: 1800,
  phase3End: 3200,
  phase4End: 4500,
  phase5End: 5500,
  phase6End: 6000,
};

const MAX_TERMINAL_LINES = 16;

const PACKET_LINES = [
  "AUTH...",
  "VERIFY...",
  "NODE 01",
  "NODE 08",
  "NODE 15",
  "01001011",
  "00101101",
  "10101001",
  "███████",
  "NODE 03",
  "NODE 12",
  "NODE 22",
  "11001010",
  "AUTH OK",
  "NODE 07",
  "01110110",
  "███████",
];

const COUNTRY_CODES = ["DE", "FR", "NL", "IT", "SE", "ES", "PL", "AT", "CZ", "RO", "GR", "HU", "BG", "DK", "BE", "CH"];

export function HeroIntro({ onComplete, onSkip }: HeroIntroProps) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [showCursor] = useState(true);
  const [showBootCursor, setShowBootCursor] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [statusPercent, setStatusPercent] = useState(0);
  const [showEnforcementActive, setShowEnforcementActive] = useState(false);
  const [showRegulation, setShowRegulation] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);
  const lineIdRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const cancelledRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setOverlayOpacity(0);
    setTimeout(() => onCompleteRef.current(), 400);
  }, []);

  // Esc key to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSkip]);

  const pushLine = useCallback((text: string) => {
    setTerminalLines((prev) =>
      [...prev, { text, id: lineIdRef.current++ }].slice(-MAX_TERMINAL_LINES)
    );
  }, []);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, ms);
      timersRef.current.push(id);
    });
  }, []);

  const typeText = useCallback(async (text: string, speed: number) => {
    for (let i = 1; i <= text.length; i++) {
      if (cancelledRef.current) return;
      setCurrentTyping(text.slice(0, i));
      await sleep(speed + (Math.random() * 20 - 10));
    }
  }, [sleep]);

  // Main timeline orchestrator — sequential so packets only stream after the
  // CONNECTING line is fully typed (per Phase 2 intent).
  useEffect(() => {
    cancelledRef.current = false;
    timersRef.current = [];

    const run = async () => {
      // Phase 1 — Cold Boot
      await sleep(300);
      setShowBootCursor(false);
      await typeText("INITIALIZING...", 35);
      pushLine("INITIALIZING...");
      setCurrentTyping("");
      await sleep(150);

      // Phase 2 — Regulatory System Boot
      await typeText("EU AI ACT", 40);
      pushLine("EU AI ACT");
      setCurrentTyping("");
      await sleep(200);
      await typeText("REGULATION (EU) 2024/1689", 28);
      pushLine("REGULATION (EU) 2024/1689");
      setCurrentTyping("");
      await sleep(200);
      await typeText("CONNECTING TO MEMBER STATES...", 30);
      pushLine("CONNECTING TO MEMBER STATES...");
      setCurrentTyping("");

      // Packets stream ONLY after CONNECTING has printed
      for (const pkt of PACKET_LINES) {
        if (cancelledRef.current) return;
        pushLine(pkt);
        await sleep(70);
      }
    };

    void run();

    // Canvas phases are driven on the fixed 6s wall-clock so the map timing
    // matches the brief exactly, independent of typing speed.
    const phaseTimers: [number, number][] = [
      [PHASE_DURATIONS.phase2End, 2],
      [PHASE_DURATIONS.phase3End, 3],
      [PHASE_DURATIONS.phase4End, 4],
      [PHASE_DURATIONS.phase5End, 5],
      [PHASE_DURATIONS.phase6End, 6],
    ];
    for (const [at, p] of phaseTimers) {
      const id = window.setTimeout(() => {
        phaseRef.current = p;
      }, at);
      timersRef.current.push(id);
    }

    // Phase 4 — country activation list (DE ✔, FR ✔, ...)
    const t4 = window.setTimeout(() => {
      phaseRef.current = 4;
      let countryIdx = 0;
      const countryInterval = window.setInterval(() => {
        if (cancelledRef.current) {
          clearInterval(countryInterval);
          return;
        }
        if (countryIdx >= COUNTRY_CODES.length) {
          clearInterval(countryInterval);
          return;
        }
        pushLine(`${COUNTRY_CODES[countryIdx]} ✔`);
        countryIdx++;
      }, 80);
      timersRef.current.push(countryInterval as unknown as number);
    }, PHASE_DURATIONS.phase3End);
    timersRef.current.push(t4);

    // Phase 5 — Enforcement Activated (terminal side)
    const t5 = window.setTimeout(() => {
      phaseRef.current = 5;
      pushLine("");
      pushLine("STATUS");
      setShowStatus(true);

      const statusStart = performance.now();
      const statusDuration = 500;
      const animateStatus = (now: number) => {
        if (cancelledRef.current) return;
        const progress = Math.min((now - statusStart) / statusDuration, 1);
        setStatusPercent(Math.floor(progress * 100));
        if (progress < 1) {
          requestAnimationFrame(animateStatus);
        } else {
          setTimeout(() => {
            setShowEnforcementActive(true);
            setTimeout(() => setShowRegulation(true), 250);
          }, 200);
        }
      };
      requestAnimationFrame(animateStatus);
    }, PHASE_DURATIONS.phase4End);
    timersRef.current.push(t5);

    // Phase 6 — Brand Reveal
    const t6 = window.setTimeout(() => {
      phaseRef.current = 6;
      setShowHero(true);
    }, PHASE_DURATIONS.phase5End);
    timersRef.current.push(t6);

    // Complete (6.0s)
    const t7 = window.setTimeout(() => finish(), PHASE_DURATIONS.phase6End);
    timersRef.current.push(t7);

    return () => {
      cancelledRef.current = true;
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canvas: Europe map + particles (responsive layout)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const mapRows = EUROPE_MAP.length;
    const mapCols = Math.max(...EUROPE_MAP.map((r) => r.length));

    const charSizeRef = { current: 8 };
    const layoutRef = { current: { offX: 0, offY: 0, cs: 8 } };

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cs = Math.max(6, Math.min((width * 0.6) / mapCols, (height * 0.52) / mapRows));
      charSizeRef.current = cs;
      const mw = mapCols * cs;
      const mh = mapRows * cs;
      layoutRef.current = {
        offX: width / 2 - mw / 2,
        offY: height / 2 - mh / 2,
        cs,
      };
    }

    resize();
    window.addEventListener("resize", resize);

    const chars = [" ", ".", "+", "#", "░", "▒", "█"];

    interface MapCell {
      c: number;
      r: number;
      targetChar: string;
      currentChar: string;
      resolved: boolean;
      resolveTime: number;
      isNode: boolean;
      activated: boolean;
      activateTime: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      char: string;
      life: number;
      maxLife: number;
    }

    let cells: MapCell[] = [];
    let particles: Particle[] = [];

    function initMap() {
      cells = [];
      for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < EUROPE_MAP[r].length; c++) {
          const target = EUROPE_MAP[r][c];
          if (target === " " || target === ".") {
            if (target === "." && Math.random() < 0.15) {
              cells.push({
                c,
                r,
                targetChar: ".",
                currentChar: chars[Math.floor(Math.random() * chars.length)],
                resolved: false,
                resolveTime: 0,
                isNode: false,
                activated: false,
                activateTime: 0,
              });
            }
            continue;
          }
          let isNode = false;
          for (const node of EUROPE_NODE_POSITIONS) {
            if (Math.abs(node.x - c) < 2 && Math.abs(node.y - r) < 2) {
              isNode = true;
              break;
            }
          }
          cells.push({
            c,
            r,
            targetChar: target,
            currentChar: chars[Math.floor(Math.random() * chars.length)],
            resolved: false,
            resolveTime: 0,
            isNode,
            activated: false,
            activateTime: 0,
          });
        }
      }
    }

    initMap();

    startTimeRef.current = 0;

    function nodeScreenPos(node: { x: number; y: number }) {
      const { offX, offY, cs } = layoutRef.current;
      return {
        x: offX + node.x * cs + cs / 2,
        y: offY + node.y * cs + cs / 2,
      };
    }

    function draw(now: number) {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const phase = phaseRef.current;

      ctx!.clearRect(0, 0, width, height);
      const cs = charSizeRef.current;
      ctx!.font = `${cs}px "IBM Plex Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      const { offX, offY } = layoutRef.current;

      if (phase >= 3 && phase < 6) {
        const phase3Start = PHASE_DURATIONS.phase2End;
        const phase3Progress = Math.min((elapsed - phase3Start) / (PHASE_DURATIONS.phase3End - phase3Start), 1);

        for (const cell of cells) {
          if (!cell.resolved) {
            const cellDelay = Math.random() * 800;
            const cellElapsed = elapsed - phase3Start - cellDelay;
            if (cellElapsed > 0 && phase3Progress > Math.random() * 0.8) {
              cell.resolved = true;
              cell.resolveTime = now;
              cell.currentChar = cell.targetChar;
            } else if (Math.random() < 0.05) {
              cell.currentChar = chars[Math.floor(Math.random() * chars.length)];
            }
          }

          const resolveAge = cell.resolved ? now - cell.resolveTime : 0;
          const baseAlpha = cell.resolved ? 0.6 : 0.15;

          if (phase >= 4 && cell.isNode && !cell.activated) {
            if (Math.random() < 0.02) {
              cell.activated = true;
              cell.activateTime = now;
            }
          }

          let alpha = baseAlpha;
          if (cell.activated) {
            const activateAge = now - cell.activateTime;
            const pulse = Math.exp(-activateAge / 800) * 0.4;
            alpha = Math.min(1, baseAlpha + pulse);
          }

          if (resolveAge < 300 && cell.resolved) {
            alpha *= resolveAge / 300;
          }

          ctx!.fillStyle = `rgba(155, 239, 116, ${alpha})`;
          ctx!.fillText(cell.currentChar, offX + cell.c * cs + cs / 2, offY + cell.r * cs + cs / 2);
        }

        if (phase >= 4) {
          const phase4Start = PHASE_DURATIONS.phase3End;
          const phase4Progress = Math.min((elapsed - phase4Start) / (PHASE_DURATIONS.phase4End - phase4Start), 1);
          const numConnections = Math.floor(EUROPE_CONNECTIONS.length * phase4Progress);

          ctx!.strokeStyle = "rgba(155, 239, 116, 0.15)";
          ctx!.lineWidth = 0.5;

          for (let i = 0; i < numConnections; i++) {
            const [a, b] = EUROPE_CONNECTIONS[i];
            const nodeA = EUROPE_NODE_POSITIONS[a];
            const nodeB = EUROPE_NODE_POSITIONS[b];
            if (!nodeA || !nodeB) continue;

            const pa = nodeScreenPos(nodeA);
            const pb = nodeScreenPos(nodeB);

            ctx!.beginPath();
            ctx!.moveTo(pa.x, pa.y);
            ctx!.lineTo(pb.x, pb.y);
            ctx!.stroke();
          }

          const pulseCount = 3;
          for (let p = 0; p < pulseCount; p++) {
            const connIdx = Math.floor((elapsed * 0.001 + p * 0.3) % Math.max(1, numConnections));
            const progress = (elapsed * 0.0008 + p * 0.3) % 1;
            const conn = EUROPE_CONNECTIONS[connIdx % Math.max(1, numConnections)] || EUROPE_CONNECTIONS[0];
            const [a, b] = conn;
            const nodeA = EUROPE_NODE_POSITIONS[a];
            const nodeB = EUROPE_NODE_POSITIONS[b];
            if (!nodeA || !nodeB) continue;

            const pa = nodeScreenPos(nodeA);
            const pb = nodeScreenPos(nodeB);

            const px = pa.x + (pb.x - pa.x) * progress;
            const py = pa.y + (pb.y - pa.y) * progress;

            ctx!.fillStyle = "rgba(155, 239, 116, 0.8)";
            ctx!.shadowBlur = 8;
            ctx!.shadowColor = "rgba(155, 239, 116, 0.6)";
            ctx!.beginPath();
            ctx!.arc(px, py, 2, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.shadowBlur = 0;
          }
        }
      }

      // Phase 6: dissolution into particles
      if (phase >= 6) {
        const phase6Progress = Math.min((elapsed - PHASE_DURATIONS.phase5End) / (PHASE_DURATIONS.phase6End - PHASE_DURATIONS.phase5End), 1);

        if (particles.length === 0 && cells.length > 0) {
          for (const cell of cells) {
            if (cell.targetChar === " " || cell.targetChar === ".") continue;
            const { offX: ox, offY: oy, cs: csize } = layoutRef.current;
            particles.push({
              x: ox + cell.c * csize + csize / 2,
              y: oy + cell.r * csize + csize / 2,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -Math.random() * 1.5 - 0.3,
              char: cell.currentChar,
              life: 0,
              maxLife: 500 + Math.random() * 300,
            });
          }
          cells = [];
        }

        for (const p of particles) {
          p.life += 16;
          p.x += p.vx;
          p.y += p.vy;
          p.vy *= 0.99;
          const alpha = Math.max(0, 1 - p.life / p.maxLife) * (1 - phase6Progress * 0.5);
          ctx!.fillStyle = `rgba(155, 239, 116, ${alpha * 0.6})`;
          ctx!.fillText(p.char, p.x, p.y);
        }
        particles = particles.filter((p) => p.life < p.maxLife);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const statusBar = "█".repeat(Math.floor(statusPercent / 6));
  const heroLines = ["EU AI ACT", "ENFORCEMENT", "HAS BEGUN."];

  return (
    <div
      className="hero-intro-overlay"
      style={{
        opacity: overlayOpacity,
        transition: "opacity 0.4s ease-out",
        pointerEvents: overlayOpacity < 0.5 ? "none" : "auto",
      }}
      role="dialog"
      aria-label="System initialization"
    >
      <div className="hero-intro-bloom" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Phase 1 standalone blinking cursor */}
      {showBootCursor && !showHero && (
        <div
          className="absolute left-[8%] top-[12%] z-10"
          style={{ fontSize: "clamp(9px, 1.1vw, 13px)" }}
          aria-hidden="true"
        >
          <span className="hero-intro-cursor" />
        </div>
      )}

      {/* Terminal text - left side, naturally scrolling */}
      {!showHero && (
        <div
          className="hero-intro-terminal absolute left-[8%] top-[12%] z-10 flex flex-col justify-end"
          style={{
            fontSize: "clamp(9px, 1.1vw, 13px)",
            maxWidth: "40%",
            height: "70vh",
            maskImage: "linear-gradient(to bottom, transparent 0, #000 12%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 12%)",
          }}
          aria-live="polite"
          aria-label="System initialization terminal"
        >
          {terminalLines.map((line) => (
            <div key={line.id}>{line.text}</div>
          ))}
          {currentTyping && (
            <div>
              {currentTyping}
              {showCursor && <span className="hero-intro-cursor" />}
            </div>
          )}
          {!currentTyping && showCursor && terminalLines.length > 0 && (
            <div>
              <span className="hero-intro-cursor" />
            </div>
          )}

          {showStatus && (
            <div className="mt-3">
              <div>STATUS</div>
              <div className="mt-1">
                {statusBar}
                <span className="ml-2">{statusPercent}%</span>
              </div>
            </div>
          )}

          {showEnforcementActive && (
            <div className="mt-3" style={{ color: "#9BEF74", textShadow: "0 0 6px rgba(155,239,116,0.4)" }}>
              ENFORCEMENT ACTIVE
            </div>
          )}

          {showRegulation && (
            <div className="mt-1" style={{ color: "#FFC857", textShadow: "0 0 4px rgba(255,200,87,0.2)" }}>
              AI SYSTEMS NOW SUBJECT TO REGULATION
            </div>
          )}
        </div>
      )}

      {/* Hero reveal — assembled line-by-line (easeOutExpo) */}
      {showHero && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
        >
          <h1
            className="hero-heading text-center"
            style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
          >
            {heroLines.map((line, i) => (
              <span
                key={line}
                className="block"
                style={{
                  animation: `intro-headline-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s both`,
                  color: i === 2 ? "#9BEF74" : "#F4F4F4",
                  textShadow: i === 2 ? "0 0 8px rgba(155,239,116,0.2)" : "none",
                }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
      )}

      <div className="hero-intro-scanlines" />
      <div className="hero-intro-vignette" />

      <button className="hero-intro-skip" onClick={onSkip} aria-label="Skip intro">
        Skip Intro [ESC]
      </button>
    </div>
  );
}
