import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { brandColors, colorFilterName } from "@/lib/colors";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ColorCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const color = brandColors.find((c) => c.slug === slug);
  if (!color) notFound();
  const filters = parseCatalogParams(await searchParams);
  return (
    <Suspense>
      <CatalogListing
        title={`${color.name.toUpperCase()} COLLECTION`}
        filters={{ ...filters, colour: [colorFilterName(slug)] }}
      />
    </Suspense>
  );
}
