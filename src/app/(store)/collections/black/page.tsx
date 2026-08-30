import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { Suspense } from "react";

export default async function BlackCollectionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCatalogParams(await searchParams);
  return (
    <Suspense>
      <CatalogListing
        title="THE BLACK COLLECTION"
        filters={{ ...filters, colour: ["Black"] }}
      />
    </Suspense>
  );
}
