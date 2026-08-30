import { brandColors } from "./colors";
import { colourNameFromSlug } from "./product-colours";
import { shopFitFilters } from "./fits";

export type SearchFilters = {
  q?: string;
  sort?: "recommended" | "newest" | "price-asc" | "price-desc" | "bestselling" | "rating";
  category?: string;
  collection?: string;
  size?: string[];
  colour?: string[];
  fit?: string[];
  fabric?: string[];
  pattern?: string[];
  neck?: string[];
  sleeve?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: "in-stock";
  isNew?: boolean;
  onSale?: boolean;
};

export function tokenizeQuery(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Architecture seam for Algolia / Elasticsearch. */
export const searchProvider = {
  engine: "postgres" as "postgres" | "algolia" | "elasticsearch",
};

/** Map URL colour slugs / legacy names to DB variant colour names. */
export function normalizeColourParams(values?: string[]) {
  if (!values?.length) return undefined;
  const names = brandColors.map((c) => c.name);
  return [
    ...new Set(
      values.map((raw) => {
        const trimmed = raw.trim();
        const byName = names.find((n) => n.toLowerCase() === trimmed.toLowerCase());
        if (byName) return byName;
        return colourNameFromSlug(trimmed.toLowerCase());
      }),
    ),
  ];
}

export function parseCatalogParams(sp: Record<string, string | string[] | undefined>): SearchFilters {
  const g = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const split = (k: string) => (g(k) ? g(k)!.split(",") : undefined);
  const num = (k: string) => {
    const v = g(k);
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const normalizeFit = (values?: string[]) => {
    if (!values?.length) return undefined;
    const canonical = shopFitFilters.map((f) => f.toLowerCase());
    return [
      ...new Set(
        values.map((raw) => {
          const idx = canonical.indexOf(raw.trim().toLowerCase());
          return idx >= 0 ? shopFitFilters[idx] : raw.trim();
        }),
      ),
    ];
  };

  return {
    q: g("q"),
    sort: (g("sort") as SearchFilters["sort"]) || "recommended",
    category: g("category"),
    size: split("size"),
    colour: normalizeColourParams(split("colour")),
    fit: normalizeFit(split("fit")),
    fabric: split("fabric"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    availability: g("availability") === "in-stock" ? "in-stock" : undefined,
  };
}
