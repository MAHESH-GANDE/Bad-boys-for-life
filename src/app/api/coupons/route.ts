import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { getSessionUser } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupons";
import { couponCodeSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const { code } = (await req.json()) as { code?: string };
  const parsed = couponCodeSchema.safeParse(code);
  if (!parsed.success) return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data } });
  if (!coupon) return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  const user = await getSessionUser();
  const cart = await getOrCreateCart(user?.id);
  const { subtotal } = cartTotals(cart.items);
  const first = user
    ? (await prisma.order.count({ where: { userId: user.id, status: { not: "CANCELLED" } } })) === 0
    : true;
  const check = validateCoupon(coupon, {
    subtotal,
    productIds: cart.items.map((i) => i.variant.productId),
    categoryIds: cart.items.map((i) => i.variant.product.categoryId),
    userId: user?.id,
    isFirstOrder: first,
  });
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
  await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: parsed.data } });
  return NextResponse.json({ ok: true, discount: check.discount, code: parsed.data });
}
