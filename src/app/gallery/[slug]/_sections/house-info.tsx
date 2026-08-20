import Link from "next/link"
import type { HouseProject } from "../../_data/houses"

/**
 * Sits directly after the sticky `HouseHero` in flow. Opaque background +
 * higher stacking + a top shadow is what sells the "next section slides up
 * and covers the pinned photo" read — see lessons.md, "Pin By Sticky + A
 * Cover Sheet".
 */
export function HouseInfo({ house }: { house: HouseProject }) {
  return (
    <section
      data-slot="house-info"
      data-navbar-theme="light"
      className="bg-background relative z-10 scroll-mt-(--navbar-height) px-6 py-24 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.45)] lg:px-16 lg:py-36 xl:px-24"
    >
      <div className="mx-auto max-w-400">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm lg:mb-14">
          <ol className="text-muted-foreground flex items-center gap-2">
            <li>
              <Link href="/gallery" className="hover:text-foreground transition-colors">
                Gallery
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li aria-current="page" className="text-foreground font-medium">
              {house.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr] lg:gap-32 xl:grid-cols-[380px_1fr] xl:gap-40">
          <div>
            <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-4 gap-y-2 leading-tight lg:gap-x-6">
              <dt className="font-serif text-base">Location</dt>
              <dd className="text-muted-foreground text-base font-semibold">
                {house.location}
              </dd>

              <dt className="font-serif text-base">Area</dt>
              <dd className="text-muted-foreground text-base font-semibold">
                {house.area}
              </dd>

              <dt className="font-serif text-base">Services</dt>
              <dd className="text-muted-foreground text-base font-semibold">
                {house.services.join(", ")}
              </dd>
            </dl>
          </div>

          <p className="font-serif text-2xl leading-snug font-medium text-justify lg:text-3xl">
            {house.description}
          </p>
        </div>
      </div>
    </section>
  )
}
