import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uRes;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0*fract(p*C.www)-1.0;
    vec3 h = abs(x)-0.5;
    vec3 ox = floor(x+0.5);
    vec3 a0 = x-ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x*x0.x + h.x*x0.y;
    g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p  = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);
    vec2 m  = (uMouse - 0.5) * vec2(uRes.x/uRes.y, 1.0);

    float t = uTime * 0.05;
    vec2 q = vec2(snoise(p + t), snoise(p + 3.1 + t));
    vec2 r = vec2(snoise(p + 1.7 * q + 0.02 * m + t), snoise(p + 0.8 * q - t));
    float n = snoise(p + 2.0 * r);

    vec3 base   = vec3(0.019, 0.019, 0.027);
    vec3 violet = vec3(0.35, 0.08, 0.60);
    vec3 cyan   = vec3(0.0, 0.55, 0.70);
    vec3 col = base + 0.18 * mix(violet, cyan, 0.5 + 0.5 * n);
    col += 0.06 * r.y;
    col += 0.04 * snoise(p * 3.0 + t);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes:   { value: new THREE.Vector2(1, 1) },
  }), []);

  useFrame(({ clock, size, mouse }) => {
    uniforms.uTime.value  = clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uMouse.value.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

const gradientFallback = {
  position: 'fixed', inset: 0, zIndex: -1,
  background: 'radial-gradient(ellipse at 30% 20%, rgba(50,10,90,0.35), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,100,120,0.3), transparent 60%), #050507',
};

export default function Background() {
  const reduced = useReducedMotion();
  const isNarrow = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;

  if (reduced || isNarrow) {
    return <div style={gradientFallback} aria-hidden="true" />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      <Suspense fallback={<div style={gradientFallback} />}>
        <Canvas
          orthographic
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ShaderPlane />
        </Canvas>
      </Suspense>
    </div>
  );
}
