import { cookies } from "next/headers";
import { prisma } from "./db";

export async function getCartSessionId() {
  const jar = await cookies();
  return jar.get("bb_cart")?.value ?? "anonymous";
}

export async function getOrCreateCart(userId?: string | null) {
  const sessionId = await getCartSessionId();
  const existing = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: { include: { variant: { include: { product: { include: { images: true } }, inventory: true } } } },
    },
  });
  if (existing) {
    if (userId && !existing.userId) {
      await prisma.cart.update({ where: { id: existing.id }, data: { userId } });
    }
    return existing;
  }
  return prisma.cart.create({
    data: { sessionId, userId: userId ?? undefined },
    include: {
      items: { include: { variant: { include: { product: { include: { images: true } }, inventory: true } } } },
    },
  });
}

export function cartTotals(
  items: { quantity: number; variant: { price: number; mrp: number } }[],
  discount = 0,
  shipping = 0,
  codFee = 0,
  giftWrapFee = 0,
) {
  const subtotal = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.variant.mrp * i.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discount + shipping + codFee + giftWrapFee);
  return { subtotal, mrpTotal, discount, shipping, codFee, giftWrapFee, grandTotal };
}
