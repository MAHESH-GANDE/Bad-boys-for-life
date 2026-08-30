import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { Suspense } from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) notFound();
  const filters = parseCatalogParams(await searchParams);
  return (
    <Suspense>
      <CatalogListing title={cat.name.toUpperCase()} filters={{ ...filters, category: slug }} />
    </Suspense>
  );
}
