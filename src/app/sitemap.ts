import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:43123";
  const products = await prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  const cats = await prisma.category.findMany({ select: { slug: true } });
  const cols = await prisma.collection.findMany({ select: { slug: true } });
  const staticPaths = [
    "",
    "/shop",
    "/new-arrivals",
    "/bestsellers",
    "/sale",
    "/collections",
    "/about",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p || "/"}`, changeFrequency: "daily" as const })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt })),
    ...cats.map((c) => ({ url: `${base}/category/${c.slug}` })),
    ...cols.map((c) => ({ url: `${base}/collections/${c.slug}` })),
  ];
}
