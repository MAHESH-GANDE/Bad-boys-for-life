import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { Suspense } from "react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogParams(sp);
  return (
    <Suspense>
      <CatalogListing title="ALL PRODUCTS" filters={filters} />
    </Suspense>
  );
}
