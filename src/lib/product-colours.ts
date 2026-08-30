import type { ProductCardData } from "@/lib/catalog";
import { brandColors, colorBySlug, resolveColorSlug } from "@/lib/colors";

type ProductImages = Pick<ProductCardData, "images">;
type ProductWithVariants = ProductImages & Pick<ProductCardData, "variants">;

export function productImageForColour(product: ProductImages, colourName: string) {
  const tagged = product.images.find((i) => i.colour === colourName);
  if (tagged) return tagged;
  return product.images.find((i) => !i.colour) ?? product.images[0] ?? null;
}

export function productHasColour(product: ProductWithVariants, colourName: string) {
  return product.variants.some((v) => v.colour === colourName);
}

export function colourSlugFromName(name: string) {
  return brandColors.find((c) => c.name === name)?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}

export function colourNameFromSlug(slug: string) {
  const resolved = resolveColorSlug(slug);
  return colorBySlug(resolved)?.name ?? slug.replace(/-/g, " ");
}

export function resolveProductColour(product: ProductWithVariants, colourSlug?: string | null) {
  const colours = [...new Map(product.variants.map((v) => [v.colour, v.colourHex])).entries()];
  if (!colourSlug) return colours[0]?.[0] ?? null;
  const name = colourNameFromSlug(colourSlug);
  if (colours.some(([n]) => n === name)) return name;
  return colours[0]?.[0] ?? null;
}

export function hexForColourName(name: string, fallback?: string) {
  return brandColors.find((c) => c.name === name)?.hex ?? fallback ?? "#888888";
}

/** @deprecated Collection cards use colourPreviewBase() — kept for optional tooling. */
export function colourPreviewImages(products: ProductCardData[]) {
  const map = new Map<string, string>();
  const garmentOrder = ["t-shirts", "shirts", "polos", "hoodies", "sweatshirts", "jackets", "jeans", "trousers", "cargos", "co-ords"];
  for (const color of brandColors) {
    const sorted = [...products].sort(
      (a, b) => garmentOrder.indexOf(a.category.slug) - garmentOrder.indexOf(b.category.slug),
    );
    const product = sorted.find((p) => productHasColour(p, color.name));
    if (!product) continue;
    const img = productImageForColour(product, color.name);
    if (img) map.set(color.slug, img.url);
  }
  return map;
}
