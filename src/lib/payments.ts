import { prisma } from "./db";

export async function nextOrderNumber() {
  const seq = await prisma.sequence.upsert({
    where: { name: "order" },
    update: { value: { increment: 1 } },
    create: { name: "order", value: 100001 },
  });
  return `BAD-${String(seq.value).padStart(6, "0")}`;
}

export async function nextInvoiceNumber(prefix = "BB-INV") {
  const seq = await prisma.sequence.upsert({
    where: { name: "invoice" },
    update: { value: { increment: 1 } },
    create: { name: "invoice", value: 1001 },
  });
  return `${prefix}-${String(seq.value).padStart(6, "0")}`;
}

/**
 * Razorpay-ready payment adapter.
 * Production: create Razorpay orders and verify HMAC of webhooks.
 * Development: simulated provider that still requires server confirmation.
 */
export async function createProviderOrder(amount: number, receipt: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return {
      provider: "mock",
      providerOrderId: `order_mock_${receipt}`,
      amount,
      currency: "INR",
      keyId: "rzp_test_mock",
    };
  }
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amount * 100, currency: "INR", receipt }),
  });
  if (!res.ok) throw new Error("Payment provider unavailable.");
  const data = (await res.json()) as { id: string };
  return {
    provider: "razorpay",
    providerOrderId: data.id,
    amount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
  };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    // Mock provider: accept only internally minted events.
    return signature === `mock:${shaLike(rawBody)}`;
  }
  const crypto = require("crypto") as typeof import("crypto");
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

export function mintMockSignature(rawBody: string) {
  return `mock:${shaLike(rawBody)}`;
}

function shaLike(value: string) {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}
