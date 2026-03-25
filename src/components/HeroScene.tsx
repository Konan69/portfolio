"use client";

import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";

/* ─── Particle System Config ─── */
const PARTICLE_COUNT = 1500;
const COLORS = {
  dim: "#8a7342",
  mid: "#c4a455",
  bright: "#f5e6c8",
};

/* ─── Vertex Shader ─── */
const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseRadius;

  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  varying float vAlpha;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec3 pos = position;
    float t = uTime;

    // Gentle organic drift
    float px = aPhase * 6.2831;
    float sp = 0.06 + aSpeed * 0.1;
    pos.x += sin(t * sp + px) * 0.35;
    pos.y += cos(t * sp * 0.7 + px * 1.2) * 0.25;
    pos.z += sin(t * sp * 0.4 + px * 0.8) * 0.12;

    // Mouse attraction
    vec3 toMouse = uMouse - pos;
    float dist = length(toMouse);
    float attraction = smoothstep(uMouseRadius, 0.0, dist);
    pos += normalize(toMouse + 0.0001) * attraction * 1.0;

    vGlow = attraction;
    vDepth = clamp((pos.z + 3.0) / 6.0, 0.0, 1.0);
    vAlpha = (0.04 + aScale * 0.18) * (0.5 + vDepth * 0.5) + attraction * 0.25;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    float baseSize = 0.6 + aScale * 2.2;
    float cursorBoost = 1.0 + attraction * 1.8;
    float depthScale = 0.6 + vDepth * 0.4;
    gl_PointSize = baseSize * cursorBoost * depthScale * (100.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

/* ─── Fragment Shader ─── */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorDim;
  uniform vec3 uColorMid;
  uniform vec3 uColorBright;

  varying float vAlpha;
  varying float vGlow;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;

    vec3 color = mix(uColorDim, uColorMid, vDepth);
    color = mix(color, uColorBright, vGlow);

    float core = exp(-d * 8.0);
    color += core * vec3(1.0, 0.95, 0.8) * (0.12 + vGlow * 0.25);

    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;

/* ─── Particles Component ─── */
function Particles() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const targetMouse = useRef(new THREE.Vector3(0, 0, 0));

  const { positions, scales, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Asymmetric distribution - denser right side
      const x = Math.random() > 0.4 ? Math.random() * 10 + 2 : -(Math.random() * 6 + 1);

      positions[i * 3] = x + (Math.random() - 0.5) * 2.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;

      scales[i] = Math.random() ** 1.8;
      phases[i] = Math.random();
      speeds[i] = Math.random();
    }

    return { positions, scales, phases, speeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseRadius: { value: 3.0 },
      uColorDim: { value: new THREE.Color(COLORS.dim) },
      uColorMid: { value: new THREE.Color(COLORS.mid) },
      uColorBright: { value: new THREE.Color(COLORS.bright) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial;
    if (!mat) return;

    // Smooth mouse interpolation
    targetMouse.current.z = 0;
    mouse.current.lerp(targetMouse.current, 0.08);

    mat.uniforms.uTime.value += delta;
    mat.uniforms.uMouse.value.copy(mouse.current);
  });

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    targetMouse.current.set(x * 6, y * 4, 0);
  }, []);

  return (
    <group>
      <mesh
        onPointerMove={handlePointerMove}
        onPointerLeave={() => targetMouse.current.set(0, 0, 0)}
      >
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ─── Camera ─── */
function CameraRig() {
  const ref = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const cam = state.camera;
    const targetX = state.pointer.x * 0.3;
    const targetY = state.pointer.y * 0.2;

    ref.current.x += (targetX - ref.current.x) * 0.03;
    ref.current.y += (targetY - ref.current.y) * 0.03;

    cam.position.x = ref.current.x;
    cam.position.y = ref.current.y;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Export ─── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 2, pointerEvents: "auto" }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ touchAction: "none" }}
      >
        <Particles />
        <CameraRig />
      </Canvas>
    </div>
  );
}
