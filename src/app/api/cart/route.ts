import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { getSessionUser } from "@/lib/auth";
import { remainingForFreeShipping } from "@/lib/shipping";
import { getSiteConfig } from "@/lib/settings";
import { trackEvent } from "@/lib/events";
import { getAnonSessionId } from "@/lib/session-id";

export async function GET() {
  const user = await getSessionUser();
  const cart = await getOrCreateCart(user?.id);
  const cfg = await getSiteConfig();
  const { subtotal } = cartTotals(cart.items);
  return NextResponse.json({
    items: cart.items,
    totals: { subtotal, remainingFree: remainingForFreeShipping(subtotal, cfg.shipping) },
  });
}

const bodySchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10).default(1),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid item." }, { status: 400 });
  const user = await getSessionUser();
  const cart = await getOrCreateCart(user?.id);
  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.data.variantId },
    include: { inventory: true, product: true },
  });
  if (!variant || !variant.active || !variant.product.published) {
    return NextResponse.json({ error: "Product unavailable." }, { status: 400 });
  }
  const existing = cart.items.find((i) => i.variantId === variant.id);
  const nextQty = (existing?.quantity ?? 0) + parsed.data.quantity;
  if ((variant.inventory?.available ?? 0) < nextQty) {
    return NextResponse.json({ error: "That size just sold out." }, { status: 409 });
  }
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: nextQty } });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId: variant.id, quantity: parsed.data.quantity },
    });
  }
  await trackEvent({
    name: "add_to_cart",
    productId: variant.productId,
    variantId: variant.id,
    userId: user?.id,
    sessionId: await getAnonSessionId(),
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const parsed = z
    .object({ itemId: z.string().uuid(), quantity: z.number().int().min(0).max(10) })
    .safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid." }, { status: 400 });
  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: parsed.data.itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: parsed.data.itemId }, data: { quantity: parsed.data.quantity } });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { itemId } = (await req.json()) as { itemId: string };
  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
