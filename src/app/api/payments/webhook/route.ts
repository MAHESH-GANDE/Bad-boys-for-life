import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mintMockSignature, verifyWebhookSignature } from "@/lib/payments";
import { consumeReservationsForOrder, releaseReservationsForOrder } from "@/lib/inventory";
import { trackEvent } from "@/lib/events";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || req.headers.get("x-bb-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(raw) as {
    event: string;
    payload: { payment?: { entity?: { order_id?: string; id?: string } }; order?: { entity?: { receipt?: string; id?: string } } };
    orderNumber?: string;
    eventId?: string;
  };

  const eventId = event.eventId || event.payload?.payment?.entity?.id || `${Date.now()}`;
  const existing = await prisma.payment.findUnique({ where: { webhookEventId: eventId } });
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  const providerOrderId =
    event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { providerOrderId: providerOrderId ?? undefined },
        { order: { number: event.orderNumber } },
      ],
    },
    include: { order: true },
  });
  if (!payment) return NextResponse.json({ error: "Unknown payment" }, { status: 404 });

  const kind = event.event || "payment.captured";
  if (kind.includes("captured") || kind.includes("success") || kind === "paid") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", webhookEventId: eventId, providerPaymentId: event.payload?.payment?.entity?.id },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "CONFIRMED" },
      }),
    ]);
    await consumeReservationsForOrder(payment.orderId);
    await prisma.cartItem.deleteMany({ where: { cart: { userId: payment.order.userId } } });
    await trackEvent({ name: "purchase", userId: payment.order.userId, payload: { orderId: payment.orderId } });
  } else if (kind.includes("failed") || kind.includes("timeout")) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAYMENT_FAILED", webhookEventId: eventId, failureReason: kind },
    });
    await prisma.order.update({ where: { id: payment.orderId }, data: { status: "CANCELLED" } });
    await releaseReservationsForOrder(payment.orderId);
  }
  return NextResponse.json({ ok: true });
}

/** Dev-only confirmation that still hits the webhook verifier. */
export async function PUT(req: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_MOCK_PAYMENTS) {
    return NextResponse.json({ error: "Disabled" }, { status: 403 });
  }
  const { orderNumber, success } = (await req.json()) as { orderNumber: string; success: boolean };
  const body = JSON.stringify({
    event: success ? "payment.captured" : "payment.failed",
    orderNumber,
    eventId: `mock_${orderNumber}_${success}`,
  });
  const signature = mintMockSignature(body);
  const res = await POST(
    new Request("http://local/api/payments/webhook", {
      method: "POST",
      headers: { "x-bb-signature": signature },
      body,
    }),
  );
  return res;
}
