import { SketchReveal } from "@/components/ui/sketch-reveal"

export function DemoSketches() {
  return (
    <section
      id="drafts-to-reality"
      data-slot="demo-sketches"
      data-navbar-theme="light"
      className="bg-background relative z-10 scroll-mt-(--navbar-height) py-24 lg:py-36"
    >
      <h2 className="text-center text-6xl font-semibold tracking-wide text-balance lg:text-8xl">
        Drafts to Reality
      </h2>

      <div className="mt-16 flex flex-col lg:mt-24">
        <SketchReveal
          index={0}
          full="/images/hnd_sketches/sketch1-rendered.png"
          progress="/images/hnd_sketches/sketch1-full.png"
          alt="Rendered design compared against its progress sketch"
        />

        <div className="container mx-auto max-w-4xl px-4 py-16 text-center lg:py-24">
          <p className="font-serif text-muted-foreground text-xl leading-relaxed lg:text-3xl">
            Every project starts on paper. Architect Henson Atillo works through
            several rounds of hand sketches directly with each client — refining
            layout, flow, and detail together — before a single line is rendered.
            It&apos;s slower than handing over a template, but it&apos;s why the
            finished space always matches the vision.
          </p>
        </div>

        <SketchReveal
          index={1}
          full="/images/hnd_sketches/sketch2-rendered.png"
          progress="/images/hnd_sketches/sketch2-full-test.png"
          alt="Rendered design compared against its progress sketch"
        />
      </div>
    </section>
  )
}
