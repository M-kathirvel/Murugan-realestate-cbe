import { lazy, Suspense } from 'react'

const ThreeScene = lazy(() => import('./ThreeScene.jsx'))

export default function HeroScene() {
  return <Suspense fallback={null}><ThreeScene /></Suspense>
}