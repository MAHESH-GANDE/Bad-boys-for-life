import { CatalogListing } from "@/components/store/catalog-listing";
import { ColorFilterBar } from "@/components/store/color-filter-bar";
import { parseCatalogParams } from "@/lib/search";
import { Suspense } from "react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogParams(sp);
  const colour = filters.colour?.[0];
  const fit = filters.fit?.[0];
  const title = fit
    ? `${fit.toUpperCase()} FIT`
    : colour
      ? `${colour.toUpperCase()}`
      : "ALL PRODUCTS";
  return (
    <Suspense>
      <ColorFilterBar compact />
      <CatalogListing title={title} filters={filters} />
    </Suspense>
  );
}
