"use client"

import Lenis from "lenis"

let lenis: Lenis | null = null

/**
 * Shared Lenis instance so every smooth-scroll trigger on the page (hero
 * center click, navbar logo click, ...) drives the same scroll state
 * instead of fighting over native scroll with separate instances.
 */
export function getLenis(): Lenis {
  if (!lenis) {
    lenis = new Lenis()
    // On refresh the browser restores scroll position before Lenis mounts,
    // but Lenis's own internal state starts at 0 — without this it smooth-
    // scrolls from the top up to the restored position on load.
    lenis.scrollTo(window.scrollY, { immediate: true })

    function raf(time: number) {
      lenis?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }
  return lenis
}
