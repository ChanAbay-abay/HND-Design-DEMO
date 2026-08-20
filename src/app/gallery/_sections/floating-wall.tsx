"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAnimate, stagger } from "framer-motion"

import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { cn } from "@/lib/utils"

interface GalleryPhoto {
  src: string
  alt: string
  depth: number
  /** Intrinsic pixel dimensions of the source file — drives next/image's
   *  aspect ratio so the render is scaled, never cropped. */
  width: number
  height: number
  /** Full responsive position (top/left/width) as Tailwind classes,
   *  mobile-first then `md:` overrides — inline style can't take a
   *  breakpoint variant, so this can't be split into top/left/width fields
   *  the way a single non-responsive position could. */
  positionClass: string
  /** Project detail page — omitted for houses that don't have one yet
   *  (see `gallery/_data/houses.ts`). Card renders as a plain (non-link)
   *  tile until its page exists. */
  href?: string
}

// Mobile: a single stacked column (each photo its own exclusive vertical
// slot in a min-h-[800vw] container — see the overlap-proof reasoning
// below). Desktop (md+): two columns, right offset down from left by about
// half a photo's height, mirroring the staggered reference layout — photos
// only need to clear the *other* item in their own column, since the two
// columns never share horizontal space.
//
// Both schedules size the container in vw (not vh): vw and vh don't scale
// together as the window's own aspect ratio changes, so a layout that looks
// non-overlapping on one screen shape can silently collide on another if
// vertical spacing is in vh while widths are in vw. Keeping everything on
// the vw axis makes "no overlap" a property of the numbers, not a guess.
//
// No heading above this wall anymore, so the first slot starts just a
// couple % in — enough breathing room under the fixed transparent navbar,
// nothing more.
//
// One entry per project (house), ordered by how many photos back it up —
// the projects with the deepest photo sets lead the wall. Every entry's
// image is that project's `-1` render, its designated cover shot.
const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/images/renders/marlow-1.jpg",
    alt: "Marlow House",
    depth: 3,
    width: 1920,
    height: 1080,
    positionClass:
      "top-[2.6%] left-[7.5%] w-[85vw] md:top-[4.4%] md:left-[2%] md:w-[44vw]",
    href: "/gallery/marlow",
  },
  {
    src: "/images/renders/halden-1.jpg",
    alt: "Halden House",
    depth: 2,
    width: 1920,
    height: 1080,
    positionClass:
      "top-[15.7%] left-[7.5%] w-[85vw] md:top-[16.6%] md:left-[50%] md:w-[46vw]",
    href: "/gallery/halden",
  },
  {
    src: "/images/renders/sorrel-1.jpg",
    alt: "Sorrel House",
    depth: 4,
    width: 1920,
    height: 1080,
    positionClass:
      "top-[29.4%] left-[7.5%] w-[85vw] md:top-[28.4%] md:left-[2%] md:w-[44vw]",
    href: "/gallery/sorrel",
  },
  {
    src: "/images/renders/vesper-1.jpg",
    alt: "Vesper House",
    depth: 1,
    width: 1920,
    height: 1080,
    positionClass:
      "top-[42.3%] left-[7.5%] w-[85vw] md:top-[41.0%] md:left-[50%] md:w-[46vw]",
    href: "/gallery/vesper",
  },
  {
    src: "/images/renders/corvin-1.jpg",
    alt: "Corvin House",
    depth: 1,
    width: 1363,
    height: 784,
    positionClass:
      "top-[54.4%] left-[7.5%] w-[85vw] md:top-[52.3%] md:left-[2%] md:w-[44vw]",
    href: "/gallery/corvin",
  },
  {
    src: "/images/renders/auburn-1.jpg",
    alt: "Auburn House",
    depth: 2.5,
    width: 1363,
    height: 784,
    positionClass:
      "top-[67.7%] left-[7.5%] w-[85vw] md:top-[65.2%] md:left-[50%] md:w-[46vw]",
    href: "/gallery/auburn",
  },
  {
    src: "/images/renders/thistle-1.jpg",
    alt: "Thistle House",
    depth: 1.5,
    width: 1920,
    height: 1080,
    positionClass:
      "top-[79.5%] left-[7.5%] w-[85vw] md:top-[76.1%] md:left-[2%] md:w-[44vw]",
    href: "/gallery/thistle",
  },
]

export function FloatingWall() {
  const [scope, animate] = useAnimate()
  const [hoveredSrc, setHoveredSrc] = useState<string | null>(null)

  useEffect(() => {
    animate(
      "[data-gallery-photo]",
      { opacity: [0, 1] },
      { duration: 0.6, delay: stagger(0.08) }
    )
  }, [animate])

  return (
    <div ref={scope} className="bg-background relative">
      {/* Height in vw (not vh) — see the comment on GALLERY_PHOTOS for why
          this is what makes "no overlap" a guarantee instead of a guess. */}
      <div className="relative z-0 min-h-[585vw] w-full overflow-hidden md:min-h-[230vw]">
        <Floating sensitivity={-0.15}>
          {GALLERY_PHOTOS.map((photo) => {
            const isHovered = hoveredSrc === photo.src
            const isDimmed = hoveredSrc !== null && !isHovered

            const cardClassName = cn(
              "group focus-visible:ring-brand block cursor-pointer opacity-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-2",
              isHovered ? "scale-[1.04]" : "scale-100"
            )
            const cardHandlers = {
              onMouseEnter: () => setHoveredSrc(photo.src),
              onMouseLeave: () =>
                setHoveredSrc((p) => (p === photo.src ? null : p)),
              onFocus: () => setHoveredSrc(photo.src),
              onBlur: () => setHoveredSrc((p) => (p === photo.src ? null : p)),
            }
            const cardContent = (
              <>
                <div
                  className={cn(
                    "relative w-full overflow-hidden transition-colors duration-700 ease-out",
                    isDimmed
                      ? "border-border border"
                      : "border border-transparent"
                  )}
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 46vw, 88vw"
                    className={cn(
                      "object-cover opacity-100 transition-opacity duration-700",
                      isDimmed && "opacity-0"
                    )}
                  />
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-black">
                    {photo.alt}
                  </span>
                  <span
                    className={cn(
                      "relative text-sm font-medium text-black transition-opacity duration-200",
                      "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300",
                      isHovered
                        ? "opacity-100 after:scale-x-100"
                        : "pointer-events-none opacity-0"
                    )}
                  >
                    Visit
                  </span>
                </div>
              </>
            )

            return (
              <FloatingElement
                key={photo.src}
                depth={photo.depth}
                className={photo.positionClass}
              >
                {photo.href ? (
                  <Link
                    href={photo.href}
                    data-gallery-photo
                    tabIndex={0}
                    {...cardHandlers}
                    className={cardClassName}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div
                    data-gallery-photo
                    tabIndex={0}
                    {...cardHandlers}
                    className={cardClassName}
                  >
                    {cardContent}
                  </div>
                )}
              </FloatingElement>
            )
          })}
        </Floating>
      </div>
    </div>
  )
}
