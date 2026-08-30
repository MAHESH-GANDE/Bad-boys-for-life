import type { Prisma } from "@prisma/client";
import { Prisma as PrismaRuntime } from "@prisma/client";
import { prisma } from "./db";
import type { SearchFilters } from "./search";
import { tokenizeQuery } from "./search";

export const productCardInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { include: { inventory: true }, where: { active: true } },
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof productCardInclude }>;

/** Strip Prisma Decimal/Date values so client components can receive props safely. */
export function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => {
      if (v instanceof PrismaRuntime.Decimal) return v.toNumber();
      if (v instanceof Date) return v.toISOString();
      return v;
    }),
  );
}

export async function listProducts(filters: SearchFilters = {}) {
  const tokens = filters.q ? tokenizeQuery(filters.q) : [];

  const variantClauses: Prisma.ProductVariantWhereInput[] = [];
  if (filters.colour?.length) variantClauses.push({ colour: { in: filters.colour } });
  if (filters.size?.length) variantClauses.push({ size: { in: filters.size } });
  if (filters.minPrice != null || filters.maxPrice != null) {
    variantClauses.push({
      price: {
        ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
      },
    });
  }
  if (filters.availability === "in-stock") {
    variantClauses.push({ inventory: { available: { gt: 0 } } });
  }

  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(filters.isNew ? { isNew: true } : {}),
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
    ...(variantClauses.length === 1
      ? { variants: { some: variantClauses[0] } }
      : variantClauses.length > 1
        ? { variants: { some: { AND: variantClauses } } }
        : {}),
  };

  // Prisma cannot compare two columns in `some`; filter on-sale products after fetch.
  const needsSaleFilter = filters.onSale;

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

  const filtered = needsSaleFilter
    ? products.filter((p) => p.variants.some((v) => Number(v.mrp) > Number(v.price)))
    : products;

  const priced = filtered.map((p) => {
    const prices = p.variants.map((v) => Number(v.price));
    const min = prices.length ? Math.min(...prices) : 0;
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
