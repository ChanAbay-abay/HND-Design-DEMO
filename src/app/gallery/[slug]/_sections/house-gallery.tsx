"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import type { HouseProject, HousePhoto } from "../../_data/houses"
import { MAX_HOUSE_PHOTOS } from "../../_data/houses"

/**
 * Deterministic PRNG (mulberry32) seeded off the house slug — the masonry
 * reads as randomized but is identical on every server and client render,
 * so there's no hydration mismatch, and it re-shuffles per house for free.
 */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash
}

const ASPECTS = ["3/4", "4/5", "1/1", "4/3", "5/4"] as const
const WIDTH_PCT_RANGE = [68, 100] as const
const OFFSET_PX_RANGE = [0, 96] as const

interface LaidOutPhoto extends HousePhoto {
  aspect: string
  widthPct: number
  align: "start" | "end"
  offsetPx: number
}

function layoutPhotos(seedKey: string, photos: HousePhoto[]): LaidOutPhoto[] {
  const random = mulberry32(hashSeed(seedKey))
  return photos.map((photo) => ({
    ...photo,
    aspect: ASPECTS[Math.floor(random() * ASPECTS.length)],
    widthPct: Math.round(
      WIDTH_PCT_RANGE[0] + random() * (WIDTH_PCT_RANGE[1] - WIDTH_PCT_RANGE[0])
    ),
    align: random() > 0.5 ? "end" : "start",
    offsetPx: Math.round(
      OFFSET_PX_RANGE[0] + random() * (OFFSET_PX_RANGE[1] - OFFSET_PX_RANGE[0])
    ),
  }))
}

const LAYOUT_TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const

export function HouseGallery({ house }: { house: HouseProject }) {
  // Every house's additional-photo set is capped at the deepest house's
  // count, so no single project's wall can grow unbounded relative to the
  // rest of the site.
  const photos = layoutPhotos(
    house.slug,
    house.photos.slice(0, MAX_HOUSE_PHOTOS)
  )
  const [activeSrc, setActiveSrc] = useState<string | null>(null)
  const activePhoto = photos.find((p) => p.src === activeSrc) ?? null

  // Portal target — gated on mount so SSR/hydration never try to touch
  // `document.body` directly.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Freeze background scroll while the lightbox is open, and let Escape
  // close it — both released the moment activeSrc clears.
  useEffect(() => {
    if (!activeSrc) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveSrc(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeSrc])

  return (
    <section
      data-slot="house-gallery"
      data-navbar-theme="light"
      className="bg-background relative z-10 px-6 py-16 lg:px-16 lg:py-24 xl:px-24"
    >
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 lg:gap-10">
        {photos.map((photo) => (
          <div
            key={photo.src}
            className="mb-8 break-inside-avoid lg:mb-10"
            style={{
              width: `${photo.widthPct}%`,
              marginTop: photo.offsetPx,
              marginLeft: photo.align === "end" ? "auto" : undefined,
              marginRight: photo.align === "start" ? "auto" : undefined,
            }}
          >
            <motion.button
              type="button"
              layoutId={`house-photo-${photo.src}`}
              layout
              transition={LAYOUT_TRANSITION}
              aria-label={`Expand ${photo.alt}`}
              onClick={() => setActiveSrc(photo.src)}
              className="focus-visible:ring-brand relative block w-full cursor-pointer overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:scale-[1.015] focus-visible:ring-2"
              // While this tile is mid-morph into the modal, it must paint
              // above every other grid tile — otherwise, as it scales up in
              // place, later siblings in the CSS-columns flow (painted
              // after it in DOM order) can render on top of it.
              style={{
                aspectRatio: photo.aspect,
                zIndex: activeSrc === photo.src ? 20 : undefined,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 92vw"
                className="object-cover"
              />
            </motion.button>
          </div>
        ))}
      </div>

      {/* Seamless lightbox — the clicked tile morphs (shared `layoutId`)
          from its grid position into this centered, larger frame instead of
          popping open, and morphs back the same way on close.
          Portaled to `document.body`: this section is `relative z-10`,
          which is its own stacking context, so a `z-50` modal nested inside
          it is still capped at that context's z-10 level against siblings
          outside it (like the navbar's `fixed z-40`) — it would paint
          *under* the navbar and eat clicks meant for the backdrop. The
          portal escapes that entirely. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activePhoto && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={activePhoto.alt}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 lg:p-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveSrc(null)}
              >
                <motion.div
                  layoutId={`house-photo-${activePhoto.src}`}
                  layout
                  transition={LAYOUT_TRANSITION}
                  className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: activePhoto.aspect }}
                >
                  <Image
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    fill
                    sizes="90vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setActiveSrc(null)}
                  className="focus-visible:ring-brand absolute top-6 right-6 flex h-10 w-10 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:outline-none lg:top-10 lg:right-10"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L17 17M17 1L1 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  )
}
