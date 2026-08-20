"use client"

import Link from "next/link"
import { getLenis } from "@/lib/lenis"

const FOOTER_LINK_CLASSES =
  "relative hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"

export function SiteFooter() {
  return (
    <footer
      data-navbar-theme="light"
      className="bg-background text-foreground w-full"
    >
      <h2 className="sr-only">HND Design + Build</h2>

      <nav
        aria-label="Footer"
        className="text-foreground/70 grid w-full grid-cols-3 items-center gap-x-6 gap-y-4 px-6 pt-20 text-center text-xs tracking-wide uppercase sm:flex sm:flex-wrap sm:justify-between sm:gap-y-2 sm:px-10 lg:pt-28"
      >
        <Link href="/" className={FOOTER_LINK_CLASSES}>
          Home
        </Link>
        <Link href="/about" className={FOOTER_LINK_CLASSES}>
          About
        </Link>
        <Link href="/gallery" className={FOOTER_LINK_CLASSES}>
          Gallery
        </Link>
        <Link href="/contact" className={FOOTER_LINK_CLASSES}>
          Contact
        </Link>
        <Link href="/contact#form" className={FOOTER_LINK_CLASSES}>
          Get a Quote
        </Link>
        <button
          type="button"
          onClick={() => getLenis().scrollTo(0)}
          className={`${FOOTER_LINK_CLASSES} uppercase`}
        >
          Back to top
        </button>
      </nav>

      <div className="flex w-full items-center justify-center overflow-hidden px-4 sm:px-8">
        <span
          aria-hidden
          className="leading-none font-black tracking-tighter whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(6rem, 44vw, 60rem)",
            marginTop: "-0.12em",
            marginBottom: "-0.145em",
          }}
        >
          HND
        </span>
      </div>

      <div className="bg-foreground text-background px-6 py-6 sm:px-10">
        <div className="text-background/60 flex flex-col flex-wrap items-center justify-between gap-4 text-center text-xs tracking-wide uppercase sm:flex-row sm:text-left">
          <span>All rights reserved</span>
          <span>+63 966 244 8818 &nbsp;·&nbsp; hnddesignbuild@gmail.com</span>
          <span>Cebu City, Philippines</span>
          <span>&copy; {new Date().getFullYear()} HND Design + Build</span>
          <a
            href="https://iridel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background/40 hover:text-background/70 normal-case"
          >
            Demo by iridel.com
          </a>
        </div>
      </div>
    </footer>
  )
}
