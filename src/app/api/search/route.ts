import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { listProducts } from "@/lib/catalog";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  if (q.length < 2) {
    return NextResponse.json({ products: [], categories: [], trending: ["oversized tee", "cargo", "hoodie"] });
  }
  const products = (await listProducts({ q })).slice(0, 6);
  const categories = await prisma.category.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 5,
  });
  return NextResponse.json({
    products: products.map((p) => ({ name: p.name, slug: p.slug })),
    categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
    trending: ["black oversized t-shirt", "cargo", "varsity"],
  });
}
