export type SearchFilters = {
  q?: string;
  category?: string;
  collection?: string;
  colour?: string[];
  size?: string[];
  fit?: string[];
  fabric?: string[];
  pattern?: string[];
  neck?: string[];
  sleeve?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: "in-stock" | "all";
  sort?: "recommended" | "newest" | "bestselling" | "price-asc" | "price-desc" | "rating";
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

export function parseCatalogParams(sp: Record<string, string | string[] | undefined>) {
  const g = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const split = (k: string) => (g(k) ? g(k)!.split(",") : undefined);
  return {
    q: g("q"),
    sort: (g("sort") as SearchFilters["sort"]) || "recommended",
    size: split("size"),
    colour: split("colour"),
    fit: split("fit"),
    fabric: split("fabric"),
  };
}
