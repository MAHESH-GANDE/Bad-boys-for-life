export type BrandColor = {
  name: string;
  slug: string;
  hex: string;
  tagline: string;
  image: string;
};

/** Equal-weight colour collections — black is not first. */
export const brandColors: BrandColor[] = [
  {
    name: "Off-White",
    slug: "off-white",
    hex: "#F4F1EA",
    tagline: "Clean essentials.",
    image: "/images/product-white-tee.jpg",
  },
  {
    name: "White",
    slug: "white",
    hex: "#FFFFFF",
    tagline: "Pure cotton tones.",
    image: "/images/product-white-tee.jpg",
  },
  {
    name: "Blood",
    slug: "blood",
    hex: "#8B1E1E",
    tagline: "Deep red edit.",
    image: "/images/product-red-tee.jpg",
  },
  {
    name: "Charcoal",
    slug: "charcoal",
    hex: "#2B2B2B",
    tagline: "Soft neutral grey.",
    image: "/images/product-trouser.jpg",
  },
  {
    name: "Black",
    slug: "black",
    hex: "#111111",
    tagline: "Matte dark pieces.",
    image: "/images/product-oversized-tee.jpg",
  },
];

export function colorBySlug(slug: string) {
  return brandColors.find((c) => c.slug === slug);
}

export function colorFilterName(slug: string) {
  return colorBySlug(slug)?.name ?? slug.replace(/-/g, " ");
}

export function sortColourEntries<T extends [string, string]>(entries: T[]) {
  const order = brandColors.map((c) => c.name);
  return [...entries].sort((a, b) => {
    const ai = order.indexOf(a[0]);
    const bi = order.indexOf(b[0]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
