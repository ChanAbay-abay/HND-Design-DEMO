import { notFound } from "next/navigation"
import { SiteNavbar } from "../../_sections/site-navbar"
import { HOUSES, getHouseBySlug } from "../_data/houses"
import { HouseHero } from "./_sections/house-hero"
import { HouseInfo } from "./_sections/house-info"
import { HouseGallery } from "./_sections/house-gallery"
import { SiteFooter } from "../../_sections/footer"

export function generateStaticParams() {
  return HOUSES.map((house) => ({ slug: house.slug }))
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const house = getHouseBySlug(slug)
  if (!house) notFound()

  return (
    <>
      <SiteNavbar />
      <main>
        <HouseHero house={house} />
        <HouseInfo house={house} />
        <HouseGallery house={house} />
      </main>
      <SiteFooter />
    </>
  )
}
