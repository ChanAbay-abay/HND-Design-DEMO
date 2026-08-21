"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  CircularGallery,
  type CircularGalleryHandle,
  type GalleryItem,
} from "@/components/ui/circular-gallery"

const GALLERY_ITEMS: GalleryItem[] = [
  { image: "/images/renders/corvin-1.jpg", text: "Living Room" },
  { image: "/images/renders/auburn-1.jpg", text: "Kitchen" },
  { image: "/images/renders/marlow-4.jpg", text: "Dining Area" },
  { image: "/images/renders/sorrel-2.jpg", text: "Master Bedroom" },
  { image: "/images/renders/halden-1.jpg", text: "Bathroom" },
  { image: "/images/renders/vesper-2.jpg", text: "Facade" },
  { image: "/images/renders/marlow-6.jpg", text: "Staircase" },
  { image: "/images/renders/thistle-1.jpg", text: "Exterior" },
]

export function DemoGallery() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const galleryRef = useRef<CircularGalleryHandle>(null)
  const shouldReduceMotion = useReducedMotion()
  const linkInView = useInView(linkRef, { amount: 0.6, once: false })
  const [bend, setBend] = useState(3)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const applyBend = () => setBend(mq.matches ? 3 : 0)
    applyBend()
    mq.addEventListener("change", applyBend)
    return () => mq.removeEventListener("change", applyBend)
  }, [])

  return (
    <section
      id="gallery"
      data-slot="demo-gallery"
      data-navbar-theme="light"
      className="bg-background relative z-10 mx-auto max-w-400 scroll-mt-(--navbar-height) px-6 py-24 lg:px-16 lg:py-36 xl:px-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2 className="text-6xl font-semibold tracking-wide text-balance lg:text-8xl">
          Gallery
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed lg:text-base">
          A closer look at finished spaces and rendered concepts from recent
          projects.
        </p>
      </div>

      <div className="relative mt-6 mr-[calc(50%-50vw)] ml-[calc(50%-50vw)] h-[500px] w-screen lg:h-[600px]">
        <CircularGallery
          ref={galleryRef}
          items={GALLERY_ITEMS}
          bend={bend}
          borderRadius={0.05}
          scrollEase={0.02}
          scrollSpeed={0.4}
        />

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => galleryRef.current?.scrollPrev()}
            aria-label="Previous project"
            className="text-foreground/60 hover:text-foreground flex size-8 items-center justify-center transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.scrollNext()}
            aria-label="Next project"
            className="text-foreground/60 hover:text-foreground flex size-8 items-center justify-center transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link
            ref={linkRef}
            href="/gallery"
            className="relative inline-block shrink-0 text-base font-medium tracking-tight lg:text-lg"
          >
            View full gallery
            <motion.span
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current"
              initial={false}
              animate={{ scaleX: linkInView || shouldReduceMotion ? 1 : 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: linkInView ? 0.3 : 0,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
