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
    slug: "black",
    title: "THE BLACK COLLECTION",
    subtitle: "Matte. Minimal. Built for the night.",
    image: "/images/hero-menswear.jpg",
    href: "/collections/black",
  },
  {
    slug: "new-drop",
    title: "NEW DROP",
    subtitle: "Fresh cuts. First access.",
    image: "/images/look-night-out.jpg",
    href: "/collections/new-drop",
    accent: "yellow",
  },
  {
    slug: "streetwear",
    title: "STREETWEAR",
    subtitle: "Oversized. Loud silhouette. Quiet colour.",
    image: "/images/campaign-night.jpg",
    href: "/collections/streetwear",
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
    slug: "essentials",
    title: "ESSENTIALS",
    subtitle: "Daily pieces. Premium weight.",
    image: "/images/editorial-still.jpg",
    href: "/collections/essentials",
  },
  {
    slug: "winter",
    title: "WINTER ARMOUR",
    subtitle: "Hoodies. Jackets. Heat without noise.",
    image: "/images/product-hoodie.jpg",
    href: "/collections/winter",
  },
];
