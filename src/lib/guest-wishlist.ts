const KEY = "bb_guest_wishlist";

export function readGuestWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestWishlist(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
}

export function toggleGuestWishlist(productId: string) {
  const ids = readGuestWishlist();
  const has = ids.includes(productId);
  const next = has ? ids.filter((id) => id !== productId) : [...ids, productId];
  writeGuestWishlist(next);
  return !has;
}

export function isGuestWishlisted(productId: string) {
  return readGuestWishlist().includes(productId);
}
