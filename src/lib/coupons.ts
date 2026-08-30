import { Coupon, CouponType } from "@prisma/client";

export type CouponCart = {
  subtotal: number;
  productIds: string[];
  categoryIds: string[];
  userId?: string | null;
  isFirstOrder: boolean;
};

export function validateCoupon(coupon: Coupon, cart: CouponCart, now = new Date()) {
  if (!coupon.active) return { ok: false as const, error: "This code is no longer active." };
  if (now < coupon.startsAt) return { ok: false as const, error: "This code is not live yet." };
  if (now > coupon.endsAt) return { ok: false as const, error: "This code has expired." };
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return { ok: false as const, error: "This code has reached its limit." };
  }
  if (coupon.firstOrderOnly && !cart.isFirstOrder) {
    return { ok: false as const, error: "This code is for first orders only." };
  }
  if (cart.subtotal < coupon.minOrder) {
    return { ok: false as const, error: `Add more to unlock this code.` };
  }
  if (coupon.customerIds.length && cart.userId && !coupon.customerIds.includes(cart.userId)) {
    return { ok: false as const, error: "This code is not valid for your account." };
  }
  if (coupon.productIds.length && !cart.productIds.some((id) => coupon.productIds.includes(id))) {
    return { ok: false as const, error: "This code does not apply to items in your bag." };
  }
  if (coupon.categoryIds.length && !cart.categoryIds.some((id) => coupon.categoryIds.includes(id))) {
    return { ok: false as const, error: "This code does not apply to items in your bag." };
  }
  return { ok: true as const, discount: computeDiscount(coupon, cart.subtotal) };
}

export function computeDiscount(coupon: Pick<Coupon, "type" | "value" | "maxDiscount">, subtotal: number) {
  let discount =
    coupon.type === ("PERCENTAGE" as CouponType)
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  return Math.max(0, Math.min(discount, subtotal));
}
