"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { brandColors } from "@/lib/colors";
import { shopFitFilters } from "@/lib/fits";

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
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = params.get("sort") || "recommended";

  function pushParams(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    pushParams(next);
  }

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());

    if (key === "colour") {
      next.delete("colour");
      if (value) {
        router.push(`/collections/color/${value}${next.size ? `?${next.toString()}` : ""}`);
        router.refresh();
        return;
      }
      router.push(next.size ? `/shop?${next.toString()}` : "/shop");
      router.refresh();
      return;
    }

    if (value) next.set(key, value);
    else next.delete(key);
    pushParams(next);
  }

  const activeColour =
    params.get("colour") ||
    (pathname.startsWith("/collections/color/")
      ? pathname.replace("/collections/color/", "").split("/")[0]
      : "");

  return (
    <div className="my-8 flex flex-col gap-4 border-y border-bb-off/15 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs tracking-[0.16em] text-bb-off/50">{count} PIECES</p>
      <div className="flex flex-wrap gap-3 text-xs">
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={params.get("size") || ""}
          onChange={(e) => setFilter("size", e.target.value)}
          aria-label="Filter by size"
        >
          <option value="">Size</option>
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={activeColour}
          onChange={(e) => setFilter("colour", e.target.value)}
          aria-label="Filter by colour"
        >
          <option value="">Colour</option>
          {brandColors.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={params.get("fit") || ""}
          onChange={(e) => setFilter("fit", e.target.value)}
          aria-label="Filter by fit"
        >
          <option value="">Fit</option>
          {shopFitFilters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="border border-bb-off/20 bg-bb-black px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
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
