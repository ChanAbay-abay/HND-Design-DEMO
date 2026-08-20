"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { Navbar } from "@/components/common/navbar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getLenis } from "@/lib/lenis"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const

type NavTheme = "light" | "dark"

/**
 * Reads which `[data-navbar-theme]` section currently sits behind the fixed
 * navbar (measured against the navbar's own rendered bottom edge, not a
 * hard-coded height) and flips the logo / link / CTA colors to match.
 */
function useNavbarTheme(navRef: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = React.useState<NavTheme>("light")
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    function applyScroll() {
      rafRef.current = null
      const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 64
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-navbar-theme]"
      )
      let next: NavTheme = "light"
      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= navBottom && rect.bottom > navBottom) {
          next = (el.dataset.navbarTheme as NavTheme) || "light"
          break
        }
      }
      setTheme((prev) => (prev === next ? prev : next))
    }

    function onScroll() {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(applyScroll)
    }

    applyScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [navRef])

  return theme
}

type NavStage = "top" | "zoomed" | "normal"

/**
 * Tracks progress through the hero's scroll-jacked zoom section
 * (`[data-zoom-end]`, rendered by `ZoomParallax`) to stage the navbar's
 * reveal:
 * - "top": the zoom hasn't finished yet (covers both "not scrolled at all"
 *   and "still mid-zoom") — only the CTA shows. Scrolling back out of a full
 *   zoom drops straight back to this, same as never having scrolled.
 * - "zoomed": the zoom has fully completed and the hold period is playing
 *   out, still inside the hero section — everything but the logo shows.
 * - "normal": scrolled past the hero into the rest of the page — full navbar.
 *
 * Progress is computed with the same math Framer's `useScroll({ offset:
 * ["start start", "end end"] })` uses internally, read directly off the
 * hero element's rect so this hook doesn't need a ref into ZoomParallax.
 */
function useNavbarStage(navRef: React.RefObject<HTMLElement | null>) {
  const [stage, setStage] = React.useState<NavStage>("top")
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    function applyScroll() {
      rafRef.current = null
      const heroEl = document.querySelector<HTMLElement>("[data-zoom-end]")
      const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 64

      let next: NavStage
      if (!heroEl) {
        next = "normal"
      } else {
        const rect = heroEl.getBoundingClientRect()
        if (rect.bottom <= navBottom) {
          next = "normal"
        } else {
          const zoomEnd = parseFloat(heroEl.dataset.zoomEnd ?? "1")
          const travel = rect.height - window.innerHeight
          const progress = travel > 0 ? -rect.top / travel : 0
          next = progress >= zoomEnd ? "zoomed" : "top"
        }
      }
      setStage((prev) => (prev === next ? prev : next))
    }

    function onScroll() {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(applyScroll)
    }

    applyScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [navRef])

  return stage
}

/**
 * Scrolls to the exact frame the zoom animation finishes — the earliest
 * point the whole scene is at full zoom and the navbar's right-side links
 * + CTA are visible — not the later end of the hold period (which is what
 * `ZoomParallax`'s own center-click targets). Landing any further in just
 * burns through the hold distance as visible extra scroll for no reason.
 */
function scrollToZoomedHero(immediate = false) {
  const el = document.querySelector<HTMLElement>("[data-zoom-end]")
  if (!el) return false
  const zoomEnd = parseFloat(el.dataset.zoomEnd ?? "1")
  const rect = el.getBoundingClientRect()
  const containerTop = rect.top + window.scrollY
  const travel = el.offsetHeight - window.innerHeight
  const targetY = containerTop + zoomEnd * travel
  if (immediate) {
    getLenis().scrollTo(targetY, { immediate: true })
  } else {
    getLenis().scrollTo(targetY, { duration: 1.6 })
  }
  return true
}

// Set right before navigating away from "/" via the logo, so the home page
// can pick it up on mount and jump straight to the zoomed hero — the logo
// always resolves to that spot, not just the plain top of the page.
const SCROLL_TO_ZOOM_KEY = "hnd:scroll-to-zoomed-hero"

/**
 * Consumes the cross-page flag on mount and scrolls to the zoomed hero once
 * `ZoomParallax` has actually laid out (its `offsetHeight` reflects the full
 * scroll-track, not just the viewport-height sticky stage) — polls briefly
 * since the hero's images/layout may not be ready on the very first frame.
 */
function useConsumeScrollToZoomFlag(isHome: boolean) {
  React.useEffect(() => {
    if (!isHome) return
    if (sessionStorage.getItem(SCROLL_TO_ZOOM_KEY) !== "1") return
    sessionStorage.removeItem(SCROLL_TO_ZOOM_KEY)

    let cancelled = false
    let attempts = 0
    function tryScroll() {
      if (cancelled) return
      const el = document.querySelector<HTMLElement>("[data-zoom-end]")
      const ready = el && el.offsetHeight > window.innerHeight
      if (ready && scrollToZoomedHero(true)) return
      attempts += 1
      if (attempts < 40) requestAnimationFrame(tryScroll)
    }
    tryScroll()
    return () => {
      cancelled = true
    }
  }, [isHome])
}

export function SiteNavbar() {
  const navRef = React.useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const theme = useNavbarTheme(navRef)
  const isDark = theme === "dark"
  const stage = useNavbarStage(navRef)
  const showLogo = stage === "normal"
  const showLinks = stage !== "top"
  const [quoteHovered, setQuoteHovered] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  useConsumeScrollToZoomFlag(isHome)

  return (
    <Navbar
      ref={navRef}
      start={
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: showLogo ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ pointerEvents: showLogo ? "auto" : "none" }}
            aria-hidden={!showLogo}
          >
            <Link
              href="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  scrollToZoomedHero()
                } else {
                  sessionStorage.setItem(SCROLL_TO_ZOOM_KEY, "1")
                }
              }}
              className="flex shrink-0 items-center"
            >
              <Image
                src="/images/HND-logo-transparent.png"
                alt="HND Design + Build"
                width={188}
                height={100}
                priority
                className={`h-10 w-auto transition-[filter] duration-300 lg:h-12 ${
                  isDark ? "invert" : ""
                }`}
              />
            </Link>
          </motion.div>
        </div>
      }
      end={
        <div className="flex items-center gap-8">
          <motion.div
            className="hidden items-center gap-8 md:flex"
            animate={{
              x: quoteHovered ? -14 : 0,
              opacity: showLinks ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ pointerEvents: showLinks ? "auto" : "none" }}
            aria-hidden={!showLinks}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={
                  link.href === "/"
                    ? (e) => {
                        if (isHome) {
                          e.preventDefault()
                          scrollToZoomedHero()
                        } else {
                          sessionStorage.setItem(SCROLL_TO_ZOOM_KEY, "1")
                        }
                      }
                    : undefined
                }
                className={`relative text-sm font-medium after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isDark ? "text-white/80" : "text-foreground/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
          <motion.div
            className="hidden md:block"
            onHoverStart={() => setQuoteHovered(true)}
            onHoverEnd={() => setQuoteHovered(false)}
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              variant="brand"
              size="sm"
              asChild
              className={`shadow-none transition-colors duration-300 ${
                isDark
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-black text-white hover:bg-black/90"
              }`}
            >
              <a href="/contact#form">Get a Quote</a>
            </Button>
          </motion.div>
          <motion.div
            className="md:hidden"
            animate={{ opacity: showLinks ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ pointerEvents: showLinks ? "auto" : "none" }}
            aria-hidden={!showLinks}
          >
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className={`flex size-9 items-center justify-center transition-colors duration-300 ${
                    isDark ? "text-white" : "text-foreground"
                  }`}
                >
                  <Menu className="size-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle asChild>
                  <Link
                    href="/"
                    onClick={(e) => {
                      setMobileOpen(false)
                      if (isHome) {
                        e.preventDefault()
                        scrollToZoomedHero()
                      } else {
                        sessionStorage.setItem(SCROLL_TO_ZOOM_KEY, "1")
                      }
                    }}
                    className="flex shrink-0 items-center"
                  >
                    <Image
                      src="/images/HND-logo-transparent.png"
                      alt="HND Design + Build"
                      width={188}
                      height={100}
                      className="h-10 w-auto"
                    />
                  </Link>
                </SheetTitle>
                <nav className="mt-8 flex flex-col gap-6">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        onClick={
                          link.href === "/"
                            ? (e) => {
                                if (isHome) {
                                  e.preventDefault()
                                  scrollToZoomedHero()
                                } else {
                                  sessionStorage.setItem(
                                    SCROLL_TO_ZOOM_KEY,
                                    "1"
                                  )
                                }
                              }
                            : undefined
                        }
                        className="text-foreground text-lg font-medium"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <Button
                  variant="brand"
                  size="lg"
                  asChild
                  className="mt-4 bg-black text-white shadow-none hover:bg-black/90"
                >
                  <a href="/contact#form">Get a Quote</a>
                </Button>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      }
    />
  )
}
