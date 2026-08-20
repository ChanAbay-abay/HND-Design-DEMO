"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

export function DemoStatement() {
  const container = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const ctaInView = useInView(ctaRef, { amount: 0.6, once: false })

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.4,
  })
  const y = useTransform(
    smoothProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["6%", "0%"]
  )

  return (
    <motion.section
      ref={container}
      style={{ y }}
      data-slot="demo-statement"
      data-navbar-theme="light"
      className="bg-background relative z-10 -mt-[7vh] shadow-[0_-40px_70px_-30px_rgba(0,0,0,0.35)] lg:-mt-[12vh]"
    >
      <div className="container mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-center px-4 pt-24 pb-20 text-center lg:min-h-[60vh] lg:pt-36 lg:pb-24">
        <h2 className="text-6xl font-semibold tracking-tight text-balance lg:text-9xl">
          From Vision to
          <br />
          Precisely Built Space
        </h2>

        <div className="mt-10 flex flex-col items-center gap-6 text-left lg:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed lg:text-base">
            Site analysis to construction management — one team, from concept
            sketches through turnover, across Cebu and Manila.
          </p>

          <motion.div
            ref={ctaRef}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-block"
          >
            <Link
              href="/contact#form"
              className="relative inline-block shrink-0 text-base font-medium tracking-tight lg:text-lg"
            >
              Get a Quote
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current"
                initial={false}
                animate={{ scaleX: ctaInView || shouldReduceMotion ? 1 : 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: ctaInView ? 0.3 : 0,
                }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
