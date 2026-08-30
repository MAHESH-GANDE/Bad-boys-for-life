import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { getAnonSessionId } from "@/lib/session-id";
import { productCardInclude, serialize } from "@/lib/catalog";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    const ids =
      new URL(req.url).searchParams
        .get("ids")
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) ?? [];
    if (!ids.length) return NextResponse.json({ items: [], products: [], guest: true });
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, published: true },
      include: productCardInclude,
    });
    return NextResponse.json({ items: [], products: serialize(products), guest: true });
  }
  const list = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: { items: true },
  });
  return NextResponse.json({ items: list?.items ?? [] });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required.", login: true }, { status: 401 });
  const parsed = z.object({ productId: z.string().uuid(), variantId: z.string().uuid().optional() }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid." }, { status: 400 });
  const wish = await prisma.wishlist.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  const existing = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wish.id, productId: parsed.data.productId, variantId: parsed.data.variantId ?? null },
  });
  if (!existing) {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wish.id,
        productId: parsed.data.productId,
        variantId: parsed.data.variantId,
      },
    });
  }
  await trackEvent({ name: "wishlist_add", productId: parsed.data.productId, userId: user.id, sessionId: await getAnonSessionId() });
  return NextResponse.json({ ok: true });
}
