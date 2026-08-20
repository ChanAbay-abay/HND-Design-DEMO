import { SiteNavbar } from "./_sections/site-navbar"
import { DemoHero } from "./_sections/hero"
import { DemoStatement } from "./_sections/statement"
import { DemoShowcase } from "./_sections/showcase"
import { DemoStudio } from "./_sections/studio"
import { DemoServices } from "./_sections/services"
import { DemoSketches } from "./_sections/sketches"
import { DemoGallery } from "./_sections/gallery"
import { SiteFooter } from "./_sections/footer"

export default function Home() {
  return (
    <>
      {/* ─── Navigation ─────────────────────────────────────────────────── */}
      <SiteNavbar />

      <main>
        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <div data-navbar-theme="light">
          <DemoHero />
        </div>
        <DemoStatement />
        <DemoShowcase />
        <DemoStudio />
        <DemoServices />
        <DemoSketches />
        <DemoGallery />
      </main>

      <SiteFooter />
    </>
  )
}
