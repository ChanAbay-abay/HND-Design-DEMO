"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Site-wide route crossfade — most visible going gallery card -> house page,
 * but applies to every navigation so it reads as one consistent site, not a
 * one-off effect.
 *
 * Opacity only, deliberately: every page has a `fixed` navbar and several
 * `sticky` full-height sections (see lessons.md, "position: fixed is not
 * fixed to the viewport if any ancestor has a transform"). Animating x/y/
 * scale here would set a `transform` on this wrapper — which is an ancestor
 * of every page's navbar and hero — and silently break both. Opacity never
 * creates a containing block, so it's the one property safe to animate at
 * this level.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
