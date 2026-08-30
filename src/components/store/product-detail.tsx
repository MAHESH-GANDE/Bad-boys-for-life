"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatInr, discountPercent } from "@/lib/utils";
import { useToast } from "@/components/providers";
import { useCartDrawer } from "@/components/store/cart-drawer";
import { SizeGuideModal } from "@/components/store/size-guide-modal";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  fit: string;
  fabric: string;
  careInstructions: string;
  ratingAvg: unknown;
  ratingCount: number;
  isPreorder: boolean;
  expectedDispatch: Date | null;
  images: { url: string; alt: string; kind: string; colour: string | null }[];
  variants: {
    id: string;
    colour: string;
    colourHex: string;
    size: string;
    price: number;
    mrp: number;
    sku: string;
    inventory: { available: number; lowStockAt: number } | null;
  }[];
  reviews: { id: string; rating: number; body: string; verified: boolean }[];
};

export function ProductDetail({
  product,
  sizeGuide,
}: {
  product: Product;
  sizeGuide: { title: string; rows: unknown } | null;
}) {
  const colours = [...new Map(product.variants.map((v) => [v.colour, v.colourHex])).entries()];
  const [colour, setColour] = useState(colours[0][0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const toast = useToast();
  const cart = useCartDrawer();

  const images = product.images.filter((i) => !i.colour || i.colour === colour);
  const sizes = product.variants.filter((v) => v.colour === colour);
  const variant = sizes.find((v) => v.size === size);
  const price = variant?.price ?? Math.min(...product.variants.map((v) => v.price));
  const mrp = variant?.mrp ?? Math.min(...product.variants.map((v) => v.mrp));
  const off = discountPercent(mrp, price);
  const stock = variant?.inventory?.available ?? 0;
  const img = images[idx] ?? images[0];

  const jsonFaq = useMemo(
    () => [
      ["DESCRIPTION", product.description],
      ["FIT", product.fit],
      ["FABRIC & CARE", `${product.fabric}. ${product.careInstructions}`],
      ["DELIVERY", "Standard 3–7 days on serviceable pincodes. Express where available."],
      ["RETURNS", "7 days from delivery. Tags on. Unused."],
    ],
    [product],
  );

  async function add(buyNow = false) {
    if (!variant) {
      toast.push("PICK A SIZE");
      return;
    }
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id, quantity: qty }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.push(data.error || "UNAVAILABLE");
      return;
    }
    toast.push("ADDED TO BAG");
    cart.refresh();
    if (buyNow) window.location.href = "/checkout";
    else cart.setOpen(true);
  }

  async function checkPin() {
    const res = await fetch(`/api/pincode?pincode=${pin}`);
    const data = await res.json();
    if (!data.serviceable) setEta("Not serviceable on this pincode.");
    else setEta(`Expected in ${data.etaDays} days${data.cod ? " · COD available" : ""}`);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square bg-neutral-950">
          {img && <Image src={img.url} alt={img.alt} fill className="object-cover" priority />}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((im, i) => (
            <button key={im.url + i} className="relative h-16 w-16 shrink-0 border border-bb-off/20" onClick={() => setIdx(i)}>
              <Image src={im.url} alt={im.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl tracking-[0.08em] md:text-5xl">{product.name}</h1>
        {product.ratingCount > 0 && (
          <p className="mt-2 text-sm text-bb-off/60">
            ★ {Number(product.ratingAvg).toFixed(1)} · {product.ratingCount} reviews
          </p>
        )}
        <p className="mt-4 text-xl">
          {formatInr(price)}{" "}
          {off > 0 && <span className="ml-2 text-bb-off/40 line-through">{formatInr(mrp)}</span>}
          {off > 0 && <span className="ml-2 text-sm text-bb-red">{off}% OFF</span>}
        </p>
        <p className="mt-4 text-bb-off/70">{product.shortDescription}</p>

        <div className="mt-8">
          <p className="text-[10px] tracking-[0.22em] text-bb-off/50">COLOUR — {colour}</p>
          <div className="mt-3 flex gap-2">
            {colours.map(([name, hex]) => (
              <button
                key={name}
                aria-label={name}
                onClick={() => {
                  setColour(name);
                  setSize(null);
                }}
                className="h-7 w-7 border"
                style={{ background: hex, borderColor: colour === name ? "#f4f1ea" : "#444" }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-[10px] tracking-[0.22em] text-bb-off/50">
            <span>SIZE</span>
            <button onClick={() => setGuide(true)}>SIZE GUIDE</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((v) => {
              const avail = v.inventory?.available ?? 0;
              return (
                <button
                  key={v.id}
                  disabled={avail <= 0}
                  onClick={() => setSize(v.size)}
                  className={`min-w-12 border px-3 py-2 text-sm ${
                    size === v.size ? "border-bb-off bg-bb-off text-bb-black" : "border-bb-off/30"
                  } ${avail <= 0 ? "opacity-30" : ""}`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
          {variant && stock > 0 && stock <= (variant.inventory?.lowStockAt ?? 5) && (
            <p className="mt-2 text-xs text-bb-red">Only {stock} left</p>
          )}
          {variant && stock <= 0 && <p className="mt-2 text-xs">OUT OF STOCK — notify from waitlist after login.</p>}
          {product.isPreorder && <p className="mt-2 text-xs tracking-[0.16em]">PRE-ORDER</p>}
        </div>

        <div className="mt-8 flex gap-2">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PINCODE"
            className="w-32 border border-bb-off/20 bg-transparent px-3 py-3 text-sm"
          />
          <button onClick={checkPin} className="border border-bb-off/20 px-4 text-xs tracking-[0.16em]">
            CHECK
          </button>
        </div>
        {eta && <p className="mt-2 text-xs text-bb-off/60">{eta}</p>}

        <div className="mt-8 hidden gap-3 md:flex">
          <button onClick={() => add(false)} className="flex-1 bg-bb-off py-4 text-xs tracking-[0.24em] text-bb-black">
            ADD TO BAG
          </button>
          <button onClick={() => add(true)} className="flex-1 border border-bb-off py-4 text-xs tracking-[0.24em]">
            BUY IT NOW
          </button>
        </div>

        <div className="mt-10 divide-y divide-bb-off/15 border-y border-bb-off/15">
          {jsonFaq.map(([k, v]) => (
            <details key={k} className="py-4">
              <summary className="cursor-pointer text-[11px] tracking-[0.22em]">{k}</summary>
              <p className="mt-3 text-sm text-bb-off/70">{v}</p>
            </details>
          ))}
          <details className="py-4">
            <summary className="cursor-pointer text-[11px] tracking-[0.22em]">REVIEWS</summary>
            {product.reviews.length === 0 ? (
              <p className="mt-3 text-sm text-bb-off/50">No reviews yet. We do not invent them.</p>
            ) : (
              product.reviews.map((r) => (
                <div key={r.id} className="mt-3 text-sm">
                  <p>{"★".repeat(r.rating)} {r.verified ? "· Verified" : ""}</p>
                  <p className="text-bb-off/70">{r.body}</p>
                </div>
              ))
            )}
          </details>
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 z-30 flex gap-2 border-t border-bb-off/15 bg-bb-black p-3 md:hidden">
        <button onClick={() => add(false)} className="flex-1 bg-bb-off py-3 text-xs tracking-[0.2em] text-bb-black">
          ADD TO BAG
        </button>
        <button onClick={() => add(true)} className="flex-1 border border-bb-off py-3 text-xs tracking-[0.2em]">
          BUY IT NOW
        </button>
      </div>

      {guide && sizeGuide && (
        <SizeGuideModal title={sizeGuide.title} rows={sizeGuide.rows as Record<string, string | number>[]} onClose={() => setGuide(false)} />
      )}
    </div>
  );
}
