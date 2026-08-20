import Image from "next/image"

export function AboutStatement() {
  return (
    <section
      data-slot="about-statement"
      data-navbar-theme="light"
      className="bg-background sticky top-0 z-0 flex h-dvh flex-col justify-center overflow-hidden px-6 pt-(--navbar-height) lg:px-16 xl:px-24"
    >
      <div className="absolute inset-y-0 right-0 hidden w-[63%] overflow-hidden lg:block">
        <Image
          src="/images/hnd_sketches/about-page-sketch.png"
          alt="Architectural sketch of an HND Design + Build project"
          fill
          priority
          quality={90}
          className="object-cover object-left"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 max-w-4xl text-left lg:max-w-[42%]">
        <h1 className="font-serif text-5xl leading-[1.05] font-medium text-balance lg:text-7xl xl:text-8xl">
          Architects. Designers. Engineers.
        </h1>
        <p className="text-muted-foreground mt-8 text-base leading-relaxed lg:text-lg">
          United by one vision, one mission, and the values behind
          <br />
          every build we deliver.
        </p>
      </div>
    </section>
  )
}
