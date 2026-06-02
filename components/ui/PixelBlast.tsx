'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function PixelBlast() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })

    renderer.setSize(canvas.parentElement?.clientWidth || window.innerWidth, canvas.parentElement?.clientHeight || window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Particle configuration
    const particleCount = 3000
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    // Initialize particles with clustering bias
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Create clusters using Perlin-like noise simulation
      const clusterCount = 5
      const clusterIndex = Math.floor(Math.random() * clusterCount)
      const clusterOffset = (clusterIndex / clusterCount) * 20 - 10

      // Base position with cluster bias
      positions[i3] = (Math.random() - 0.5) * 30 + clusterOffset
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 10

      // Random slow velocity
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Create material with custom color
    const material = new THREE.PointsMaterial({
      color: 0x00ff9d,
      size: 1.5,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    // Create points mesh
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Camera position
    camera.position.z = 15

    // Animation loop
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Update particle positions
      const posAttribute = geometry.attributes.position
      const positions = posAttribute.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // Wrap around edges
        if (positions[i3] < -15) positions[i3] = 15
        if (positions[i3] > 15) positions[i3] = -15
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10
        if (positions[i3 + 2] < -15) positions[i3 + 2] = 5
        if (positions[i3 + 2] > 5) positions[i3 + 2] = -15
      }

      posAttribute.needsUpdate = true

      // Slow rotation
      points.rotation.y += 0.0003
      points.rotation.x += 0.0001

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const width = canvas.parentElement?.clientWidth || window.innerWidth
      const height = canvas.parentElement?.clientHeight || window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
