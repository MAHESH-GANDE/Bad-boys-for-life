import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { brandColors, colorFilterName } from "@/lib/colors";
import { ColorCollectionHero } from "@/components/store/color-collection-hero";
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
      <ColorCollectionHero color={color} />
      <CatalogListing
        title={`${color.name.toUpperCase()} EDIT`}
        filters={{ ...filters, colour: [colorFilterName(slug)] }}
      />
    </Suspense>
  );
}
