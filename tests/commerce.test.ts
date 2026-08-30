import { describe, expect, it } from "vitest";
import { computeDiscount, validateCoupon } from "../src/lib/coupons";
import { remainingForFreeShipping, shippingFor } from "../src/lib/shipping";
import { splitGst } from "../src/lib/money";

const coupon = {
  active: true,
  startsAt: new Date("2020-01-01"),
  endsAt: new Date("2030-01-01"),
  usageLimit: 10,
  usageCount: 0,
  firstOrderOnly: true,
  minOrder: 1000,
  customerIds: [] as string[],
  productIds: [] as string[],
  categoryIds: [] as string[],
  type: "PERCENTAGE" as const,
  value: 10,
  maxDiscount: 500,
};

describe("coupons", () => {
  it("rejects expired and first-order abuse", () => {
    const cart = { subtotal: 2000, productIds: [], categoryIds: [], isFirstOrder: false };
    const res = validateCoupon(coupon as never, cart);
    expect(res.ok).toBe(false);
  });
  it("caps percentage discount", () => {
    expect(computeDiscount({ type: "PERCENTAGE", value: 50, maxDiscount: 200 }, 10000)).toBe(200);
  });
});

describe("shipping", () => {
  it("is free above threshold", () => {
    expect(shippingFor(1000, "STANDARD")).toBe(0);
    expect(remainingForFreeShipping(700)).toBe(299);
  });
});

describe("gst", () => {
  it("splits intra-state", () => {
    const s = splitGst(1120, 12, true);
    expect(s.cgst + s.sgst).toBe(s.gst);
    expect(s.igst).toBe(0);
  });
});
