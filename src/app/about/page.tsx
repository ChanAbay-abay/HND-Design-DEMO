import { SiteNavbar } from "../_sections/site-navbar"
import { AboutStatement } from "./_sections/statement"
import { AboutMissionVision } from "./_sections/mission-vision"
import { AboutShowcase } from "./_sections/showcase"
import { AboutTeam } from "./_sections/team"
import { SiteFooter } from "../_sections/footer"

export default function AboutPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <AboutStatement />
        <AboutMissionVision />
        <AboutShowcase />
        <AboutTeam />
      </main>
      <SiteFooter />
    </>
  )
}
