export type BrandColor = {
  name: string;
  slug: string;
  hex: string;
  tagline: string;
  image: string;
};

export const brandColors: BrandColor[] = [
  {
    name: "Black",
    slug: "black",
    hex: "#111111",
    tagline: "The core uniform.",
    image: "/images/hero-menswear.jpg",
  },
  {
    name: "Off-White",
    slug: "off-white",
    hex: "#F4F1EA",
    tagline: "Clean contrast.",
    image: "/images/product-white-tee.jpg",
  },
  {
    name: "White",
    slug: "white",
    hex: "#FFFFFF",
    tagline: "Pure essentials.",
    image: "/images/product-white-tee.jpg",
  },
  {
    name: "Blood",
    slug: "blood",
    hex: "#8B1E1E",
    tagline: "Deep red drop.",
    image: "/images/product-red-tee.jpg",
  },
  {
    name: "Charcoal",
    slug: "charcoal",
    hex: "#2B2B2B",
    tagline: "Soft black alternative.",
    image: "/images/product-trouser.jpg",
  },
];

export function colorBySlug(slug: string) {
  return brandColors.find((c) => c.slug === slug);
}

export function colorFilterName(slug: string) {
  return colorBySlug(slug)?.name ?? slug.replace(/-/g, " ");
}
