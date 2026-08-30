"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sorts = [
  ["recommended", "Recommended"],
  ["newest", "Newest"],
  ["bestselling", "Bestselling"],
  ["price-asc", "Price Low → High"],
  ["price-desc", "Price High → Low"],
  ["rating", "Rating"],
] as const;

export function CatalogToolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") || "recommended";

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    router.push(`?${next.toString()}`);
  }

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`?${next.toString()}`);
  }

  return (
    <div className="my-8 flex flex-col gap-4 border-y border-bb-off/15 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs tracking-[0.16em] text-bb-off/50">{count} PIECES</p>
      <div className="flex flex-wrap gap-3 text-xs">
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={params.get("size") || ""}
          onChange={(e) => setFilter("size", e.target.value)}
        >
          <option value="">Size</option>
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={params.get("colour") || ""}
          onChange={(e) => setFilter("colour", e.target.value)}
        >
          <option value="">Colour</option>
          {["Black", "Off-White", "White", "Blood", "Charcoal"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={params.get("fit") || ""}
          onChange={(e) => setFilter("fit", e.target.value)}
        >
          <option value="">Fit</option>
          {["Oversized", "Regular", "Relaxed", "Slim"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sorts.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

