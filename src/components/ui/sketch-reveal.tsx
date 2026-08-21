"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { animate } from "framer-motion"

const REVEAL_DURATION = 1.1
const REVEAL_STEPS = 9
const REVEAL_COLS = 8

// Desktop hover lens: a small peek circle that follows the cursor before a
// click commits to the full reveal.
const LENS_MIN = 80
const LENS_MAX = 190
const LENS_RATIO = 0.19
// Width (px) of the soft fade at the sharp layer's edge, and how far past
// the reveal radius the blurred halo layer extends.
const EDGE_FEATHER = 24
const BLUR_RING = 75
const BLUR_PX = 16
// The halo layer peaks at partial opacity (not fully opaque) so the blurred
// ring blends into the base photo instead of reading as a hard smudge.
const HALO_ALPHA = 0.5

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
  // Which photo is currently the fully-shown base layer. Starts false (the
  // auto-preview wipe ends on the sketch); a completed click-expand flips it,
  // so hover/click work symmetrically no matter which side is active.
  const [activeIsRender, setActiveIsRender] = useState(false)
  const [radius, setRadius] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovering, setHovering] = useState(false)
  // True only for the brief click-triggered grow-to-full animation, so the
  // hover-lens effect doesn't fight it and the pointer position freezes at
  // the click point instead of drifting mid-expand.
  const [expanding, setExpanding] = useState(false)
  // Auto-plays once after the scroll-in reveal finishes: the render is what
  // the entrance wipes into view, then it wipes straight to the sketch —
  // same jagged animation and timing as the entrance, just reversed and
  // applied to the render layer. Hover/click take over once this is done.
  const [previewDone, setPreviewDone] = useState(false)
  const seed = index * 97 + 1
  // Render starts fully visible (this is what the entrance wipes into view).
  const [wipeClip, setWipeClip] = useState("inset(0% 0% 0% 0%)")
  const [clipPath, setClipPath] = useState(() => jaggedClip(0, seed))
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const lastStepRef = useRef(-1)
  const wipeStepRef = useRef(-1)
  const radiusRef = useRef(0)
  const radiusControlsRef = useRef<ReturnType<typeof animate> | null>(null)

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
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reducedMotion) {
      setClipPath("inset(0% 0% 0% 0%)")
      setWipeClip(jaggedClip(0, seed))
      setPreviewDone(true)
      return
    }
    // Quantize into REVEAL_STEPS discrete jumps so the edge visibly advances
    // in uneven bursts, like a pencil laying down strokes, rather than a
    // smooth wipe.
    let wipeControls: ReturnType<typeof animate> | undefined
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
      onComplete: () => {
        setClipPath("inset(0% 0% 0% 0%)")
        // Immediately wipe render -> sketch: identical duration, ease, and
        // stepped jaggedClip quantization as the entrance above, just run
        // from 100 down to 0 and applied to the render layer instead of the
        // whole wrapper.
        wipeControls = animate(100, 0, {
          duration: REVEAL_DURATION,
          ease: [0.61, 0.02, 0.35, 1],
          onUpdate: (p) => {
            const step = Math.round((p / 100) * REVEAL_STEPS)
            if (step !== wipeStepRef.current) {
              wipeStepRef.current = step
              setWipeClip(jaggedClip(p, seed + step * 31))
            }
          },
          onComplete: () => {
            setWipeClip(jaggedClip(0, seed))
            setPreviewDone(true)
          },
        })
      },
    })
    return () => {
      controls.stop()
      wipeControls?.stop()
    }
  }, [inView, index, seed])

  // Interrupts whatever radius animation is in flight and eases toward a new
  // target from the current live value (not the last-committed React state,
  // which can lag mid-animation).
  function animateRadiusTo(
    target: number,
    duration: number,
    onComplete?: () => void
  ) {
    radiusControlsRef.current?.stop()
    radiusControlsRef.current = animate(radiusRef.current, target, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        radiusRef.current = v
        setRadius(v)
      },
      onComplete,
    })
  }

  // Sets the reveal origin to the container's center — used by the mobile
  // pill switcher, which has no cursor position to grow the circle from.
  function centerRevealOrigin() {
    const el = containerRef.current
    if (!el) return
    el.style.setProperty("--x", "50%")
    el.style.setProperty("--y", "50%")
  }

  // Desktop (fine pointer + real hover): hovering opens a small lens around
  // the cursor showing whichever photo isn't currently active — this alone
  // handles both directions, since `activeIsRender` flips on every completed
  // click-expand (see `handleContainerClick`/`selectMobile`) and the "other"
  // photo is always whichever one isn't active. Skipped while `expanding` so
  // it doesn't fight the click-triggered grow-to-full animation.
  useEffect(() => {
    if (!previewDone || expanding) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const fineHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const lensRadius = fineHover
      ? Math.min(
          LENS_MAX,
          Math.max(LENS_MIN, Math.min(rect.width, rect.height) * LENS_RATIO)
        )
      : 0
    const target = fineHover && hovering ? lensRadius : 0
    animateRadiusTo(target, 0.28)
  }, [hovering, previewDone, expanding])

  // Position-based instead of enter/leave-event-based: if the cursor is
  // already resting over the image when the page scrolls it into view (very
  // common with wheel/trackpad scrolling — the pointer never "enters"
  // because it doesn't move), a plain onPointerEnter/onPointerLeave pair
  // never fires and hover silently never activates. Tracking the last known
  // mouse position (always, regardless of preview state) and evaluating
  // containment against it — immediately once the preview finishes, and
  // again on every subsequent move/scroll — catches that case too.
  const lastPointerRef = useRef({ x: -Infinity, y: -Infinity, isMouse: false })
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      lastPointerRef.current = {
        x: e.clientX,
        y: e.clientY,
        isMouse: e.pointerType === "mouse",
      }
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [])

  useEffect(() => {
    if (!previewDone) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    function evaluate() {
      if (!lastPointerRef.current.isMouse) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const { x, y } = lastPointerRef.current
      const inside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      setHovering(inside)
      if (inside && !expanding) {
        containerRef.current?.style.setProperty(
          "--x",
          `${((x - rect.left) / rect.width) * 100}%`
        )
        containerRef.current?.style.setProperty(
          "--y",
          `${((y - rect.top) / rect.height) * 100}%`
        )
      }
    }

    // Covers a cursor that's already resting over the image the moment the
    // preview finishes (no move/scroll event to trigger the check otherwise).
    evaluate()

    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(evaluate)
    }

    window.addEventListener("pointermove", evaluate, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("pointermove", evaluate)
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [previewDone, expanding])

  // Grows the current lens (or, if the pointer hasn't moved yet, a circle
  // from the container center) to fully cover the image, then commits: flips
  // which photo is "active" and resets the radius to 0 so the overlay is
  // instantly invisible again — the base layer already shows the same pixels
  // the overlay just finished covering, so the swap is imperceptible. This
  // is what makes hover/click symmetric on both sides: every click always
  // expands whichever photo the lens was currently peeking.
  function expandAndSwap(target: boolean) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const maxRadius = Math.hypot(rect.width, rect.height)
    setExpanding(true)
    animateRadiusTo(maxRadius, 0.5, () => {
      setActiveIsRender(target)
      radiusRef.current = 0
      setRadius(0)
      setExpanding(false)
    })
  }

  function handleContainerClick() {
    if (!previewDone || expanding) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    expandAndSwap(!activeIsRender)
  }

  function selectMobile(target: boolean) {
    if (activeIsRender === target || expanding) return
    centerRevealOrigin()
    expandAndSwap(target)
  }

  // The overlay is whichever photo isn't currently active — the one hover
  // peeks and click expands.
  const otherSrc = activeIsRender ? progress : full

  // Sharp reveal: a crisp circle around the cursor (or, on mobile, the
  // container center) with a short feathered edge.
  function sharpMask(r: number) {
    const inner = Math.max(r - EDGE_FEATHER, 0)
    return `radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0px, black ${inner}px, transparent ${r}px)`
  }
  // Blurred halo: transparent through the sharp circle's own fade zone, peaks
  // at partial opacity right at its edge, then fades out — reads as the
  // reveal blurring softly into the base photo rather than cutting off hard.
  function haloMask(r: number) {
    if (r <= 0.5) {
      return "radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0px, transparent 0px)"
    }
    const inner = Math.max(r - EDGE_FEATHER, 0)
    const outer = r + BLUR_RING
    return `radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0px, transparent ${inner}px, rgba(0, 0, 0, ${HALO_ALPHA}) ${r}px, transparent ${outer}px)`
  }

  // Before the auto-preview finishes, the render layer is driven by its own
  // jagged clip-path. Once hover/click take over, switch to the radial masks
  // driven by `radius`/`--x`/`--y` instead.
  const sharpStyle = previewDone
    ? { maskImage: sharpMask(radius), WebkitMaskImage: sharpMask(radius) }
    : { clipPath: wipeClip, WebkitClipPath: wipeClip }
  const haloStyle = {
    maskImage: haloMask(radius),
    WebkitMaskImage: haloMask(radius),
    filter: `blur(${BLUR_PX}px)`,
  }

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
          onClick={handleContainerClick}
          className={`relative overflow-hidden select-none lg:cursor-pointer ${className}`}
        >
          {/* Two permanently-mounted base layers (never swap `src`) with
              opacity toggled by `activeIsRender`, instead of one layer whose
              `src` flips between photos. A same-node `src` swap can leave the
              browser painting the previous photo for a frame while the new
              one decodes — invisible normally, but here it lands in the
              exact instant the overlay collapses to radius 0, so the stale
              frame is briefly uncovered before the new photo finishes
              painting (a switch → flash-back → correct sequence). Opacity
              toggling swaps instantly with no decode step. */}
          <Image
            src={full}
            alt={alt}
            fill
            sizes="100vw"
            className={`bg-background object-cover ${objectPosition}`}
            style={{ opacity: activeIsRender ? 1 : 0 }}
            draggable={false}
          />
          <Image
            src={progress}
            alt={alt}
            fill
            sizes="100vw"
            className={`bg-background object-cover ${objectPosition}`}
            style={{ opacity: activeIsRender ? 0 : 1 }}
            draggable={false}
          />
          {previewDone && (
            <Image
              src={otherSrc}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className={`bg-background pointer-events-none object-cover ${objectPosition}`}
              style={haloStyle}
              draggable={false}
            />
          )}
          <Image
            src={otherSrc}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className={`bg-background pointer-events-none object-cover ${objectPosition}`}
            style={sharpStyle}
            draggable={false}
          />
        </div>
      </div>

      {/* Mobile-only: below the image, right-aligned. Desktop uses hover-to-reveal + click-to-lock on the image itself. */}
      <div
        role="group"
        aria-label="Toggle between sketch and render"
        className="bg-muted mr-6 flex gap-1 rounded-full p-1 sm:mr-0 lg:hidden"
      >
        <button
          type="button"
          aria-pressed={!activeIsRender}
          disabled={!previewDone || expanding}
          onClick={() => selectMobile(false)}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
            !activeIsRender
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sketch
        </button>
        <button
          type="button"
          aria-pressed={activeIsRender}
          disabled={!previewDone || expanding}
          onClick={() => selectMobile(true)}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
            activeIsRender
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
