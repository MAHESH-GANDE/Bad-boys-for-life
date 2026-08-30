import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type { SearchFilters } from "./search";
import { tokenizeQuery } from "./search";

export const productCardInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { include: { inventory: true }, where: { active: true } },
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof productCardInclude }>;

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function listProducts(filters: SearchFilters = {}) {
  const tokens = filters.q ? tokenizeQuery(filters.q) : [];
  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.collection
      ? { collections: { some: { collection: { slug: filters.collection } } } }
      : {}),
    ...(filters.fit?.length ? { fit: { in: filters.fit } } : {}),
    ...(filters.fabric?.length ? { fabric: { in: filters.fabric } } : {}),
    ...(filters.pattern?.length ? { pattern: { in: filters.pattern } } : {}),
    ...(filters.neck?.length ? { neck: { in: filters.neck } } : {}),
    ...(filters.sleeve?.length ? { sleeve: { in: filters.sleeve } } : {}),
    ...(tokens.length
      ? {
          AND: tokens.map((t) => ({
            OR: [
              { name: { contains: t, mode: "insensitive" } },
              { sku: { contains: t, mode: "insensitive" } },
              { fit: { contains: t, mode: "insensitive" } },
              { shortDescription: { contains: t, mode: "insensitive" } },
              { category: { name: { contains: t, mode: "insensitive" } } },
              { variants: { some: { colour: { contains: t, mode: "insensitive" } } } },
            ],
          })),
        }
      : {}),
    ...(filters.colour?.length
      ? { variants: { some: { colour: { in: filters.colour } } } }
      : {}),
    ...(filters.size?.length ? { variants: { some: { size: { in: filters.size } } } } : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          variants: {
            some: {
              price: {
                gte: filters.minPrice,
                lte: filters.maxPrice,
              },
            },
          },
        }
      : {}),
    ...(filters.availability === "in-stock"
      ? { variants: { some: { inventory: { available: { gt: 0 } } } } }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "newest"
      ? { createdAt: "desc" }
      : filters.sort === "bestselling"
        ? { soldCount: "desc" }
        : filters.sort === "rating"
          ? { ratingAvg: "desc" }
          : { isBestseller: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: productCardInclude,
    orderBy,
  });

  const priced = products.map((p) => {
    const min = Math.min(...p.variants.map((v) => v.price));
    return { ...p, minPrice: min };
  });

  if (filters.sort === "price-asc") priced.sort((a, b) => a.minPrice - b.minPrice);
  if (filters.sort === "price-desc") priced.sort((a, b) => b.minPrice - a.minPrice);
  return serialize(priced);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    include: {
      ...productCardInclude,
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 20, include: { user: true } },
    },
  });
  return serialize(product);
}
