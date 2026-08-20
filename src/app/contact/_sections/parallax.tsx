"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export function ContactParallax() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <section
      ref={container}
      data-slot="contact-parallax"
      data-navbar-theme="dark"
      className="bg-background relative h-[70vh] w-full overflow-hidden lg:h-[85vh]"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[12%] -bottom-[12%]"
      >
        <Image
          src="/images/renders/halden-8.jpg"
          alt="High-detail architectural render of a Halden House interior"
          fill
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/25" />
    </section>
  )
}
