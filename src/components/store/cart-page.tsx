"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  id: string;
  quantity: number;
  variant: {
    size: string;
    colour: string;
    price: number;
    product: { name: string; slug: string; images: { url: string; alt: string }[] };
  };
};

export function CartPage({
  items,
  totals,
}: {
  items: Item[];
  totals: { subtotal: number; remainingFree: number };
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  async function update(itemId: string, quantity: number) {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    router.refresh();
  }

  async function apply() {
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setMsg(data.error || `Applied · ${formatInr(data.discount)} off`);
  }

  if (!items.length) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-display text-5xl tracking-[0.12em]">YOUR BAG IS EMPTY.</p>
        <Link href="/shop" className="mt-8 inline-block border border-bb-off px-8 py-3 text-xs tracking-[0.22em]">
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <h1 className="font-display text-4xl tracking-[0.14em]">BAG</h1>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-bb-off/10 pb-6">
            <div className="relative h-28 w-24 bg-neutral-950">
              {item.variant.product.images[0] && (
                <Image src={item.variant.product.images[0].url} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.variant.product.slug}`}>{item.variant.product.name}</Link>
              <p className="text-xs text-bb-off/50">
                {item.variant.colour} / {item.variant.size}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => update(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => update(item.id, item.quantity + 1)}>+</button>
                <button className="ml-4 text-xs tracking-[0.16em] text-bb-off/40" onClick={() => update(item.id, 0)}>
                  REMOVE
                </button>
              </div>
            </div>
            <p>{formatInr(item.variant.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <aside className="h-fit border border-bb-off/15 p-6">
        {totals.remainingFree > 0 && (
          <p className="mb-4 text-[10px] tracking-[0.16em] text-bb-off/60">
            ADD {formatInr(totals.remainingFree)} MORE FOR FREE SHIPPING
          </p>
        )}
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatInr(totals.subtotal)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="COUPON"
            className="flex-1 border border-bb-off/20 bg-transparent px-3 py-2 text-sm"
          />
          <button onClick={apply} className="border border-bb-off px-3 text-xs tracking-[0.16em]">
            APPLY
          </button>
        </div>
        {msg && <p className="mt-2 text-xs text-bb-off/60">{msg}</p>}
        <Link href="/checkout" className="mt-6 block bg-bb-off py-3 text-center text-xs tracking-[0.24em] text-bb-black">
          CHECKOUT
        </Link>
      </aside>
    </div>
  );
}
