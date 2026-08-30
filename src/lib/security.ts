import crypto from "crypto";
import { headers } from "next/headers";

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || now > hit.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (hit.count >= limit) return { ok: false, remaining: 0 };
  hit.count += 1;
  return { ok: true, remaining: limit - hit.count };
}

export async function clientKey(prefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${prefix}:${ip}`;
}

export function csrfToken() {
  return crypto.randomBytes(16).toString("hex");
}
