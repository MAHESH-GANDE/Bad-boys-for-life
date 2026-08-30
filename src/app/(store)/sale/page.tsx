import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCatalogParams(await searchParams);
  const sale = await prisma.collection.findUnique({ where: { slug: "sale" } });
  return (
    <Suspense>
      <CatalogListing
        title="SALE"
        filters={{ ...filters, collection: sale?.slug || "sale" }}
      />
    </Suspense>
  );
}
