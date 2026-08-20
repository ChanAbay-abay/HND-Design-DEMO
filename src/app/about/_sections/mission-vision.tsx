/**
 * Sits directly after the sticky `AboutStatement` in flow. Opaque background +
 * higher stacking + a top shadow sells the "next section slides up and covers
 * the pinned hero" read — same pin-by-sticky + cover-sheet pattern as
 * `HouseInfo` on the house detail pages (see lessons.md, "Pin By Sticky + A
 * Cover Sheet").
 */
export function AboutMissionVision() {
  return (
    <section
      data-slot="about-mission-vision"
      data-navbar-theme="light"
      className="bg-background relative z-10 scroll-mt-(--navbar-height) px-6 py-24 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.45)] lg:px-16 lg:py-36 xl:px-24"
    >
      <div className="mx-auto flex max-w-400 flex-col gap-y-16 lg:gap-y-24">
        <dl className="grid grid-cols-[70px_1fr] items-start gap-x-4 lg:grid-cols-[260px_1fr] lg:gap-x-16 xl:grid-cols-[320px_1fr]">
          <dt className="font-serif text-base text-right">Mission</dt>
          <dd className="font-serif text-2xl leading-snug font-medium text-left lg:text-3xl lg:text-justify">
            We are committed to understanding our clients&apos; unique needs
            and aspirations, providing exceptional architectural and interior
            design services that deliver value, quality, and a seamless
            collaborative experience. We strive to build long-term
            relationships based on trust, integrity, and mutual respect.
          </dd>
        </dl>

        <dl className="grid grid-cols-[70px_1fr] items-start gap-x-4 lg:grid-cols-[260px_1fr] lg:gap-x-16 xl:grid-cols-[320px_1fr]">
          <dt className="font-serif text-base text-right">Vision</dt>
          <dd className="font-serif text-2xl leading-snug font-medium text-left lg:text-3xl lg:text-justify">
            To create a sustainably built environment that enhances and
            positively impacts individuals, families, companies, and
            communities, and to create inspiring spaces that enrich lives.
          </dd>
        </dl>

        <dl className="flex flex-col items-center gap-y-8 lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-x-16 lg:gap-y-0 xl:grid-cols-[320px_1fr]">
          <dt className="font-serif text-base text-center lg:text-right">
            Core Values
          </dt>
          <dd className="w-full">
            <ol className="grid grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-12 lg:gap-y-12">
              <li>
                <span className="font-serif text-2xl leading-snug font-medium lg:text-3xl">
                  Integrity
                </span>
                <p className="font-serif text-muted-foreground mt-3 text-base leading-relaxed text-left lg:text-lg lg:text-justify">
                  We believe in doing things the right way, even when no one
                  is watching. From our initial designs to the final punch
                  list, we prioritize honesty and transparency.
                </p>
              </li>
              <li className="lg:mt-14">
                <span className="font-serif text-2xl leading-snug font-medium lg:text-3xl">
                  Seamless Collaboration
                </span>
                <p className="font-serif text-muted-foreground mt-3 text-base leading-relaxed text-left lg:text-lg lg:text-justify">
                  Architecture is a partnership. We value your input as much
                  as our expertise, ensuring the design process is smooth,
                  collaborative, and stress-free.
                </p>
              </li>
              <li>
                <span className="font-serif text-2xl leading-snug font-medium lg:text-3xl">
                  Intentional Design
                </span>
                <p className="font-serif text-muted-foreground mt-3 text-base leading-relaxed text-left lg:text-lg lg:text-justify">
                  We focus on what matters: how a space feels, how it
                  functions, and how it fits into its environment. We
                  believe in modern, warm, and aesthetic designs that stand
                  the test of time.
                </p>
              </li>
              <li className="lg:mt-14">
                <span className="font-serif text-2xl leading-snug font-medium lg:text-3xl">
                  Commitment to Quality
                </span>
                <p className="font-serif text-muted-foreground mt-3 text-base leading-relaxed text-left lg:text-lg lg:text-justify">
                  Having worked on projects ranging from international
                  developments in Dubai and Hong Kong to custom homes in
                  Cebu and Manila, we hold ourselves to a global standard —
                  focusing on precision, quality, and the durability of the
                  environments we create.
                </p>
              </li>
            </ol>
          </dd>
        </dl>
      </div>
    </section>
  )
}
