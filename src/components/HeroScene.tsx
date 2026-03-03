"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Vertex Shader ─── */
const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uBurst;
  uniform vec3 uBurstOrigin;

  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  varying float vAlpha;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec3 pos = position;
    float t = uTime;

    // Layered organic drift — slow, atmospheric
    float px = aPhase * 6.2831;
    float sp = 0.08 + aSpeed * 0.12;
    pos.x += sin(t * sp + px) * 0.4;
    pos.y += cos(t * sp * 0.6 + px * 1.3) * 0.3;
    pos.z += sin(t * sp * 0.3 + px * 0.7) * 0.15;

    // Gentle mouse attraction
    vec3 toMouse = uMouse - pos;
    float dist = length(toMouse);
    float attraction = smoothstep(uMouseRadius, 0.0, dist);
    pos += normalize(toMouse + 0.0001) * attraction * 1.2;

    // Click burst scatter
    if (uBurst > 0.01) {
      vec3 away = pos - uBurstOrigin;
      float burstDist = length(away);
      float force = uBurst * smoothstep(4.0, 0.0, burstDist);
      pos += normalize(away + 0.0001) * force * 2.5;
    }

    vGlow = attraction;
    vDepth = clamp((pos.z + 3.0) / 6.0, 0.0, 1.0);
    vAlpha = (0.06 + aScale * 0.22) * (0.4 + vDepth * 0.6) + attraction * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Depth-aware particle sizing
    float baseSize = 0.8 + aScale * 2.8;
    float cursorBoost = 1.0 + attraction * 2.0;
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

    // Ultra-soft radial falloff
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha; // Quadratic for softer edges

    // Three-tone color blend: dim -> mid -> bright near cursor
    vec3 color = mix(uColorDim, uColorMid, vDepth);
    color = mix(color, uColorBright, vGlow);

    // Subtle warm core
    float core = exp(-d * 8.0);
    color += core * vec3(1.0, 0.95, 0.8) * (0.15 + vGlow * 0.3);

    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;

/* ─── Atmospheric Dust Particles ─── */
function AtmosphericDust({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geoRef = useRef<THREE.BufferGeometry>(null!);
  const mouse = useRef(new THREE.Vector3(50, 50, 0));
  const burst = useRef({ strength: 0, origin: new THREE.Vector3() });
  const timeAccum = useRef(0);

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Asymmetric distribution — denser right, sparser left
      const bias = Math.random();
      const x = bias > 0.35
        ? (Math.random() * 12 + 1)
        : -(Math.random() * 8 + 1);
      pos[i * 3]     = x + (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;

      scale[i] = Math.pow(Math.random(), 1.5); // More small particles
      phase[i] = Math.random();
      speed[i] = Math.random();
    }
    return { pos, scale, phase, speed };
  }, [count]);

  useEffect(() => {
    const geo = geoRef.current;
    if (!geo) return;
    geo.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(data.scale, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(data.phase, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(data.speed, 1));
  }, [data]);

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uMouse:       { value: new THREE.Vector3(50, 50, 0) },
      uMouseRadius: { value: 3.5 },
      uBurst:       { value: 0 },
      uBurstOrigin: { value: new THREE.Vector3() },
      uColorDim:    { value: new THREE.Color("#8a7342") },
      uColorMid:    { value: new THREE.Color("#c4a455") },
      uColorBright: { value: new THREE.Color("#f5e6c8") },
    }),
    []
  );

  useFrame((_state, delta) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial;
    if (!mat) return;

    // Accumulate time from delta instead of deprecated Clock
    timeAccum.current += delta;
    mat.uniforms.uTime.value = timeAccum.current;
    mat.uniforms.uMouse.value.copy(mouse.current);

    if (burst.current.strength > 0) {
      burst.current.strength = Math.max(0, burst.current.strength - delta * 1.8);
      mat.uniforms.uBurst.value = burst.current.strength;
      mat.uniforms.uBurstOrigin.value.copy(burst.current.origin);
    }
  });

  const onMove = useCallback((e: THREE.Event & { point: THREE.Vector3 }) => {
    mouse.current.copy(e.point);
  }, []);

  const onClick = useCallback((e: THREE.Event & { point: THREE.Vector3 }) => {
    burst.current.strength = 1.0;
    burst.current.origin.copy(e.point);
  }, []);

  return (
    <group>
      <mesh onPointerMove={onMove} onClick={onClick}>
        <planeGeometry args={[40, 25]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry ref={geoRef} />
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

/* ─── Camera Parallax ─── */
function CameraRig() {
  const posX = useRef(0);
  const posY = useRef(0);

  useFrame((state) => {
    const cam = state.camera;
    posX.current += (state.pointer.x * 0.4 - posX.current) * 0.015;
    posY.current += (state.pointer.y * 0.25 - posY.current) * 0.015;
    cam.position.x = posX.current;
    cam.position.y = posY.current;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Export ─── */
export default function HeroScene() {
  const onCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    state.gl.setClearColor(0x000000, 0);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 42 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        onCreated={onCreated}
        style={{ pointerEvents: "auto" }}
      >
        <AtmosphericDust />
        <CameraRig />
      </Canvas>
    </div>
  );
}
