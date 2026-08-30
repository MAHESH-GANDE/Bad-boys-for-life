import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { getSiteConfig } from "@/lib/settings";
import { shippingFor } from "@/lib/shipping";
import { nextInvoiceNumber, nextOrderNumber, createProviderOrder } from "@/lib/payments";
import { reserveStock, consumeReservationsForOrder } from "@/lib/inventory";
import { addressSchema, couponCodeSchema } from "@/lib/validations";
import { trackEvent } from "@/lib/events";
import { getAnonSessionId } from "@/lib/session-id";
import { splitGst } from "@/lib/money";

const checkoutSchema = z.object({
  email: z.string().email().optional(),
  address: addressSchema,
  deliveryMethod: z.enum(["STANDARD", "EXPRESS"]).default("STANDARD"),
  paymentMethod: z.enum(["UPI", "CARD", "NETBANKING", "WALLET", "COD", "RAZORPAY"]).default("RAZORPAY"),
  couponCode: z.string().optional(),
  giftWrap: z.boolean().optional(),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Verify your mobile first." }, { status: 401 });
  const parsed = checkoutSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Check your details.", issues: parsed.error.flatten() }, { status: 400 });

  const cart = await getOrCreateCart(user.id);
  if (!cart.items.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  const cfg = await getSiteConfig();
  const { subtotal } = cartTotals(cart.items);

  const pin = await prisma.pincodeService.findUnique({ where: { pincode: parsed.data.address.pincode } });
  const serviceable = !pin || pin.serviceable;
  if (!serviceable) return NextResponse.json({ error: "We do not ship to this pincode." }, { status: 400 });

  if (parsed.data.deliveryMethod === "EXPRESS" && pin && !pin.express) {
    return NextResponse.json({ error: "Express is not available here." }, { status: 400 });
  }

  const shipping = shippingFor(subtotal, parsed.data.deliveryMethod, cfg.shipping);
  let discount = 0;
  let couponCode: string | undefined;
  if (parsed.data.couponCode) {
    const code = couponCodeSchema.parse(parsed.data.couponCode);
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return NextResponse.json({ error: "Invalid coupon." }, { status: 400 });
    const first = (await prisma.order.count({ where: { userId: user.id, status: { not: "CANCELLED" } } })) === 0;
    const check = validateCoupon(coupon, {
      subtotal,
      productIds: cart.items.map((i) => i.variant.productId),
      categoryIds: cart.items.map((i) => i.variant.product.categoryId),
      userId: user.id,
      isFirstOrder: first,
    });
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
    discount = check.discount;
    couponCode = code;
  }

  const isCod = parsed.data.paymentMethod === "COD";
  if (isCod) {
    if (!cfg.shipping.codEnabled) return NextResponse.json({ error: "COD is disabled." }, { status: 400 });
    if (pin && !pin.cod) return NextResponse.json({ error: "COD is not available here." }, { status: 400 });
    if (subtotal < cfg.shipping.codMin || subtotal > cfg.shipping.codMax) {
      return NextResponse.json({ error: "Order value is outside COD limits." }, { status: 400 });
    }
  }

  const codFee = isCod ? cfg.shipping.codFee : 0;
  const giftWrapFee = parsed.data.giftWrap && cfg.giftWrapEnabled ? cfg.giftWrapFee : 0;
  const { grandTotal } = cartTotals(cart.items, discount, shipping, codFee, giftWrapFee);

  const address = await prisma.address.create({
    data: { ...parsed.data.address, userId: user.id },
  });

  if (parsed.data.email && !user.email) {
    await prisma.user.update({ where: { id: user.id }, data: { email: parsed.data.email } });
  }

  try {
    for (const item of cart.items) {
      await reserveStock({
        variantId: item.variantId,
        quantity: item.quantity,
        cartId: cart.id,
        minutes: 20,
      });
    }
  } catch {
    return NextResponse.json({ error: "A size sold out during checkout." }, { status: 409 });
  }

  const number = await nextOrderNumber();
  const invoiceNumber = await nextInvoiceNumber(cfg.invoicePrefix);

  const tax = cart.items.reduce((sum, item) => {
    const line = item.variant.price * item.quantity;
    return sum + splitGst(line, Number(item.variant.product.gstRate), true).gst;
  }, 0);

  const order = await prisma.order.create({
    data: {
      number,
      invoiceNumber,
      userId: user.id,
      addressId: address.id,
      status: isCod ? "CONFIRMED" : "PENDING_PAYMENT",
      deliveryMethod: parsed.data.deliveryMethod,
      paymentMethod: parsed.data.paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      codFee,
      giftWrapFee,
      grandTotal,
      couponCode,
      shippingSnapshot: parsed.data.address as object,
      billingSnapshot: parsed.data.address as object,
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variantId,
          name: item.variant.product.name,
          sku: item.variant.sku,
          hsnCode: item.variant.product.hsnCode,
          colour: item.variant.colour,
          size: item.variant.size,
          quantity: item.quantity,
          unitPrice: item.variant.price,
          mrp: item.variant.mrp,
          gstRate: item.variant.product.gstRate,
          taxAmount: splitGst(item.variant.price * item.quantity, Number(item.variant.product.gstRate), true).gst,
        })),
      },
    },
  });

  await prisma.inventoryReservation.updateMany({
    where: { cartId: cart.id, status: "ACTIVE" },
    data: { orderId: order.id },
  });

  if (isCod) {
    await consumeReservationsForOrder(order.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: "COD",
        status: "PENDING",
        amount: grandTotal,
        provider: "cod",
      },
    });
    await trackEvent({ name: "purchase", userId: user.id, sessionId: await getAnonSessionId(), payload: { orderId: order.id, number } });
    return NextResponse.json({ ok: true, orderNumber: number, status: "CONFIRMED" });
  }

  const provider = await createProviderOrder(grandTotal, number);
  await prisma.payment.create({
    data: {
      orderId: order.id,
      method: parsed.data.paymentMethod,
      status: "PROCESSING",
      amount: grandTotal,
      provider: provider.provider,
      providerOrderId: provider.providerOrderId,
    },
  });
  await trackEvent({ name: "payment_started", userId: user.id, sessionId: await getAnonSessionId(), payload: { orderId: order.id } });
  return NextResponse.json({
    ok: true,
    orderNumber: number,
    payment: provider,
    status: "PENDING_PAYMENT",
  });
}
