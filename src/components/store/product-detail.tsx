"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatInr, discountPercent } from "@/lib/utils";
import { useToast } from "@/components/providers";
import { useCartDrawer } from "@/components/store/cart-drawer";
import { SizeGuideModal } from "@/components/store/size-guide-modal";
import { colourSlugFromName, productImageForColour, resolveProductColour } from "@/lib/product-colours";
import { sortColourEntries } from "@/lib/colors";
import type { ProductCardData } from "@/lib/catalog";

export function ProductDetail({
  product,
  sizeGuide,
  initialColourSlug,
}: {
  product: ProductCardData & {
    careInstructions: string;
    isPreorder: boolean;
    expectedDispatch: Date | null;
    reviews: { id: string; rating: number; body: string; verified: boolean }[];
  };
  sizeGuide: { title: string; rows: unknown } | null;
  initialColourSlug?: string | null;
}) {
  const router = useRouter();
  const colours = sortColourEntries(
    [...new Map(product.variants.map((v) => [v.colour, v.colourHex])).entries()],
  );
  const [colour, setColour] = useState(() => resolveProductColour(product, initialColourSlug) ?? colours[0]?.[0] ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const toast = useToast();
  const cart = useCartDrawer();

  useEffect(() => {
    const next = resolveProductColour(product, initialColourSlug);
    if (next) setColour(next);
  }, [initialColourSlug, product]);

  useEffect(() => {
    setIdx(0);
    setSize(null);
  }, [colour]);

  const activeHex = colours.find(([n]) => n === colour)?.[1] ?? "#888888";
  const colourImages = product.images.filter((i) => i.colour === colour);
  const hero = productImageForColour(product, colour);
  const images = colourImages.length > 0 ? colourImages : hero ? [hero] : product.images;
  const sizes = product.variants.filter((v) => v.colour === colour);
  const variant = sizes.find((v) => v.size === size);
  const sizePool = sizes.length > 0 ? sizes : product.variants.filter((v) => v.colour === colour);
  const price = variant?.price ?? Math.min(...(sizePool.length ? sizePool : product.variants).map((v) => v.price));
  const mrp = variant?.mrp ?? Math.min(...(sizePool.length ? sizePool : product.variants).map((v) => v.mrp));
  const off = discountPercent(mrp, price);
  const stock = variant?.inventory?.available ?? 0;
  const img = images[idx] ?? images[0] ?? hero;

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
        <div className="relative aspect-square overflow-hidden bg-neutral-950">
          {img && (
            <Image
              key={`${colour}-${img.url}`}
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              priority
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color opacity-[0.18]"
            style={{ backgroundColor: activeHex }}
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-bb-black/75 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-4 w-4 border border-bb-off/40" style={{ backgroundColor: activeHex }} />
            <span className="text-[10px] tracking-[0.16em]">{colour.toUpperCase()}</span>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={`${colour}-${im.url}-${i}`}
              type="button"
              className={`relative h-16 w-16 shrink-0 border ${idx === i ? "border-bb-off" : "border-bb-off/20"}`}
              onClick={() => setIdx(i)}
            >
              <Image src={im.url} alt={im.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="pb-28 md:pb-0">
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
          <p className="text-[10px] tracking-[0.22em] text-bb-off/50">
            COLOUR — {colour} · {colours.length} SHADES
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colours.map(([name, hex]) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                onClick={() => {
                  setColour(name);
                  setIdx(0);
                  router.replace(`?colour=${colourSlugFromName(name)}`, { scroll: false });
                }}
                className={`flex items-center gap-2 border px-2 py-1 text-[10px] tracking-[0.12em] ${
                  colour === name ? "border-bb-off bg-bb-off/10" : "border-bb-off/30"
                }`}
              >
                <span className="h-5 w-5 shrink-0 border border-bb-off/30" style={{ background: hex }} />
                {name.toUpperCase()}
              </button>
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
          <div className="flex items-center border border-bb-off/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-4 text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="px-3 py-4 text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
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

      <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-bb-off/15 bg-bb-black p-3 md:hidden">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="flex items-center border border-bb-off/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="px-3 py-2 text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => add(false)} className="flex-1 bg-bb-off py-3 text-xs tracking-[0.2em] text-bb-black">
            ADD TO BAG
          </button>
          <button onClick={() => add(true)} className="flex-1 border border-bb-off py-3 text-xs tracking-[0.2em]">
            BUY IT NOW
          </button>
        </div>
      </div>

      {guide && sizeGuide && (
        <SizeGuideModal title={sizeGuide.title} rows={sizeGuide.rows as Record<string, string | number>[]} onClose={() => setGuide(false)} />
      )}
    </div>
  );
}
