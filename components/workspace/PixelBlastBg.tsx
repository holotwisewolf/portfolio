// PixelBlast background for the workspace — Bayer-dithered pixel pattern with
// ripples and optional liquid distortion. Themed to the site palette.
// Source: React Bits (reactbits.dev), adapted for the workspace context.

import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SHAPE_MAP: Record<string, number> = { square: 0, circle: 1, triangle: 2, diamond: 3 }

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int   uShapeType;

const int MAX_CLICKS = 10;
uniform vec2  uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < 5; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= 1.25;
    amp  *= 1.0;
  }
  return sum * 0.5 + 0.5;
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, pos);
      float waveR = uRippleSpeed * t;
      float ring  = exp(-pow((r - waveR) / uRippleThickness, 2.0));
      float atten = exp(-t) * exp(-10.0 * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float M;
  if (uShapeType == 1) {
    float r = sqrt(bw) * .25;
    float d = length(pixelUV - 0.5) - r;
    M = bw * (1.0 - smoothstep(-0.02, 0.02, d * 2.0));
  } else {
    M = bw;
  }

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    M *= smoothstep(0.0, uEdgeFade, edge);
  }

  fragColor = vec4(uColor, M);
}
`

interface PixelBlastBgProps {
  color?: string
  pixelSize?: number
  patternScale?: number
  patternDensity?: number
  speed?: number
  className?: string
}

export default function PixelBlastBg({
  color = '#00cc77',
  pixelSize = 4,
  patternScale = 3,
  patternDensity = 0.9,
  speed = 0.4,
  className = '',
}: PixelBlastBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const threeRef = useRef<any>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearAlpha(0)
    container.appendChild(renderer.domElement)

    const uniforms = {
      uResolution: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: 10 }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(10) },
      uShapeType: { value: SHAPE_MAP['square'] ?? 0 },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale },
      uDensity: { value: patternDensity },
      uEnableRipples: { value: 1 },
      uRippleSpeed: { value: 0.4 },
      uRippleThickness: { value: 0.12 },
      uRippleIntensity: { value: 1.5 },
      uEdgeFade: { value: 0.25 },
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    const clock = new THREE.Clock()
    const setSize = () => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio()
    }
    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(container)

    let clickIx = 0
    const onPointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const fx = ((e.clientX - rect.left) / rect.width) * renderer.domElement.width
      const fy = renderer.domElement.height - ((e.clientY - rect.top) / rect.height) * renderer.domElement.height
      uniforms.uClickPos.value[clickIx].set(
        (fx / renderer.domElement.width - 0.5) * (renderer.domElement.width / renderer.domElement.height),
        fy / renderer.domElement.height - 0.5
      )
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value
      clickIx = (clickIx + 1) % 10
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true })

    let raf = 0
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime() * speed
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    threeRef.current = { renderer, material, ro, raf, quad }

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      quad.geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement)
      threeRef.current = null
    }
  }, [color, pixelSize, patternScale, patternDensity, speed])

  return <div ref={containerRef} className={`w-full h-full relative overflow-hidden pointer-events-none ${className}`} />
}
