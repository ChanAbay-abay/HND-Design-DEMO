"use client"

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/ui/animated-slideshow"

const SERVICES = [
  {
    id: "architectural-design",
    title: "Architectural Design and Consultancy",
    description:
      "Site analysis, feasibility studies, and strategic planning that turn a vision into a professional foundation.",
    imageUrl: "/images/renders/corvin-1.jpg",
  },
  {
    id: "interior-fitout",
    title: "Interior Design and Fit-Out",
    description:
      "Sophisticated, modern interiors backed by full construction management — materials to spatial flow.",
    imageUrl: "/images/renders/marlow-2.jpg",
  },
  {
    id: "residential-construction",
    title: "Residential Construction and Project Management",
    description:
      "End-to-end oversight of the design and construction phases, on budget and on timeline.",
    imageUrl: "/images/renders/halden-1.jpg",
  },
  {
    id: "renovations",
    title: "Renovations",
    description:
      "Modernizing existing properties through thoughtful design interventions that lift both form and value.",
    imageUrl: "/images/renders/thistle-2.jpg",
  },
] as const

function ServiceRow({
  index,
  service,
}: {
  index: number
  service: (typeof SERVICES)[number]
}) {
  const { changeSlide } = useHoverSliderContext()

  return (
    <div
      className="cursor-pointer py-6 first:pt-0 lg:py-8"
      onMouseEnter={() => changeSlide(index)}
    >
      <TextStaggerHover
        index={index}
        text={service.title}
        className="font-serif text-xl leading-tight font-medium text-balance lg:text-3xl"
      />
      <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
        {service.description}
      </p>
    </div>
  )
}

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  return (
    <div className="w-[85vw] flex-none snap-center overflow-hidden rounded-lg">
      <div className="aspect-4/5 w-full overflow-hidden rounded-lg">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="size-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="pt-5">
        <h3 className="font-serif text-xl leading-tight font-medium text-balance">
          {service.title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  )
}

export function DemoServices() {
  return (
    <section
      id="services"
      data-slot="demo-services"
      data-navbar-theme="light"
      className="bg-background relative z-10 mx-auto max-w-400 scroll-mt-(--navbar-height) py-24 lg:px-16 lg:py-36 xl:px-24"
    >
      <div className="flex flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-0">
        <h2 className="text-6xl font-semibold tracking-wide text-balance lg:text-8xl">
          Services
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed lg:text-base">
          End-to-end design and construction. A fully registered, Cebu-based
          firm bridging creative vision and technical execution — one seamless
          journey from initial concept to final turnover.
        </p>
      </div>

      {/* Mobile: swipeable cards */}
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Desktop: hover slider */}
      <HoverSlider className="mt-16 hidden lg:mt-24 lg:block lg:px-16 xl:px-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div className="divide-border/70 flex flex-col divide-y">
            {SERVICES.map((service, index) => (
              <ServiceRow key={service.id} index={index} service={service} />
            ))}
          </div>

          <HoverSliderImageWrap className="aspect-4/5 w-full overflow-hidden rounded-lg lg:aspect-3/4">
            {SERVICES.map((service, index) => (
              <HoverSliderImage
                key={service.id}
                index={index}
                imageUrl={service.imageUrl}
                src={service.imageUrl}
                alt={service.title}
                className="size-full object-cover"
                loading="eager"
                decoding="async"
              />
            ))}
          </HoverSliderImageWrap>
        </div>
      </HoverSlider>
    </section>
  )
}
