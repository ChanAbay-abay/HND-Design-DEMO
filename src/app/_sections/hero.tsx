"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ZoomParallax } from "@/components/ui/zoom-parallax"
import { getLenis } from "@/lib/lenis"

function useParallaxLayer(
  mouseX: ReturnType<typeof useSpring>,
  mouseY: ReturnType<typeof useSpring>,
  range: number
) {
  const x = useTransform(mouseX, [-0.5, 0.5], [-range, range])
  const y = useTransform(mouseY, [-0.5, 0.5], [-range * 0.6, range * 0.6])
  return { x, y }
}

/**
 * Foreground layer sits on a container with only ~5% overscan (matching the
 * other layers), so any upward drift past that slack would expose a gap
 * below the image. Cursor-up motion is heavily damped and hard-clamped in
 * px so the house's bottom edge can never rise past what that slack allows
 * — its highest resting point is exactly the screen's own bottom edge.
 */
function useForegroundParallax(
  mouseX: ReturnType<typeof useSpring>,
  mouseY: ReturnType<typeof useSpring>,
  range: number
) {
  const maxUpPx = range * 0.6 * 0.3

  const x = useTransform(mouseX, [-0.5, 0.5], [-range, range])
  const rawY = useTransform(mouseY, [-0.5, 0, 0.5], [-maxUpPx, 0, range * 0.6])
  const y = useTransform(rawY, (v) => Math.max(v, -maxUpPx))
  return { x, y }
}

/**
 * The center slot of the zoom mosaic — the same layered photo scene
 * (background, HND logo, middle ground, foreground) that the whole page
 * zooms into.
 */
const SCENE_LAYER_COUNT = 4

function HeroParallaxScene() {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mouseX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.5 })
  const mouseY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 })

  const background = useParallaxLayer(mouseX, mouseY, 0.8)
  const logo = useParallaxLayer(mouseX, mouseY, 2)
  const middle = useParallaxLayer(mouseX, mouseY, 3.5)
  const foreground = useForegroundParallax(mouseX, mouseY, 5.5)

  // The 4 stacked images take a moment to decode on first paint. Without
  // this, the black fallback background pops straight to the fully loaded
  // photo the instant the last one lands — reads as a flash. Fading the
  // scene in only once every layer has actually loaded turns that hard cut
  // into a smooth reveal.
  const [loadedCount, setLoadedCount] = React.useState(0)
  const ready = loadedCount >= SCENE_LAYER_COUNT
  const handleLayerLoad = React.useCallback(() => {
    setLoadedCount((count) => count + 1)
  }, [])

  React.useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return
    }
    function handleMouseMove(event: MouseEvent) {
      rawX.set(event.clientX / window.innerWidth - 0.5)
      rawY.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [rawX, rawY])

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-black transition-opacity duration-500 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {/* Layer: background */}
      <motion.div
        style={{ x: background.x, y: background.y }}
        className="absolute inset-[-5%]"
      >
        <Image
          src="/images/hero-zoom-complete/hero-zoom-background.jpeg"
          alt=""
          fill
          priority
          className="object-cover object-[70%_68%]"
          sizes="100vw"
          quality={90}
          onLoad={handleLayerLoad}
        />
      </motion.div>

      {/* Layer 1: middle ground */}
      <motion.div
        style={{ x: middle.x, y: middle.y }}
        className="absolute inset-[-5%] translate-x-[3%]"
      >
        <Image
          src="/images/hero-zoom-complete/hero-zoom-middle.png"
          alt=""
          fill
          priority
          className="object-cover object-[70%_68%]"
          sizes="100vw"
          quality={90}
          onLoad={handleLayerLoad}
        />
      </motion.div>

      {/* Layer 2: HND logo mark — sits directly behind the foreground. */}
      <motion.div
        style={{ x: logo.x, y: logo.y }}
        className="pointer-events-none absolute top-[-10%] left-[3%] h-[70%] w-[70%] lg:top-[6%] lg:h-[44%] lg:w-[44%]"
      >
        <Image
          src="/images/HND-logo-transparent.png"
          alt=""
          fill
          priority
          className="object-contain brightness-0"
          sizes="100vw"
          quality={90}
          onLoad={handleLayerLoad}
        />
      </motion.div>

      {/* Layer 3: foreground */}
      <motion.div
        style={{ x: foreground.x, y: foreground.y }}
        className="absolute inset-[-5%]"
      >
        <Image
          src="/images/hero-zoom-complete/hero-zoom-foreground.png"
          alt="HND Design + Build architectural render"
          fill
          priority
          className="object-cover object-[68%_82%]"
          sizes="100vw"
          quality={90}
          onLoad={handleLayerLoad}
        />
      </motion.div>
    </div>
  )
}

export function DemoHero() {
  const handleCenterClick = React.useCallback((targetY: number) => {
    getLenis().scrollTo(targetY, { duration: 1.6 })
  }, [])

  const images = [
    {
      src: "/images/renders/corvin-1.jpg",
      alt: "HND Design + Build project render",
    },
    {
      src: "/images/renders/auburn-1.jpg",
      alt: "HND Design + Build project render",
    },
    {
      src: "/images/renders/marlow-2.jpg",
      alt: "HND Design + Build project render",
    },
    {
      src: "/images/renders/sorrel-3.jpg",
      alt: "HND Design + Build project render",
    },
    {
      src: "/images/renders/halden-2.jpg",
      alt: "HND Design + Build project render",
    },
    {
      src: "/images/renders/vesper-1.jpg",
      alt: "HND Design + Build project render",
    },
  ]

  return (
    <ZoomParallax
      images={images}
      renderCenter={() => <HeroParallaxScene />}
      holdVh={90}
      onCenterClick={handleCenterClick}
    />
  )
}
