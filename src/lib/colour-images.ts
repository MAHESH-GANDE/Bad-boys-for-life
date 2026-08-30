/** One distinct product photo per brand colour — used in seed + UI fallbacks. */
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

export const canonicalColourImages: Record<string, string> = {
  Ecru: white,
  Chalk: white,
  "Pitch Black": tee,
  "Washed Charcoal": denimJ,
  "Heather Grey": hoodie,
  "Slate Grey": denim,
  Sand: coord,
  "Warm Taupe": trouser,
  Olive: cargo,
  Sage: parachute,
  Mocha: varsity,
  Camel: bomber,
  Stone: trouser,
  "Ink Navy": denimJ,
  Terracotta: red,
  Cobalt: shirt,
  "Dusty Rose": shirt,
  "Washed Mint": white,
};

export function canonicalImageForColour(name: string, fallback = white) {
  return canonicalColourImages[name] ?? fallback;
}
