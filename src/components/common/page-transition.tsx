"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Site-wide route fade-in — most visible going gallery card -> house page,
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
 *
 * No `AnimatePresence`/exit animation, deliberately: keeping the outgoing
 * page mounted to play an exit fade puts both pages in the DOM at once,
 * stacked in normal flow — the incoming page's hero image renders (and
 * paints) immediately while the outgoing one is still fading out on top of
 * or behind it, which reads as a flash before the crossfade "settles". A
 * plain keyed `motion.div` swaps instantly (old page unmounts, no exit) and
 * only animates the new page fading in from 0 — a single clean fade-in with
 * nothing to flash against.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}
