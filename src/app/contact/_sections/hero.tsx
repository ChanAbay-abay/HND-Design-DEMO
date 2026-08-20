export function ContactHero() {
  return (
    <section
      data-slot="contact-hero"
      data-navbar-theme="light"
      className="bg-background flex min-h-[60vh] flex-col justify-center px-6 pt-(--navbar-height) lg:px-16 xl:px-24"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <h1 className="max-w-2xl font-serif text-6xl leading-[1.05] font-medium text-balance lg:max-w-[46%] lg:text-8xl xl:text-9xl">
          Let&apos;s Build Something Together
        </h1>
        <p className="text-muted-foreground max-w-md text-justify text-lg leading-relaxed lg:max-w-sm lg:pt-4 lg:text-xl">
          Tell us about your project and we&apos;ll get back to you within one
          business day.
        </p>
      </div>
    </section>
  )
}
