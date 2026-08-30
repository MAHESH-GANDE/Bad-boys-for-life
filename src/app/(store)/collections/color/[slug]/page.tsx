import { CatalogListing } from "@/components/store/catalog-listing";
import { listProducts } from "@/lib/catalog";
import { parseCatalogParams } from "@/lib/search";
import { brandColors, colorFilterName, resolveColorSlug } from "@/lib/colors";
import { ColorCollectionHero } from "@/components/store/color-collection-hero";
import { productImageForColour, productHasColour } from "@/lib/product-colours";
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
  const preview =
    products.find((p) => productHasColour(p, colourName)) ??
    products[0];
  const previewImage = preview ? productImageForColour(preview, colourName)?.url : color.image;

  return (
    <Suspense>
      <ColorCollectionHero color={color} previewImage={previewImage} productCount={products.length} />
      <CatalogListing
        title={`${color.name.toUpperCase()} COLLECTION`}
        filters={{ ...filters, colour: [colourName] }}
        highlightColour={colourName}
      />
    </Suspense>
  );
}
