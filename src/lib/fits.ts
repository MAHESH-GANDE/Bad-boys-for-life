export type FitModel = {
  name: string;
  slug: string;
  category: string;
  details: string;
  href: string;
};

export const fitModels: FitModel[] = [
  { name: "Boxy Heavyweight Tee", slug: "boxy", category: "T-Shirts", details: "240 GSM, dropped shoulder, rib crew.", href: "/shop?fit=Boxy" },
  { name: "Relaxed Graphic Tee", slug: "relaxed-graphic", category: "T-Shirts", details: "Vintage wash, minimal front type.", href: "/shop?fit=Relaxed" },
  { name: "Cuban Camp Shirt", slug: "cuban", category: "Shirts", details: "Open collar, boxy hem, linen blend.", href: "/shop?fit=Cuban" },
  { name: "Structured Overshirt", slug: "overshirt", category: "Shirts", details: "Heavy twill shacket, dual chest pockets.", href: "/shop?fit=Overshirt" },
  { name: "Knit Resort Polo", slug: "polo", category: "Polos", details: "Johnny collar, open-knit cotton.", href: "/shop?fit=Resort" },
  { name: "Baggy Denim", slug: "baggy-denim", category: "Jeans", details: "Wide leg, vintage wash, stacked hem.", href: "/shop?fit=Baggy" },
  { name: "Straight Denim", slug: "straight-denim", category: "Jeans", details: "Clean straight, raw hem.", href: "/shop?fit=Straight" },
  { name: "Pleated Relaxed Trouser", slug: "pleated", category: "Trousers", details: "Front pleat, wide drape leg.", href: "/shop?fit=Pleated" },
  { name: "Parachute Cargo", slug: "parachute", category: "Cargos", details: "6-pocket utility, ankle drawcord.", href: "/shop?fit=Parachute" },
  { name: "Co-ord Set", slug: "coord", category: "Sets", details: "Waffle knit matching top & bottom.", href: "/category/co-ords" },
  { name: "Minimal Hoodie", slug: "minimal-hoodie", category: "Hoodies", details: "French terry, clean drop shoulder.", href: "/shop?fit=Minimal" },
];
