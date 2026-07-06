"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

function createPRNG(seed: number) {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface CustomGridProps {
  size: number;
  divisions: number;
  position: [number, number, number];
  mouseRef: React.RefObject<{ x: number; y: number }>;
  active?: boolean;
  baseOpacity?: number;
  breathePhase?: number;
}

function CustomGrid({
  size,
  divisions,
  position: gridPos,
  mouseRef,
  active = false,
  baseOpacity = 0.1,
  breathePhase = 0,
}: CustomGridProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const activeLerpRef = useRef(0.4);

  const { geometry, lineMeta } = useMemo(() => {
    const half = size / 2;
    const step = size / divisions;
    const lines: { type: "h" | "v"; anchor: number }[] = [];
    const posArr: number[] = [];

    for (let i = 0; i <= divisions; i++) {
      const x = -half + i * step;
      posArr.push(x, 0, -half, x, 0, half);
      lines.push({ type: "h", anchor: x });
    }
    for (let j = 0; j <= divisions; j++) {
      const z = -half + j * step;
      posArr.push(-half, 0, z, half, 0, z);
      lines.push({ type: "v", anchor: z });
    }

    const positionsFloat = new Float32Array(posArr);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positionsFloat, 3));

    const colorArr = new Float32Array(posArr.length);
    geom.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));

    return { geometry: geom, lineMeta: lines };
  }, [size, divisions]);

  const maxDist = size * 0.3;
  const half = size / 2;

  useFrame((state) => {
    if (!lineRef.current) return;
    const geo = lineRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colorAttr = geo.attributes.color as THREE.BufferAttribute;
    const colors = colorAttr.array as Float32Array;
    const positions = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();
    const mouse = mouseRef.current || { x: 0, y: 0 };

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);
    const activeLerp = activeLerpRef.current;

    const mouse3Dx = mouse.x * half;
    const mouse3Dz = -mouse.y * half;

    const breathe = baseOpacity + Math.sin(time * 0.7 + breathePhase) * 0.03;

    const pulseSpeed = 0.4;
    const pulseWavelength = 8.0;
    const pulseCount = 2;

    for (let i = 0; i < lineMeta.length; i++) {
      const meta = lineMeta[i];
      let dist: number;

      if (meta.type === "h") {
        dist = Math.abs(mouse3Dx - meta.anchor);
      } else {
        dist = Math.abs(mouse3Dz - meta.anchor);
      }

      let glow = 0;
      if (dist < maxDist) {
        glow = Math.max(0, 1.0 - dist / maxDist);
      }
      glow = glow * glow * 0.7 + glow * 0.3;

      const anchorDistFromCenter = Math.abs(meta.anchor);
      let pulseGlow = 0;
      for (let p = 0; p < pulseCount; p++) {
        const pulseRadius = ((time * pulseSpeed + p * (half / pulseCount)) % half);
        const pulseDelta = Math.abs(anchorDistFromCenter - pulseRadius);
        const pulseEnvelope = Math.max(0, 1.0 - pulseDelta / pulseWavelength);
        pulseGlow = Math.max(pulseGlow, pulseEnvelope * pulseEnvelope);
      }

      const baseR = 0.06 + breathe * 0.15 + pulseGlow * activeLerp * 0.15;
      const baseG = 0.08 + breathe * 0.25 + pulseGlow * activeLerp * 0.35;
      const baseB = 0.10 + breathe * 0.2 + pulseGlow * activeLerp * 0.25;

      const glowR = 0.0 + glow * activeLerp * 0.6;
      const glowG = 0.5 + glow * activeLerp * 0.8;
      const glowB = 0.8 + glow * activeLerp * 0.4;

      const idx = i * 6;
      colors[idx] = baseR + glowR;
      colors[idx + 1] = baseG + glowG;
      colors[idx + 2] = baseB + glowB;
      colors[idx + 3] = baseR + glowR;
      colors[idx + 4] = baseG + glowG;
      colors[idx + 5] = baseB + glowB;

      const v1idx = i * 6;
      const v2idx = i * 6 + 3;
      if (meta.type === "h") {
        const x = meta.anchor;
        const waveY = Math.sin(x * 0.3 + time * 0.6) * 0.15 + Math.sin(x * 0.15 + time * 0.3) * 0.1;
        positions[v1idx + 1] = waveY;
        positions[v2idx + 1] = waveY;
      } else {
        const z = meta.anchor;
        const waveY = Math.sin(z * 0.3 + time * 0.6) * 0.15 + Math.sin(z * 0.15 + time * 0.3) * 0.1;
        positions[v1idx + 1] = waveY;
        positions[v2idx + 1] = waveY;
      }
    }
    colorAttr.needsUpdate = true;
    posAttr.needsUpdate = true;
  });

  return (
    <group position={gridPos}>
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.8} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

interface InteractiveNodesProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  active?: boolean;
}

function InteractiveNodes({ mouseRef, active = false }: InteractiveNodesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const gridSize = 10;
  const count = gridSize * gridSize;

  const [positions, initialColors, sparklePhases] = useMemo(() => {
    const prng = createPRNG(42);
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        const x = (i - (gridSize - 1) / 2) * 2.2;
        const z = (j - (gridSize - 1) / 2) * 2.2;
        posArr[idx * 3] = x;
        posArr[idx * 3 + 1] = 0.05;
        posArr[idx * 3 + 2] = z;
        colArr[idx * 3] = 0.1;
        colArr[idx * 3 + 1] = 0.13;
        colArr[idx * 3 + 2] = 0.17;
        phases[idx] = prng() * Math.PI * 2;
      }
    }
    return [posArr, colArr, phases];
  }, [count]);

  const projectedMouse = useMemo(() => new THREE.Vector3(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const activeColor = useMemo(() => new THREE.Color("#00ffcc"), []);
  const baseColor = useMemo(() => new THREE.Color("#161a22"), []);
  const sparkleColor = useMemo(() => new THREE.Color("#00e6b8"), []);
  const currentColor = useMemo(() => new THREE.Color(), []);

  const activeLerpRef = useRef(0.4);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const colors = geo.attributes.color;
    const time = state.clock.getElapsedTime();
    const mouse = mouseRef.current || { x: 0, y: 0 };

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);
    const activeLerp = activeLerpRef.current;

    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      pointsRef.current.material.opacity = 0.3 + activeLerp * 0.5;
    }

    projectedMouse.set(mouse.x * 12.0, 0.05, -mouse.y * 12.0);

    for (let i = 0; i < count; i++) {
      tempPos.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      const dist = tempPos.distanceTo(projectedMouse);

      let factor = 0;
      if (dist < 4.0) {
        factor = Math.max(0, 1.0 - dist / 4.0);
      }

      const phase = sparklePhases[i];
      const sparkle = Math.pow(Math.max(0, Math.sin(time * 2.5 + phase)), 8) * 0.6;

      currentColor.copy(baseColor).lerp(activeColor, factor * activeLerp).lerp(sparkleColor, sparkle * activeLerp);

      colors.setXYZ(i, currentColor.r, currentColor.g, currentColor.b);
    }
    colors.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[initialColors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

function AmbientDust({ count = 25 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const prng = createPRNG(999);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (prng() - 0.5) * 24;
      arr[i * 3 + 1] = prng() * 8;
      arr[i * 3 + 2] = (prng() - 0.5) * 24;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      y += 0.003;
      if (y > 8) y = 0;
      pos.setY(i, y);
      let x = pos.getX(i);
      x += Math.sin(time * 0.45 + i) * 0.0012;
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#00c2a8"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface DataPacketProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
  offset: number;
  size: number;
  active?: boolean;
}

function DataPacket({ curve, color, speed, offset, size, active = false }: DataPacketProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeLerpRef = useRef(0.4);

  const alignedGeom = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.016, 0.016, size, 8);
    g.rotateX(Math.PI / 2);
    return g;
  }, [size]);

  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);

    const packetFade = THREE.MathUtils.clamp((time - 0.5) / 0.3, 0, 1);

    const t = (state.clock.elapsedTime * speed + offset) % 1.0;
    const pos = curve.getPointAt(t);
    meshRef.current.position.copy(pos);

    const tangent = curve.getTangentAt(t);
    targetPos.copy(pos).add(tangent);
    meshRef.current.lookAt(targetPos);

    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = activeLerpRef.current * packetFade * 0.85;
    }
  });

  return (
    <mesh ref={meshRef} geometry={alignedGeom}>
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

function LeadingLinesNetwork({ active = false }: { active?: boolean }) {
  const paths = useMemo(() => [
    {
      id: "center-ns",
      color: "#008080",
      points: [
        new THREE.Vector3(0, 0.04, -5.5),
        new THREE.Vector3(0, 0.04, 0),
        new THREE.Vector3(0, 0.04, 5.0),
      ],
      packets: [
        { offset: 0.05, speed: 0.14, size: 0.4 },
        { offset: 0.4, speed: 0.12, size: 0.35 },
        { offset: 0.75, speed: 0.16, size: 0.3 },
      ],
    },
    {
      id: "east-west",
      color: "#006666",
      points: [
        new THREE.Vector3(-6, 0.04, -1.5),
        new THREE.Vector3(-2, 0.04, -0.5),
        new THREE.Vector3(2, 0.04, 0.5),
        new THREE.Vector3(6, 0.04, 1.5),
      ],
      packets: [
        { offset: 0.15, speed: 0.18, size: 0.35 },
        { offset: 0.6, speed: 0.15, size: 0.3 },
      ],
    },
    {
      id: "diagonal",
      color: "#005555",
      points: [
        new THREE.Vector3(-5, 0.04, -4),
        new THREE.Vector3(-1.5, 0.04, -1),
        new THREE.Vector3(1.5, 0.04, 1),
        new THREE.Vector3(5, 0.04, 4),
      ],
      packets: [
        { offset: 0.0, speed: 0.13, size: 0.3 },
        { offset: 0.45, speed: 0.16, size: 0.35 },
      ],
    },
  ], []);

  const lineMatRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const activeLerpRef = useRef(0.4);

  useFrame(() => {
    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);
    lineMatRefs.current.forEach((mat) => {
      if (mat) mat.opacity = activeLerpRef.current * 0.12;
    });
  });

  return (
    <group>
      {paths.map((p, pathIdx) => {
        const curve = new THREE.CatmullRomCurve3(p.points);
        const points = curve.getPoints(40);
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <group key={p.id}>
            <primitive object={new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0 }))} ref={(el: THREE.Line | null) => { if (el) lineMatRefs.current[pathIdx] = el.material as THREE.LineBasicMaterial; }} />
            {p.packets.map((pkt, idx) => (
              <DataPacket
                key={idx}
                curve={curve}
                color={p.color}
                speed={pkt.speed}
                offset={pkt.offset}
                size={pkt.size}
                active={active}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
}

interface SceneContentProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  active?: boolean;
}

function SceneContent({ mouseRef, active = false }: SceneContentProps) {
  const { camera } = useThree();

  const sceneGroupRef = useRef<THREE.Group>(null);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0.4, 0), []);
  const activeLerpRef = useRef(0.4);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = mouseRef.current || { x: 0, y: 0 };

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);

    const targetCamX = 14.5 + Math.sin(time * 0.05) * 0.25;
    const targetCamY = 11.5;
    const targetCamZ = 14.5 + Math.cos(time * 0.04) * 0.25;

    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.06),
      THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.06),
      THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.06)
    );

    camera.lookAt(targetLookAt);

    if (sceneGroupRef.current) {
      sceneGroupRef.current.position.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.position.x,
        mouse.x * -0.1,
        0.06
      );
      sceneGroupRef.current.position.z = THREE.MathUtils.lerp(
        sceneGroupRef.current.position.z,
        mouse.y * -0.06,
        0.06
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        mouse.y * -0.015,
        0.04
      );
      sceneGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.z,
        mouse.x * 0.015,
        0.04
      );
    }
  });

  return (
    <>
      <ambientLight color="#06090e" intensity={0.25} />
      <directionalLight position={[-15, 10, -15]} color="#00c2a8" intensity={1.6} />
      <pointLight position={[6.0, 2.5, -1.0]} color="#00ffcc" intensity={1.5} distance={7} decay={2} />

      <LeadingLinesNetwork active={active} />

      <AmbientDust count={25} />

      <group ref={sceneGroupRef}>
        <CustomGrid
          size={32}
          divisions={24}
          position={[0, 0.0, 0]}
          mouseRef={mouseRef}
          active={active}
          baseOpacity={0.07}
          breathePhase={1.5}
        />

        <InteractiveNodes mouseRef={mouseRef} active={active} />
      </group>
    </>
  );
}

export function CyberCityCanvas({ active = false }: { active?: boolean }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseOverRef = useRef(true);
  const prefersReducedMotion = useRef(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current || isTouchDevice.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      isMouseOverRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseOverRef.current = false;
    };

    const handleMouseEnter = () => {
      isMouseOverRef.current = true;
    };

    let decayRAF: number | null = null;
    const decayLoop = () => {
      if (!isMouseOverRef.current) {
        const current = mouseRef.current;
        current.x *= 0.96;
        current.y *= 0.96;
        if (Math.abs(current.x) > 0.001 || Math.abs(current.y) > 0.001) {
          decayRAF = requestAnimationFrame(decayLoop);
        } else {
          current.x = 0;
          current.y = 0;
          decayRAF = null;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const visibilityCheck = setInterval(() => {
      if (!isMouseOverRef.current && decayRAF === null) {
        decayRAF = requestAnimationFrame(decayLoop);
      }
    }, 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(visibilityCheck);
      if (decayRAF !== null) cancelAnimationFrame(decayRAF);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 select-none pointer-events-none w-full h-full bg-[var(--pa)] overflow-hidden"
    >
      <Canvas
        dpr={1}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <fogExp2 attach="fog" args={["#11141b", 0.075]} />

        <OrthographicCamera
          makeDefault
          zoom={40}
          left={-16}
          right={16}
          top={12}
          bottom={-12}
          near={0.1}
          far={180}
          position={[14.5, 11.5, 14.5]}
        />

        <SceneContent mouseRef={mouseRef} active={active} />
      </Canvas>
    </div>
  );
}
