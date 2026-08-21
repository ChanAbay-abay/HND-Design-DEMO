"use client"

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

// Must match --navbar-height in globals.css (currently 4rem / Navbar's h-16).
const NAVBAR_HEIGHT_PX = 64

interface ZoomParallaxImage {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  /** Corner thumbnails scattered around the center — up to 6. */
  images: ZoomParallaxImage[]
  /**
   * Renders the content that occupies the center slot (scale4) — the one
   * that grows to fill the full screen. Receives the section's scroll
   * progress (0→1) so the center content can react to how far the zoom
   * has gotten. Keep this to media (images/video) — anything laid out with
   * real text sizes will be scaled by the same transform as the photo and
   * balloon far past the viewport. Use `renderOverlay` for text.
   */
  renderCenter: (progress: MotionValue<number>) => ReactNode
  /**
   * Renders a full-viewport layer stacked on top of everything, at real
   * (unscaled) size — for copy/CTAs that should fade in once the zoom is
   * essentially finished instead of growing with it.
   */
  renderOverlay?: (progress: MotionValue<number>) => ReactNode
  /**
   * Extra scroll distance (in vh) held at full zoom once the scale
   * animation finishes, before the section releases its scroll-jack and
   * whatever comes next is allowed to scroll into view. Lets the fully
   * zoomed scene sit still for a beat instead of handing off the instant
   * the last scale keyframe lands.
   */
  holdVh?: number
  /**
   * Called with the target scroll Y (px) when the center slot is clicked —
   * wire this to a smooth-scroll implementation (e.g. Lenis) so clicking
   * the center content auto-zooms the section in. Omit to disable the
   * click-to-zoom behavior.
   */
  onCenterClick?: (targetY: number) => void
}

export function ZoomParallax({
  images,
  renderCenter,
  renderOverlay,
  holdVh = 0,
  onCenterClick,
}: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null)

  // Shuffled once per mount so the corner photos fade in after the center
  // in a random order instead of the same index order every load.
  const revealOrder = useMemo(() => {
    const order = images.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    return order
  }, [images])

  // Corner photos stay hidden until their bytes are actually decoded —
  // otherwise the opacity transition finishes before the image data
  // arrives and the reveal reads as a hard pop instead of a fade.
  const [loadedCount, setLoadedCount] = useState(0)
  const imagesReady = loadedCount >= images.length
  const handleImageLoad = useCallback(() => {
    setLoadedCount((count) => count + 1)
  }, [])

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  function handleCenterClick() {
    const el = container.current
    if (!el || !onCenterClick) return
    const rect = el.getBoundingClientRect()
    const targetY =
      rect.top + window.scrollY + el.offsetHeight - window.innerHeight
    onCenterClick(targetY)
  }

  const zoomVh = 300
  const totalVh = zoomVh + holdVh
  // The scale keyframes below only span the zoom portion of the scroll
  // range — useTransform clamps to the last output value past that point,
  // so the scene holds at full zoom for the remaining `holdVh`.
  const zoomEnd = zoomVh / totalVh

  const scale5 = useTransform(scrollYProgress, [0, zoomEnd], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, zoomEnd], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, zoomEnd], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, zoomEnd], [1, 9])
  const scale4 = useTransform(scrollYProgress, [0, zoomEnd], [1, 4])

  // At rest the scene sits under the fixed navbar, so its visual center is
  // nudged down by half the navbar height to center within the space below
  // it. `y` (unlike a layout offset) is applied in screen pixels *after*
  // `scale`, so this fades to 0 by the time the scene reaches full zoom —
  // otherwise the fixed offset would get baked into the box's transform
  // origin and reappear as a gap at the top once the scene fills the
  // viewport edge-to-edge.
  const navbarOffset = useTransform(
    scrollYProgress,
    [0, zoomEnd],
    [NAVBAR_HEIGHT_PX / 2, 0]
  )

  // Matches the original 7-slot scale sequence (index 0 reserved for the
  // center), scales[1..6].
  const scales = [scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div
      ref={container}
      className="bg-background relative"
      style={{ height: `${totalVh}vh` }}
      data-zoom-end={zoomEnd}
    >
      <div className="bg-background sticky top-0 h-dvh overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ scale: scale4, y: navbarOffset }}
          className="absolute top-0 flex h-full w-full items-center justify-center"
        >
          <div
            className={`relative h-[25vh] w-[25vw] ${onCenterClick ? "cursor-pointer" : ""}`}
            onClick={onCenterClick ? handleCenterClick : undefined}
            role={onCenterClick ? "button" : undefined}
            aria-label={onCenterClick ? "Zoom in to this section" : undefined}
          >
            {renderCenter(scrollYProgress)}
          </div>
        </motion.div>

        {images.map(({ src, alt }, i) => {
          const slot = i + 1
          const scale = scales[i]

          return (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: imagesReady ? 1 : 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: imagesReady ? 0.25 + revealOrder.indexOf(i) * 0.1 : 0,
              }}
              style={{ scale, y: navbarOffset }}
              className={`pointer-events-none absolute top-0 flex h-full w-full items-center justify-center ${slot === 1 ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]" : ""} ${slot === 2 ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]" : ""} ${slot === 3 ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]" : ""} ${slot === 4 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]" : ""} ${slot === 5 ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]" : ""} ${slot === 6 ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]" : ""} `}
            >
              <div className="relative h-[25vh] w-[25vw]">
                <Image
                  src={src}
                  alt={alt || `Parallax image ${slot}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                  quality={90}
                  onLoad={handleImageLoad}
                />
              </div>
            </motion.div>
          )
        })}

        {renderOverlay && (
          <div className="absolute inset-0">
            {renderOverlay(scrollYProgress)}
          </div>
        )}
      </div>
    </div>
  )
}
