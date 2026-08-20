"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { animate } from "framer-motion"

const REVEAL_DURATION = 1.1
const REVEAL_STEPS = 9
const REVEAL_COLS = 8

// Deterministic pseudo-random so the jagged edge is stable between renders.
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Visible-region polygon whose bottom edge advances unevenly with `revealPercent`,
// like a pencil line that overshoots and undershoots before settling — jitter
// peaks mid-stroke and pinches back to a clean, flat edge at 0% and 100%.
function jaggedClip(revealPercent: number, seed: number) {
  const amplitude = 16 * Math.sin((revealPercent / 100) * Math.PI)
  const points = Array.from({ length: REVEAL_COLS }, (_, i) => {
    const x = (i / (REVEAL_COLS - 1)) * 100
    const jitter = (rand(seed + i * 7.13) - 0.5) * 2 * amplitude
    const y = Math.min(100, Math.max(0, revealPercent + jitter))
    return { x, y }
  })
  const right = `100% ${points[REVEAL_COLS - 1].y}%`
  const rest = points
    .slice(0, REVEAL_COLS - 1)
    .reverse()
    .map((p) => `${p.x}% ${p.y}%`)
    .join(", ")
  return `polygon(0% 0%, 100% 0%, ${right}, ${rest})`
}

export function SketchReveal({
  full,
  progress,
  alt,
  index,
  className = "aspect-video w-full",
  objectPosition = "object-center",
}: {
  /** Fully rendered photo, shown when the switcher is set to "Render". */
  full: string
  /** Sketch/progress image shown by default. */
  progress: string
  alt: string
  index: number
  /** Sizing classes for the interactive container — swap for a fixed height/width instead of the default `aspect-video w-full`. */
  className?: string
  /** `object-*` crop position for both images — swap when the container is narrower than the source's aspect ratio. */
  objectPosition?: string
}) {
  const [revealed, setRevealed] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [radius, setRadius] = useState(0)
  const [inView, setInView] = useState(false)
  const seed = index * 97 + 1
  const [clipPath, setClipPath] = useState(() => jaggedClip(0, seed))
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const lastStepRef = useRef(-1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    let observer: IntersectionObserver | null = null
    function setup() {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer?.disconnect()
          }
        },
        { threshold: 0 }
      )
      observer.observe(el as Element)
    }

    // On a hard refresh, the browser restores scroll position asynchronously
    // — creating the observer immediately can catch the pre-restore scroll
    // state (still at 0) and miss that the section is already in view, so
    // the reveal only plays after the user scrolls away and back. Waiting
    // for `load` ensures scroll restoration has settled first.
    if (document.readyState === "complete") {
      setup()
    } else {
      window.addEventListener("load", setup, { once: true })
    }

    return () => {
      window.removeEventListener("load", setup)
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setClipPath("inset(0% 0% 0% 0%)")
      return
    }
    // Quantize into REVEAL_STEPS discrete jumps so the edge visibly advances
    // in uneven bursts, like a pencil laying down strokes, rather than a
    // smooth wipe.
    const controls = animate(0, 100, {
      duration: REVEAL_DURATION,
      delay: index * 0.15,
      ease: [0.61, 0.02, 0.35, 1],
      onUpdate: (p) => {
        const step = Math.round((p / 100) * REVEAL_STEPS)
        if (step !== lastStepRef.current) {
          lastStepRef.current = step
          setClipPath(jaggedClip(p, seed + step * 31))
        }
      },
      onComplete: () => setClipPath("inset(0% 0% 0% 0%)"),
    })
    return () => controls.stop()
  }, [inView, index, seed])

  function handleSwitch(target: boolean) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || animating || revealed === target) return
    // Circle grows/shrinks from the container's center — the diagonal covers
    // the whole container regardless of aspect ratio.
    containerRef.current?.style.setProperty("--x", "50%")
    containerRef.current?.style.setProperty("--y", "50%")
    const maxRadius = Math.hypot(rect.width, rect.height) / 2

    setAnimating(true)
    animate(radius, target ? maxRadius : 0, {
      duration: 0.45,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: setRadius,
      onComplete: () => {
        setRevealed(target)
        setAnimating(false)
      },
    })
  }

  const baseSrc = progress
  const revealSrc = full

  const maskGradient = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0, black ${radius}px, transparent ${radius}px)`

  return (
    <div className="flex flex-col items-end gap-3 sm:items-center sm:gap-4">
      <div
        ref={wrapRef}
        className="h-full w-full"
        style={{
          opacity: inView ? 1 : 0,
          clipPath,
          transition: `opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s, clip-path 0.25s ease-out`,
        }}
      >
        <div
          ref={containerRef}
          className={`relative overflow-hidden select-none ${className}`}
        >
          <Image
            src={baseSrc}
            alt={alt}
            fill
            sizes="100vw"
            className={`object-cover ${objectPosition}`}
            draggable={false}
          />
          <Image
            src={revealSrc}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className={`pointer-events-none object-cover ${objectPosition}`}
            style={{ maskImage: maskGradient, WebkitMaskImage: maskGradient }}
            draggable={false}
          />
        </div>
      </div>

      {/* Mobile: below the image, right-aligned. Desktop (sm+): below the image, centered. */}
      <div
        role="group"
        aria-label="Toggle between sketch and render"
        className="bg-muted flex gap-1 rounded-full p-1"
      >
        <button
          type="button"
          aria-pressed={!revealed}
          onClick={() => handleSwitch(false)}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
            !revealed
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sketch
        </button>
        <button
          type="button"
          aria-pressed={revealed}
          onClick={() => handleSwitch(true)}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
            revealed
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Render
        </button>
      </div>
    </div>
  )
}
