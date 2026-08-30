/** Category-aware product photos — tops never use bottom images for the same colour. */
const tee = "/images/product-oversized-tee.jpg";
const white = "/images/product-white-tee.jpg";
const cargo = "/images/product-cargo.jpg";
const trouser = "/images/product-trouser.jpg";
const denim = "/images/product-denim.jpg";
const shirt = "/images/product-shirt.jpg";
const hoodie = "/images/product-hoodie.jpg";
const coord = "/images/product-coord.jpg";
const varsity = "/images/product-varsity.jpg";
const parachute = "/images/product-parachute.jpg";
const bomber = "/images/product-bomber.jpg";
const denimJ = "/images/product-denim-jacket.jpg";
const red = "/images/product-red-tee.jpg";

type Garment = "tops" | "bottoms" | "outerwear" | "shirts" | "sets" | "hoodies";

const TOP_IMAGES: Record<string, string> = {
  Ecru: white,
  Chalk: white,
  "Pitch Black": tee,
  "Washed Charcoal": tee,
  "Heather Grey": hoodie,
  Sand: white,
  "Warm Taupe": hoodie,
  Olive: tee,
  Sage: hoodie,
  Terracotta: red,
  Cobalt: tee,
  "Dusty Rose": white,
  "Washed Mint": white,
  "Ink Navy": shirt,
  Mocha: varsity,
  Camel: bomber,
  Stone: tee,
  "Slate Grey": tee,
};

const BOTTOM_IMAGES: Record<string, string> = {
  Olive: cargo,
  Sage: parachute,
  "Pitch Black": denim,
  "Washed Charcoal": denim,
  "Slate Grey": denim,
  Stone: trouser,
  "Warm Taupe": trouser,
  "Ink Navy": denim,
  Ecru: denim,
  Sand: coord,
  Camel: trouser,
};

const OUTERWEAR_IMAGES: Record<string, string> = {
  "Ink Navy": bomber,
  "Washed Charcoal": denimJ,
  Olive: bomber,
  Mocha: varsity,
  Camel: varsity,
  "Pitch Black": bomber,
  "Heather Grey": hoodie,
  Sage: bomber,
};

const SHIRT_IMAGES: Record<string, string> = {
  Sand: shirt,
  "Dusty Rose": white,
  "Ink Navy": denimJ,
  Olive: shirt,
  Sage: shirt,
  Ecru: white,
  Chalk: white,
  "Pitch Black": shirt,
  "Washed Charcoal": shirt,
  Cobalt: white,
  Terracotta: red,
  "Washed Mint": white,
};

const SET_IMAGES: Record<string, string> = {
  Sand: coord,
  Ecru: white,
};

const HOODIE_IMAGES: Record<string, string> = {
  "Heather Grey": hoodie,
  "Pitch Black": tee,
  Olive: hoodie,
  Sage: hoodie,
};

export function garmentType(category: string): Garment {
  if (["t-shirts", "polos", "sweatshirts"].includes(category)) return "tops";
  if (["jeans", "trousers", "cargos"].includes(category)) return "bottoms";
  if (category === "jackets") return "outerwear";
  if (category === "shirts") return "shirts";
  if (category === "co-ords") return "sets";
  if (category === "hoodies") return "hoodies";
  return "tops";
}

export function imageForColour(name: string, category: string, override?: string) {
  if (override) return override;
  const type = garmentType(category);
  const map =
    type === "bottoms"
      ? BOTTOM_IMAGES
      : type === "outerwear"
        ? OUTERWEAR_IMAGES
        : type === "shirts"
          ? SHIRT_IMAGES
          : type === "sets"
            ? SET_IMAGES
            : type === "hoodies"
              ? HOODIE_IMAGES
              : TOP_IMAGES;
  return map[name] ?? (type === "bottoms" ? trouser : type === "outerwear" ? bomber : tee);
}

export function canonicalImageForColour(name: string, fallback = tee) {
  return TOP_IMAGES[name] ?? fallback;
}
