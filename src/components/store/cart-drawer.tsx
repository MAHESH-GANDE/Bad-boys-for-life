"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { formatInr } from "@/lib/utils";

type CartItem = {
  id: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    colour: string;
    price: number;
    mrp: number;
    product: { name: string; slug: string; images: { url: string; alt: string }[] };
  };
};

type CartPayload = {
  items: CartItem[];
  totals: { subtotal: number; remainingFree: number };
};

const Ctx = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
  refresh: () => void;
}>({ open: false, setOpen: () => {}, refresh: () => {} });

export function useCartDrawer() {
  return useContext(Ctx);
}

export function CartShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartPayload | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setCart)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const value = useMemo(() => ({ open, setOpen, refresh }), [open, refresh]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[70]">
          <button className="absolute inset-0 bg-black/70" aria-label="Close bag" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bb-off/15 bg-bb-black">
            <div className="flex items-center justify-between border-b border-bb-off/15 px-5 py-4">
              <p className="text-sm tracking-[0.22em]">YOUR BAG</p>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {!cart?.items?.length ? (
                <div className="py-16 text-center">
                  <p className="font-display text-3xl tracking-[0.12em]">YOUR BAG IS EMPTY.</p>
                  <Link href="/shop" className="mt-6 inline-block border border-bb-off px-6 py-3 text-xs tracking-[0.2em]" onClick={() => setOpen(false)}>
                    BACK TO SHOP
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-20 overflow-hidden bg-neutral-900">
                        {item.variant.product.images[0] && (
                          <Image
                            src={item.variant.product.images[0].url}
                            alt={item.variant.product.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 text-sm">
                        <p>{item.variant.product.name}</p>
                        <p className="mt-1 text-xs text-bb-off/50">
                          {item.variant.colour} / {item.variant.size}
                        </p>
                        <p className="mt-2">{formatInr(item.variant.price)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {!!cart?.items?.length && (
              <div className="border-t border-bb-off/15 p-5">
                {cart.totals.remainingFree > 0 && (
                  <p className="mb-3 text-[10px] tracking-[0.16em] text-bb-off/60">
                    ADD {formatInr(cart.totals.remainingFree)} MORE FOR FREE SHIPPING
                  </p>
                )}
                <div className="mb-4 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatInr(cart.totals.subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block bg-bb-off py-3 text-center text-xs tracking-[0.24em] text-bb-black"
                  onClick={() => setOpen(false)}
                >
                  CHECKOUT
                </Link>
                <Link href="/cart" className="mt-3 block text-center text-[10px] tracking-[0.2em] text-bb-off/60" onClick={() => setOpen(false)}>
                  VIEW BAG
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function CartDrawer() {
  return null;
}
