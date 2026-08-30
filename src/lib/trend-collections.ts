export type TrendCollection = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  accent?: "red" | "yellow";
};

export const trendCollections: TrendCollection[] = [
  {
    slug: "new-drop",
    title: "NEW IN",
    subtitle: "Latest arrivals across every colour.",
    image: "/images/look-night-out.jpg",
    href: "/new-arrivals",
    accent: "yellow",
  },
  {
    slug: "streetwear",
    title: "STREETWEAR",
    subtitle: "Oversized fits. Multiple shades.",
    image: "/images/campaign-night.jpg",
    href: "/collections/streetwear",
  },
  {
    slug: "essentials",
    title: "ESSENTIALS",
    subtitle: "Daily pieces in every colourway.",
    image: "/images/editorial-still.jpg",
    href: "/collections/essentials",
  },
  {
    slug: "limited-edition",
    title: "LIMITED EDITION",
    subtitle: "Small runs. No restocks.",
    image: "/images/product-varsity.jpg",
    href: "/collections/limited-edition",
    accent: "red",
  },
  {
    slug: "bestsellers",
    title: "BEST SELLERS",
    subtitle: "Most wanted — all colours.",
    image: "/images/product-coord.jpg",
    href: "/bestsellers",
  },
  {
    slug: "winter",
    title: "WINTER",
    subtitle: "Hoodies and jackets.",
    image: "/images/product-hoodie.jpg",
    href: "/collections/winter",
  },
];
