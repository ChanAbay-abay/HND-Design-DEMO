import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Navbar Component
 * @see DESIGN_SYSTEM.md#Navigation
 *
 * UDS specs:
 * - Height: --navbar-height (globals.css, default 4rem/64px) — the navbar
 *   is fixed/overlaid and consumes no layout height, so full-height or
 *   pinned sections (e.g. ZoomParallax) must size/position themselves
 *   against calc(100vh - var(--navbar-height)) and top-(--navbar-height)
 *   rather than bare h-screen/top-0.
 * - Fixed, always transparent, floats on top of page content
 * - Border-bottom with border-border token
 * - Padding: px-4
 */

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Content for the left section (logo, brand) */
  start?: React.ReactNode
  /** Content for the center section (navigation links) */
  center?: React.ReactNode
  /** Content for the right section (user menu, actions) */
  end?: React.ReactNode
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ start, center, end, className, ...props }, ref) => (
    <nav
      ref={ref}
      data-slot="navbar"
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 left-0 z-40 flex h-(--navbar-height) w-full items-center gap-4 bg-transparent px-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-3">{start}</div>
      {center && (
        <div className="hidden flex-1 justify-center md:flex">{center}</div>
      )}
      <div className="flex flex-1 items-center justify-end gap-3">{end}</div>
    </nav>
  )
)
Navbar.displayName = "Navbar"

export { Navbar }
