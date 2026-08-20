export interface HousePhoto {
  src: string
  alt: string
  /** Intrinsic pixel dimensions — drives aspect ratio so renders scale, never crop. */
  width: number
  height: number
}

export interface HouseProject {
  slug: string
  name: string
  location: string
  area: string
  services: string[]
  description: string
  /** Always the project's `-1` render — also the cover shot used on the gallery wall. */
  hero: HousePhoto
  /** Every other render, in display order. Caps how many additional photos any
   *  house page can show — see HOUSE_PHOTO_CAP in `[slug]/_sections/house-gallery.tsx`. */
  photos: HousePhoto[]
}

export const HOUSES: HouseProject[] = [
  {
    slug: "marlow",
    name: "Marlow House",
    location: "Talamban, Cebu City",
    area: "420 sqm",
    services: ["Architecture", "Interior Design", "Construction"],
    description:
      "A two-storey family home built around a single idea: let the concrete, wood, and glass speak for themselves. Deep overhangs hold the tropical sun back from full-height glazing, while a marble-clad stair core anchors the plan and carries natural light down through every level.",
    hero: {
      src: "/images/renders/marlow-1.jpg",
      alt: "Marlow House — street-facing exterior at dusk",
      width: 1920,
      height: 1080,
    },
    photos: [
      {
        src: "/images/renders/marlow-01.jpg",
        alt: "Marlow House — living and dining area beneath the stair",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-2.jpg",
        alt: "Marlow House — marble-clad staircase detail",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-4.jpg",
        alt: "Marlow House — built-in wardrobe and dressing area",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-5.jpg",
        alt: "Marlow House — primary bedroom with wood-panelled headboard",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-6.jpg",
        alt: "Marlow House — guest bedroom with garden views",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-7.jpg",
        alt: "Marlow House — bedroom with private terrace access",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/marlow-8.jpg",
        alt: "Marlow House — primary suite hallway",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    slug: "halden",
    name: "Halden House",
    location: "Maria Luisa Estate Park, Cebu City",
    area: "380 sqm",
    services: ["Architecture", "Interior Design"],
    description:
      "A courtyard-organized residence that trades a single grand facade for a sequence of framed views. Board-formed concrete and dark timber wrap a central garden void, so every principal room borrows light and greenery from the middle of the plan rather than the street.",
    hero: {
      src: "/images/renders/halden-1.jpg",
      alt: "Halden House — courtyard-facing exterior",
      width: 1920,
      height: 1080,
    },
    photos: [
      {
        src: "/images/renders/halden-2.jpg",
        alt: "Halden House — living space opening onto the courtyard",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/halden-3.jpg",
        alt: "Halden House — kitchen and dining pavilion",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/halden-4.jpg",
        alt: "Halden House — covered walkway along the garden void",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/halden-5.jpg",
        alt: "Halden House — primary bedroom with courtyard outlook",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/halden-7.jpg",
        alt: "Halden House — bathroom with board-formed concrete walls",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/halden-8.jpg",
        alt: "Halden House — evening view across the courtyard pool",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    slug: "sorrel",
    name: "Sorrel House",
    location: "Busay, Cebu City",
    area: "310 sqm",
    services: ["Architecture", "Interior Design", "Construction"],
    description:
      "Set into a sloping hillside lot, Sorrel House steps down the site in three shallow terraces so every level opens onto its own garden edge and the city beyond. White render and timber louvers keep the massing quiet, letting the view do the talking.",
    hero: {
      src: "/images/renders/sorrel-1.jpg",
      alt: "Sorrel House — hillside exterior overlooking the city",
      width: 1920,
      height: 1080,
    },
    photos: [
      {
        src: "/images/renders/sorrel-01.jpg",
        alt: "Sorrel House — terraced facade at dusk",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/sorrel-2.jpg",
        alt: "Sorrel House — living room with full-height glazing",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/sorrel-3.jpg",
        alt: "Sorrel House — timber-louvered stair landing",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/sorrel-6.jpg",
        alt: "Sorrel House — primary bedroom terrace",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/sorrel-7.jpg",
        alt: "Sorrel House — lower-terrace garden view",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    slug: "vesper",
    name: "Vesper House",
    location: "Banilad, Cebu City",
    area: "295 sqm",
    services: ["Architecture", "Interior Design"],
    description:
      "A compact urban infill home that turns inward around a skylit stairwell to make up for a tight street frontage. Warm oak joinery and white walls keep the narrow plan feeling generous, while a rooftop deck reclaims the outdoor space the footprint can't offer.",
    hero: {
      src: "/images/renders/vesper-1.jpg",
      alt: "Vesper House — narrow street-facing facade",
      width: 1920,
      height: 1080,
    },
    photos: [
      {
        src: "/images/renders/vesper-2.jpg",
        alt: "Vesper House — skylit stairwell",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/vesper-3.jpg",
        alt: "Vesper House — living and kitchen area with oak joinery",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/vesper-4.jpg",
        alt: "Vesper House — primary bedroom",
        width: 1920,
        height: 1080,
      },
      {
        src: "/images/renders/vesper-5.jpg",
        alt: "Vesper House — rooftop deck at dusk",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    slug: "corvin",
    name: "Corvin House",
    location: "Talamban, Cebu City",
    area: "260 sqm",
    services: ["Architecture", "Construction"],
    description:
      "A single-storey house organized along one long axis, so the living spaces, courtyard, and bedroom wing read as a continuous sequence. Exposed concrete beams and a low-pitched roof keep the profile grounded against its garden setting.",
    hero: {
      src: "/images/renders/corvin-1.jpg",
      alt: "Corvin House — garden-facing exterior",
      width: 1363,
      height: 784,
    },
    photos: [
      {
        src: "/images/renders/corvin-2.jpg",
        alt: "Corvin House — living space with exposed concrete beams",
        width: 1363,
        height: 784,
      },
    ],
  },
  {
    slug: "auburn",
    name: "Auburn House",
    location: "Mabolo, Cebu City",
    area: "340 sqm",
    services: ["Architecture", "Interior Design", "Construction"],
    description:
      "A brick-and-timber family home built for a growing household, with a double-height living space at its core that ties the ground floor together and pulls light down from a clerestory above. Warm, textured materials soften the otherwise disciplined plan.",
    hero: {
      src: "/images/renders/auburn-1.jpg",
      alt: "Auburn House — brick and timber exterior",
      width: 1363,
      height: 784,
    },
    photos: [
      {
        src: "/images/renders/auburn-2.jpg",
        alt: "Auburn House — double-height living space",
        width: 1363,
        height: 784,
      },
    ],
  },
  {
    slug: "thistle",
    name: "Thistle House",
    location: "Lahug, Cebu City",
    area: "275 sqm",
    services: ["Architecture", "Interior Design"],
    description:
      "A quiet, boxy volume in whitewashed render, designed around a single deep-set terrace that shades the main living areas from the afternoon sun. Inside, a restrained material palette of white walls and pale timber keeps the focus on the terrace beyond.",
    hero: {
      src: "/images/renders/thistle-1.jpg",
      alt: "Thistle House — whitewashed exterior with shaded terrace",
      width: 1920,
      height: 1080,
    },
    photos: [
      {
        src: "/images/renders/thistle-2.jpg",
        alt: "Thistle House — living area opening onto the terrace",
        width: 1920,
        height: 1080,
      },
    ],
  },
]

export function getHouseBySlug(slug: string): HouseProject | undefined {
  return HOUSES.find((house) => house.slug === slug)
}

/** The largest additional-photo count of any house — see HOUSE_PHOTO_CAP. */
export const MAX_HOUSE_PHOTOS = Math.max(
  ...HOUSES.map((house) => house.photos.length)
)
