import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { ProductDetail } from "@/components/store/product-detail";
import { prisma } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Product" };
  return {
    title: p.seoTitle || p.name,
    description: p.seoDescription || p.shortDescription,
    openGraph: {
      title: p.name,
      description: `${p.shortDescription} · ₹${Math.min(...p.variants.map((v) => v.price))}`,
      images: p.images[0] ? [p.images[0].url] : [],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const sp = await searchParams;
  const colourSlug = typeof sp.colour === "string" ? sp.colour : sp.colour?.[0];
  const related = (await listProducts({ category: product.category.slug })).filter((x) => x.id !== product.id).slice(0, 4);
  const sizeGuide = await prisma.sizeGuide.findFirst({
    where: {
      categoryKey: ["t-shirts", "shirts", "jackets"].includes(product.category.slug)
        ? product.category.slug
        : "bottomwear",
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "BADBOYS" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...product.variants.map((v) => v.price)),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      availability: product.variants.some((v) => (v.inventory?.available ?? 0) > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} sizeGuide={sizeGuide} initialColourSlug={colourSlug} />
      <section className="mt-20">
        <h2 className="mb-8 font-display text-3xl tracking-[0.14em]">YOU MAY ALSO LIKE</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
