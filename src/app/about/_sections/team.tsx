import { User } from "lucide-react"

// TODO: replace with real team member full names, titles, and photos
const TEAM = [
  { name: "Angel", title: "Design Director" },
  { name: "Louise", title: "Interior Designer" },
  { name: "Henson", title: "Principal Architect" },
  { name: "Harris", title: "Project Manager" },
  { name: "Jeriel", title: "Senior Architect" },
] as const

// Curve: edges highest, center lowest — offset shrinks toward the middle
const LIFT_CLASSES = ["lg:mb-24", "lg:mb-12", "lg:mb-0", "lg:mb-12", "lg:mb-24"]

export function AboutTeam() {
  return (
    <section
      id="team"
      data-slot="about-team"
      data-navbar-theme="light"
      className="bg-background relative z-10 pt-40 pb-24 lg:pt-56 lg:pb-36"
    >
      <div className="mx-auto max-w-400 px-6 text-center lg:px-16 xl:px-24">
        <h2 className="text-6xl font-semibold tracking-wide text-balance lg:text-8xl">
          Our Team
        </h2>
      </div>

      <div className="mt-16 mr-[calc(50%-50vw)] ml-[calc(50%-50vw)] w-screen px-3 lg:mt-24 lg:px-6">
        <div className="grid grid-cols-6 gap-x-2 gap-y-8 sm:gap-x-3 sm:gap-y-10 lg:flex lg:items-end lg:gap-4">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`col-span-2 min-w-0 ${i === 3 ? "col-start-2" : ""} lg:col-auto lg:flex-1 ${LIFT_CLASSES[i]}`}
            >
              <div className="bg-muted group relative z-0 flex aspect-3/4 items-center justify-center overflow-hidden transition-all duration-500 ease-out hover:z-20 hover:-translate-y-6 hover:scale-115 hover:shadow-2xl">
                <User className="text-muted-foreground/40 size-1/3" strokeWidth={1} />
              </div>
              <div className="mt-3 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                <p className="font-serif text-sm sm:text-base lg:text-xl">{member.name}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
