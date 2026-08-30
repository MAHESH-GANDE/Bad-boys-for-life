import { prisma } from "./db";

export type CommerceEvent =
  | "page_view"
  | "search"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "wishlist_add"
  | "checkout_started"
  | "payment_started"
  | "purchase"
  | "refund"
  | "return"
  | "exchange";

export async function trackEvent(input: {
  name: CommerceEvent;
  productId?: string;
  variantId?: string;
  userId?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
}) {
  await prisma.analyticsEvent.create({
    data: {
      name: input.name,
      productId: input.productId,
      variantId: input.variantId,
      userId: input.userId,
      sessionId: input.sessionId,
      payload: input.payload as object | undefined,
    },
  });
}
