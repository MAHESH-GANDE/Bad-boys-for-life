import { getSessionUser } from "@/lib/auth";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { CheckoutClient } from "@/components/store/checkout-client";
import { validateCoupon } from "@/lib/coupons";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const cart = await getOrCreateCart(user?.id);
  const { subtotal } = cartTotals(cart.items);
  if (!cart.items.length) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-display text-4xl tracking-[0.12em]">YOUR BAG IS EMPTY.</p>
        <Link href="/shop" className="mt-6 inline-block border px-6 py-3 text-xs tracking-[0.2em]">
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  let couponDiscount = 0;
  let appliedCoupon: string | undefined;
  if (cart.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: cart.couponCode } });
    if (coupon) {
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
      if (check.ok) {
        couponDiscount = check.discount;
        appliedCoupon = cart.couponCode;
      }
    }
  }

  return (
    <CheckoutClient
      subtotal={subtotal}
      loggedIn={!!user}
      mobile={user?.mobile}
      couponCode={appliedCoupon}
      couponDiscount={couponDiscount}
    />
  );
}
