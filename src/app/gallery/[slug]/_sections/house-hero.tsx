import Image from "next/image"
import type { HouseProject } from "../../_data/houses"

/**
 * Sticky + cover-sheet pin: this section's own flow box is exactly one
 * viewport tall, so `sticky top-0` holds it pinned for exactly one
 * viewport-height of scroll before releasing naturally — no JS, no extra
 * wrapper. `HouseInfo` right after it is opaque + higher stacking, so it
 * slides up and visibly covers the pinned photo as the user scrolls.
 */
export function HouseHero({ house }: { house: HouseProject }) {
  return (
    <section
      data-navbar-theme="light"
      className="sticky top-0 z-0 h-dvh w-full overflow-hidden bg-black"
    >
      <Image
        src={house.hero.src}
        alt={house.hero.alt}
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-black/0" />
      <div className="absolute bottom-0 left-0 p-6 lg:p-16">
        <h1 className="font-serif text-4xl leading-[1.05] font-medium text-white lg:text-6xl xl:text-7xl">
          {house.name}
        </h1>
      </div>
    </section>
  )
}
