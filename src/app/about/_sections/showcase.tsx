"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export function AboutShowcase() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <div
      ref={container}
      data-navbar-theme="dark"
      className="relative h-[70vh] w-full overflow-hidden lg:h-[90vh]"
    >
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <Image
          src="/images/renders/sorrel-1.jpg"
          alt="HND Design + Build residential render"
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
      </motion.div>
    </div>
  )
}
