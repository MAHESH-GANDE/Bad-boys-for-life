"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readGuestWishlist } from "@/lib/guest-wishlist";
import { ProductGrid } from "@/components/store/product-card";
import type { ProductCardData } from "@/lib/catalog";

export function GuestWishlistView() {
  const [products, setProducts] = useState<ProductCardData[] | null>(null);

  useEffect(() => {
    const ids = readGuestWishlist();
    if (!ids.length) {
      setProducts([]);
      return;
    }
    fetch(`/api/wishlist?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  if (products === null) {
    return <p className="py-24 text-center text-sm text-bb-off/50">Loading saved pieces…</p>;
  }

  if (!products.length) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-display text-4xl tracking-[0.12em]">YOUR WISHLIST IS EMPTY.</p>
        <p className="mt-3 text-sm text-bb-off/50">Tap the heart on any product to save it here.</p>
        <Link href="/shop" className="mt-8 inline-block border border-bb-off px-8 py-3 text-xs tracking-[0.2em]">
          BACK TO SHOP
        </Link>
        <Link href="/account" className="mt-4 block text-[10px] tracking-[0.2em] text-bb-off/50 hover:text-bb-off">
          LOGIN TO SYNC ACROSS DEVICES →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 font-display text-4xl tracking-[0.14em]">WISHLIST</h1>
      <p className="mb-8 text-xs text-bb-off/50">
        Saved on this device · <Link href="/account" className="underline hover:text-bb-off">Login to sync</Link>
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
