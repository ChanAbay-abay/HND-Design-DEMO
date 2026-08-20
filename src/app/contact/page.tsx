import { SiteNavbar } from "../_sections/site-navbar"
import { SiteFooter } from "../_sections/footer"
import { ContactHero } from "./_sections/hero"
import { ContactDetails } from "./_sections/details"
import { ContactParallax } from "./_sections/parallax"
import { ContactAddress } from "./_sections/address"

export default function ContactPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <ContactHero />
        <ContactDetails />
        <ContactParallax />
        <ContactAddress />
      </main>
      <SiteFooter />
    </>
  )
}
