export type ColorTier = "core" | "earth" | "accent";

export type BrandColor = {
  name: string;
  slug: string;
  hex: string;
  tagline: string;
  image: string;
  tier: ColorTier;
  stockShare: string;
};

/** Muted, low-saturation palette — quiet luxury, no glossy brights. */
export const brandColors: BrandColor[] = [
  // Core neutrals (~60%)
  { name: "Ecru", slug: "ecru", hex: "#E8E4DC", tagline: "Soft cream base.", image: "/images/product-white-tee.jpg", tier: "core", stockShare: "Core" },
  { name: "Chalk", slug: "chalk", hex: "#F0EDE8", tagline: "Matte off-white.", image: "/images/product-white-tee.jpg", tier: "core", stockShare: "Core" },
  { name: "Pitch Black", slug: "pitch-black", hex: "#0D0D0D", tagline: "Deep matte black.", image: "/images/product-oversized-tee.jpg", tier: "core", stockShare: "Core" },
  { name: "Washed Charcoal", slug: "washed-charcoal", hex: "#3A3A3A", tagline: "Vintage washed grey.", image: "/images/product-trouser.jpg", tier: "core", stockShare: "Core" },
  { name: "Heather Grey", slug: "heather-grey", hex: "#8B8F94", tagline: "Cool heather knit.", image: "/images/product-hoodie.jpg", tier: "core", stockShare: "Core" },
  { name: "Slate Grey", slug: "slate-grey", hex: "#5C6268", tagline: "Industrial slate.", image: "/images/product-trouser.jpg", tier: "core", stockShare: "Core" },
  { name: "Sand", slug: "sand", hex: "#C4B59A", tagline: "Warm summer neutral.", image: "/images/product-coord.jpg", tier: "core", stockShare: "Core" },
  { name: "Warm Taupe", slug: "warm-taupe", hex: "#A69485", tagline: "Linen foundation.", image: "/images/product-coord.jpg", tier: "core", stockShare: "Core" },
  // Earth & mineral (~25%)
  { name: "Olive", slug: "olive", hex: "#4A5239", tagline: "Army utility tone.", image: "/images/product-shirt.jpg", tier: "earth", stockShare: "Earth" },
  { name: "Sage", slug: "sage", hex: "#8A9487", tagline: "Muted green.", image: "/images/product-hoodie.jpg", tier: "earth", stockShare: "Earth" },
  { name: "Mocha", slug: "mocha", hex: "#6B5344", tagline: "Chocolate brown.", image: "/images/product-varsity.jpg", tier: "earth", stockShare: "Earth" },
  { name: "Camel", slug: "camel", hex: "#B8956B", tagline: "Knit & suede tone.", image: "/images/product-varsity.jpg", tier: "earth", stockShare: "Earth" },
  { name: "Stone", slug: "stone", hex: "#A39E93", tagline: "Dusty khaki.", image: "/images/product-trouser.jpg", tier: "earth", stockShare: "Earth" },
  { name: "Ink Navy", slug: "ink-navy", hex: "#1B2432", tagline: "Evening smart-casual.", image: "/images/product-denim-jacket.jpg", tier: "earth", stockShare: "Earth" },
  // Muted accents (~15%)
  { name: "Terracotta", slug: "terracotta", hex: "#A65D48", tagline: "Burnt earth pop.", image: "/images/product-red-tee.jpg", tier: "accent", stockShare: "Accent" },
  { name: "Cobalt", slug: "cobalt", hex: "#2E4A7A", tagline: "Statement blue.", image: "/images/product-oversized-tee.jpg", tier: "accent", stockShare: "Accent" },
  { name: "Dusty Rose", slug: "dusty-rose", hex: "#A87B7E", tagline: "Muted summer rose.", image: "/images/product-white-tee.jpg", tier: "accent", stockShare: "Accent" },
  { name: "Washed Mint", slug: "washed-mint", hex: "#A8B8AD", tagline: "Pastel sage wash.", image: "/images/product-white-tee.jpg", tier: "accent", stockShare: "Accent" },
];

export const colorTiers: { id: ColorTier; label: string; share: string; blurb: string }[] = [
  { id: "core", label: "Core Neutrals", share: "60%", blurb: "Ecru, charcoal, sand — the daily uniform." },
  { id: "earth", label: "Earth & Mineral", share: "25%", blurb: "Olive, mocha, ink navy — quiet depth." },
  { id: "accent", label: "Muted Accents", share: "15%", blurb: "Terracotta, cobalt, dusty rose — seasonal pop." },
];

export function colorsByTier(tier: ColorTier) {
  return brandColors.filter((c) => c.tier === tier);
}

export function colorBySlug(slug: string) {
  return brandColors.find((c) => c.slug === slug);
}

/** Legacy colour URLs from earlier catalog versions. */
export const legacyColorSlugs: Record<string, string> = {
  black: "pitch-black",
  "off-white": "ecru",
  white: "chalk",
  blood: "terracotta",
  charcoal: "washed-charcoal",
  red: "terracotta",
  grey: "heather-grey",
  gray: "heather-grey",
  navy: "ink-navy",
};

export function resolveColorSlug(slug: string) {
  return legacyColorSlugs[slug] ?? slug;
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

/** Relative luminance — pick readable text on a colour swatch background. */
export function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58;
}

export function colorTextClass(hex: string) {
  return isLightColor(hex) ? "text-bb-black" : "text-bb-off";
}

export function colorMutedTextClass(hex: string) {
  return isLightColor(hex) ? "text-bb-black/65" : "text-bb-off/70";
}

const PREVIEW_WHITE = "/images/product-white-tee.jpg";
const PREVIEW_DARK_TEE = "/images/product-oversized-tee.jpg";
const PREVIEW_RED_TEE = "/images/product-red-tee.jpg";

/** Neutral garment photo we tint to match the collection swatch (stock photos are not per-colour). */
export function colourPreviewBase(color: BrandColor) {
  switch (color.name) {
    case "Terracotta":
      return PREVIEW_RED_TEE;
    case "Cobalt":
    case "Ink Navy":
    case "Pitch Black":
    case "Washed Charcoal":
    case "Slate Grey":
    case "Heather Grey":
      return PREVIEW_DARK_TEE;
    case "Washed Mint":
    case "Dusty Rose":
    case "Ecru":
    case "Chalk":
    case "Sand":
    case "Warm Taupe":
    case "Sage":
    case "Stone":
    case "Olive":
      return PREVIEW_WHITE;
    default:
      return color.image;
  }
}

/** How strongly to tint the neutral base so it reads as the named colour. */
export function colourTintOpacity(color: BrandColor | { tier: ColorTier; name: string }) {
  if (color.tier === "accent") return 0.44;
  if (color.tier === "earth") return 0.3;
  return 0.18;
}

export function colourMetaByName(name: string) {
  return brandColors.find((c) => c.name === name);
}
