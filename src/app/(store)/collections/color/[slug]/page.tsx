import { CatalogListing } from "@/components/store/catalog-listing";
import { listProducts } from "@/lib/catalog";
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

  const colourName = colorFilterName(resolved);
  const filters = parseCatalogParams(await searchParams);
  const products = await listProducts({ ...filters, colour: [colourName] });

  return (
    <Suspense>
      <ColorCollectionHero color={color} productCount={products.length} />
      <CatalogListing
        title={`${color.name.toUpperCase()} COLLECTION`}
        filters={{ ...filters, colour: [colourName] }}
        highlightColour={colourName}
      />
    </Suspense>
  );
}
