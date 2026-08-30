export type ShippingConfig = {
  freeShippingThreshold: number;
  standardFee: number;
  expressFee: number;
  codFee: number;
  codEnabled: boolean;
  codMin: number;
  codMax: number;
};

export const defaultShipping: ShippingConfig = {
  freeShippingThreshold: 999,
  standardFee: 79,
  expressFee: 149,
  codFee: 40,
  codEnabled: true,
  codMin: 0,
  codMax: 5000,
};

export function shippingFor(subtotal: number, method: "STANDARD" | "EXPRESS", cfg = defaultShipping) {
  if (subtotal >= cfg.freeShippingThreshold && method === "STANDARD") return 0;
  return method === "EXPRESS" ? cfg.expressFee : cfg.standardFee;
}

export function remainingForFreeShipping(subtotal: number, cfg = defaultShipping) {
  return Math.max(0, cfg.freeShippingThreshold - subtotal);
}
