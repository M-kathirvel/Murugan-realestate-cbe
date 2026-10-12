import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 7
    const positions = new Float32Array(900)
    for (let index = 0; index < 300; index += 1) {
      const radius = 1.3 + Math.random() * 2.5
      const angle = Math.random() * Math.PI * 2
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = (Math.random() - 0.5) * 4.4
      positions[index * 3 + 2] = (Math.random() - 0.5) * 2.4
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ color: 0xe5bd80, size: 0.022, transparent: true, opacity: 0.7 })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xe5bd80, transparent: true, opacity: 0.17, wireframe: true })
    const ring = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 1), ringMaterial)
    ring.position.set(1.05, 0.1, -0.45)
    scene.add(ring)
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    let frame = 0
    let animationFrame
    const animate = () => {
      frame += 0.0025
      particles.rotation.y = frame * 0.34
      particles.rotation.x = Math.sin(frame * 0.65) * 0.06
      ring.rotation.x += 0.0009
      ring.rotation.y += 0.0015
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      ring.geometry.dispose()
      ringMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas className="hero-scene" ref={canvasRef} aria-hidden="true" />
}