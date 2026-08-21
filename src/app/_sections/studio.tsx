export function DemoStudio() {
  return (
    <section
      data-slot="demo-studio"
      data-navbar-theme="light"
      className="bg-background relative z-10 mx-auto max-w-400 px-6 py-24 lg:px-16 lg:py-36 xl:px-24"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr] lg:gap-32 xl:grid-cols-[380px_1fr] xl:gap-40">
        <div>
          <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-4 gap-y-2 leading-tight lg:gap-x-6">
            <dt className="font-serif text-base">Principal Architect</dt>
            <dd className="text-muted-foreground text-base font-semibold">
              Henson M. Atillo
            </dd>

            <dt className="font-serif text-base">Founded</dt>
            <dd className="text-muted-foreground text-base font-semibold">
              2021
            </dd>
          </dl>
        </div>

        <p className="text-justify font-serif text-2xl leading-snug font-medium lg:text-3xl">
          HND Design + Build is a Cebu-based architectural and construction firm
          delivering high-end residential, interior, and commercial projects
          across Cebu and Manila. Every project moves from first sketch to final
          turnover under one team — no gap between architect and contractor, no
          compromise between vision and what gets built.
        </p>
      </div>
    </section>
  )
}
