"use client";

import { useRef, useEffect, useMemo, useState } from "react";
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
  ripplesRef: React.RefObject<Ripple[]>;
  shockwaveRef: React.RefObject<{ t: number; strength: number } | null>;
  intensityRef: React.RefObject<number>;
}

interface Ripple {
  x: number;
  z: number;
  spawn: number;
  strength: number;
}

const MAX_RIPPLES = 6;

const gridVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHalf;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform vec4 uRippleData[${MAX_RIPPLES}]; // xy = center.xz, z = age, w = strength
  uniform vec4 uShock;                      // xy = center.xz, z = age, w = strength
  varying vec3 vColor;
  varying float vRipple;

  float waveY(vec2 p) {
    float y = 0.0;
    y += sin(p.x * 0.30 + uTime * 0.6) * 0.15;
    y += sin(p.x * 0.15 + uTime * 0.30) * 0.10;
    y += sin(p.y * 0.22 + uTime * 0.45) * 0.12;
    y += sin((p.x + p.y) * 0.18 - uTime * 0.35) * 0.08;
    return y * (0.5 + uIntensity * 0.5);
  }

  float ringGlow(vec2 p, vec4 r) {
    if (r.w <= 0.0) return 0.0;
    float radius = r.z * 9.0;
    float d = abs(distance(p, r.xy) - radius);
    float ring = pow(max(0.0, 1.0 - d / 1.6), 2.0);
    float fade = max(0.0, 1.0 - r.z / 1.6);
    return ring * fade * r.w;
  }

  void main() {
    vec3 pos = position;
    vec2 p = vec2(pos.x, pos.z);
    pos.y += waveY(p);

    float breathe = 0.07 + sin(uTime * 0.7) * 0.03;
    vec3 base = vec3(0.06 + breathe * 0.15, 0.08 + breathe * 0.25, 0.10 + breathe * 0.20);

    float md = distance(p, uMouse);
    float maxDist = uHalf * 0.35;
    float glow = md < maxDist ? pow(max(0.0, 1.0 - md / maxDist), 1.5) : 0.0;
    glow *= (0.4 + uIntensity * 0.6);

    float pulseGlow = 0.0;
    for (int p2 = 0; p2 < 2; p2++) {
      float radius = mod(uTime * 0.4 + float(p2) * (uHalf / 2.0), uHalf);
      float d = abs(length(p) - radius);
      pulseGlow = max(pulseGlow, pow(max(0.0, 1.0 - d / 8.0), 2.0));
    }
    pulseGlow *= uIntensity;

    float sweep = pow(max(0.0, 1.0 - abs(pos.x - sin(uTime * 0.25) * uHalf)), 6.0);
    sweep *= 0.6;

    float rip = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      rip = max(rip, ringGlow(p, uRippleData[i]));
    }
    rip = max(rip, ringGlow(p, uShock));

    vRipple = rip;
    vColor = base + pulseGlow * vec3(0.15, 0.35, 0.25)
           + glow * vec3(0.0, 0.5, 0.8)
           + sweep * vec3(0.1, 0.6, 0.7)
           + rip * vec3(0.2, 0.9, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const gridFragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vRipple;

  void main() {
    gl_FragColor = vec4(vColor, 0.8 + vRipple * 0.2);
  }
`;

function CustomGrid({
  size,
  divisions,
  position: gridPos,
  mouseRef,
  active = false,
  ripplesRef,
  shockwaveRef,
  intensityRef,
}: CustomGridProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const activeLerpRef = useRef(0.4);

  const geometry = useMemo(() => {
    const half = size / 2;
    const step = size / divisions;
    const posArr: number[] = [];

    for (let i = 0; i <= divisions; i++) {
      const x = -half + i * step;
      posArr.push(x, 0, -half, x, 0, half);
    }
    for (let j = 0; j <= divisions; j++) {
      const z = -half + j * step;
      posArr.push(-half, 0, z, half, 0, z);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArr), 3));
    return geom;
  }, [size, divisions]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHalf: { value: size / 2 },
      uIntensity: { value: 0.4 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRippleData: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uShock: { value: new THREE.Vector4(0, 0, 0, 0) },
    }),
    [size]
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    const time = state.clock.getElapsedTime();
    const mouse = mouseRef.current || { x: 0, y: 0 };
    const half = size / 2;

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);
    const targetIntensity = intensityRef.current ?? activeLerpRef.current;
    mat.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      mat.uniforms.uIntensity.value,
      targetIntensity,
      0.05
    );
    mat.uniforms.uTime.value = time;
    mat.uniforms.uMouse.value.set(mouse.x * half, -mouse.y * half);

    const ripples = ripplesRef.current;
    if (ripples) {
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripples[i];
        const v = mat.uniforms.uRippleData.value[i] as THREE.Vector4;
        if (r) {
          v.set(r.x, r.z, time - r.spawn, r.strength);
        } else {
          v.set(0, 0, 0, 0);
        }
      }
    }

    const shock = shockwaveRef.current;
    if (shock) {
      mat.uniforms.uShock.value.set(0, 0, time - shock.t, shock.strength);
    }
  });

  return (
    <group position={gridPos}>
      <lineSegments geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={gridVertexShader}
          fragmentShader={gridFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
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
        { offset: 0.05, speed: 0.20, size: 0.4 },
        { offset: 0.4, speed: 0.17, size: 0.35 },
        { offset: 0.75, speed: 0.22, size: 0.3 },
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
        { offset: 0.15, speed: 0.24, size: 0.35 },
        { offset: 0.6, speed: 0.21, size: 0.3 },
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
        { offset: 0.0, speed: 0.19, size: 0.3 },
        { offset: 0.45, speed: 0.22, size: 0.35 },
      ],
    },
  ], []);

  const lineMatRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const activeLerpRef = useRef(0.4);

  const builtPaths = useMemo(
    () =>
      paths.map((p) => {
        const curve = new THREE.CatmullRomCurve3(p.points);
        const lineGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
        const lineMat = new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0 });
        return { ...p, curve, lineGeom, lineMat };
      }),
    [paths]
  );

  useFrame(() => {
    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);
    lineMatRefs.current.forEach((mat) => {
      if (mat) mat.opacity = activeLerpRef.current * 0.12;
    });
  });

  return (
    <group>
      {builtPaths.map((p, pathIdx) => (
        <group key={p.id}>
          <primitive
            object={new THREE.Line(p.lineGeom, p.lineMat)}
            ref={(el: THREE.Line | null) => {
              if (el) lineMatRefs.current[pathIdx] = el.material as THREE.LineBasicMaterial;
            }}
          />
          {p.packets.map((pkt, idx) => (
            <DataPacket
              key={idx}
              curve={p.curve}
              color={p.color}
              speed={pkt.speed}
              offset={pkt.offset}
              size={pkt.size}
              active={active}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

interface SceneContentProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  active?: boolean;
  ripplesRef: React.RefObject<Ripple[]>;
  shockwaveRef: React.RefObject<{ t: number; strength: number } | null>;
  intensityRef: React.RefObject<number>;
  reducedMotion: boolean;
}

function SceneContent({
  mouseRef,
  active = false,
  ripplesRef,
  shockwaveRef,
  intensityRef,
  reducedMotion,
}: SceneContentProps) {
  const { camera } = useThree();

  const sceneGroupRef = useRef<THREE.Group>(null);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0.4, 0), []);
  const activeLerpRef = useRef(0.4);
  const orbitPhase = useRef(1.7);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = mouseRef.current || { x: 0, y: 0 };

    activeLerpRef.current = THREE.MathUtils.lerp(activeLerpRef.current, active ? 1.0 : 0.4, 0.04);

    const ease = reducedMotion ? 0.0 : 1.0;

    // cinematic slow orbit + breathing dolly
    orbitPhase.current += 0.0008 * ease;
    const orbit = reducedMotion ? 0 : Math.sin(orbitPhase.current) * 0.6;
    const targetCamX = 14.5 + orbit + Math.sin(time * 0.05) * 0.25 * ease;
    const targetCamY = 11.5 + Math.sin(time * 0.08) * 0.4 * ease;
    const targetCamZ = 14.5 + Math.cos(orbitPhase.current) * 0.6 + Math.cos(time * 0.04) * 0.25 * ease;

    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.06),
      THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.06),
      THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.06)
    );

    camera.lookAt(targetLookAt);

    if (sceneGroupRef.current) {
      const px = reducedMotion ? 0 : mouse.x;
      const py = reducedMotion ? 0 : mouse.y;
      sceneGroupRef.current.position.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.position.x,
        px * -0.1,
        0.06
      );
      sceneGroupRef.current.position.z = THREE.MathUtils.lerp(
        sceneGroupRef.current.position.z,
        py * -0.06,
        0.06
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        py * -0.015,
        0.04
      );
      sceneGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.z,
        px * 0.015,
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
          ripplesRef={ripplesRef}
          shockwaveRef={shockwaveRef}
          intensityRef={intensityRef}
        />

        <InteractiveNodes mouseRef={mouseRef} active={active} />
      </group>
    </>
  );
}

export function CyberCityCanvas({ active = false }: { active?: boolean }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseOverRef = useRef(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prefersReducedMotion = useRef(false);
  const isTouchDevice = useRef(false);
  const ripplesRef = useRef<Ripple[]>([]);
  const shockwaveRef = useRef<{ t: number; strength: number } | null>(null);
  const intensityRef = useRef(0.4);
  const lastMoveRef = useRef(0);
  const lastRippleRef = useRef(0);
  const prevActiveRef = useRef(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    prefersReducedMotion.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setReducedMotion(prefersReducedMotion.current);

    // scroll-reactive intensity: fade grid as hero scrolls away
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const heroH = document.getElementById("hero")?.offsetHeight ?? vh;
      const progress = Math.min(1, window.scrollY / (heroH * 0.8));
      intensityRef.current = (active ? 1.0 : 0.4) * (1 - progress * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  // fire a shockwave ripple when `active` flips true
  useEffect(() => {
    if (active && !prevActiveRef.current) {
      shockwaveRef.current = { t: performance.now() / 1000, strength: 1.0 };
    }
    prevActiveRef.current = active;
  }, [active]);

  // Pause the entire render loop when the hero canvas leaves the viewport so we
  // don't burn GPU/CPU animating an off-screen WebGL scene.
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current || isTouchDevice.current) return;

    const spawnRipple = (x: number, z: number, strength: number) => {
      const now = performance.now() / 1000;
      const ripples = ripplesRef.current;
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, z, spawn: now, strength });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
      isMouseOverRef.current = true;

      const now = performance.now();
      const dt = now - lastMoveRef.current;
      if (dt > 60 && now - lastRippleRef.current > 140) {
        const half = 16;
        spawnRipple(nx * half, -ny * half, 0.7);
        lastRippleRef.current = now;
      }
      lastMoveRef.current = now;
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
        frameloop={!inView ? "never" : reducedMotion ? "demand" : "always"}
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

        <SceneContent
          mouseRef={mouseRef}
          active={active}
          ripplesRef={ripplesRef}
          shockwaveRef={shockwaveRef}
          intensityRef={intensityRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
