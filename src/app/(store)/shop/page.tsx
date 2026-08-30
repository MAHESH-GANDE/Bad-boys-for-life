import { CatalogListing } from "@/components/store/catalog-listing";
import { ColorFilterBar } from "@/components/store/color-filter-bar";
import { colorFilterName } from "@/lib/colors";
import { parseCatalogParams } from "@/lib/search";
import { Suspense } from "react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogParams(sp);
  const colourSlug = filters.colour?.[0] ? sp.colour : undefined;
  const rawColour = typeof colourSlug === "string" ? colourSlug : Array.isArray(colourSlug) ? colourSlug[0] : undefined;
  const colourName = rawColour ? colorFilterName(rawColour.split(",")[0]) : undefined;
  const fit = filters.fit?.[0];
  const title = fit
    ? `${fit.toUpperCase()} FIT`
    : colourName
      ? `${colourName.toUpperCase()}`
      : "ALL PRODUCTS";
  return (
    <Suspense>
      <ColorFilterBar compact />
      <CatalogListing title={title} filters={filters} />
    </Suspense>
  );
}
