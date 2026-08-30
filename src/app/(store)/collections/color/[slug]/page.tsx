import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { brandColors, colorFilterName, resolveColorSlug } from "@/lib/colors";
import { ColorCollectionHero } from "@/components/store/color-collection-hero";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ColorCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolved = resolveColorSlug(slug);
  if (resolved !== slug) {
    redirect(`/collections/color/${resolved}`);
  }
  const color = brandColors.find((c) => c.slug === resolved);
  if (!color) notFound();
  const filters = parseCatalogParams(await searchParams);
  return (
    <Suspense>
      <ColorCollectionHero color={color} />
      <CatalogListing
        title={`${color.name.toUpperCase()} COLLECTION`}
        filters={{ ...filters, colour: [colorFilterName(resolved)] }}
      />
    </Suspense>
  );
}
