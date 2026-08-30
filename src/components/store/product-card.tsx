"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { discountPercent, formatInr } from "@/lib/utils";
import { sortColourEntries, brandColors, colorTextClass, isLightColor } from "@/lib/colors";
import { colourSlugFromName, productImageForColour } from "@/lib/product-colours";
import type { ProductCardData } from "@/lib/catalog";
import { useToast } from "@/components/providers";
import { useCartDrawer } from "@/components/store/cart-drawer";

export function ProductCard({
  product,
  highlightColour,
}: {
  product: ProductCardData;
  /** When set (e.g. on a colour collection page), show this shade + its image. */
  highlightColour?: string;
}) {
  const [hover, setHover] = useState(false);
  const toast = useToast();
  const cart = useCartDrawer();

  const colours = sortColourEntries(
    [...new Map(product.variants.map((v) => [v.colour, v.colourHex])).entries()],
  );
  const displayColour =
    highlightColour && colours.some(([n]) => n === highlightColour) ? highlightColour : colours[0]?.[0];
  const primaryImg = displayColour ? productImageForColour(product, displayColour) : product.images[0];
  const img = primaryImg ?? product.images[0];
  const img2 =
    displayColour && colours.length > 1
      ? productImageForColour(
          product,
          colours.find(([n]) => n !== displayColour)?.[0] ?? displayColour,
        ) ?? img
      : product.images[1] ?? img;

  const displayVariants = displayColour
    ? product.variants.filter((v) => v.colour === displayColour)
    : product.variants;
  const price = Math.min(...displayVariants.map((v) => v.price));
  const mrp = Math.min(...displayVariants.map((v) => v.mrp));
  const off = discountPercent(mrp, price);
  const inStock = displayVariants.some((v) => (v.inventory?.available ?? 0) > 0);
  const low = displayVariants.some(
    (v) => (v.inventory?.available ?? 0) > 0 && (v.inventory?.available ?? 0) <= (v.inventory?.lowStockAt ?? 5),
  );
  const defaultVariant =
    displayVariants.find((v) => (v.inventory?.available ?? 0) > 0) ?? displayVariants[0] ?? product.variants[0];

  const productHref = displayColour
    ? `/product/${product.slug}?colour=${colourSlugFromName(displayColour)}`
    : `/product/${product.slug}`;

  async function add(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: defaultVariant.id, quantity: 1 }),
    });
    if (!res.ok) {
      toast.push("Could not add.");
      return;
    }
    toast.push("ADDED TO BAG");
    cart.refresh();
    cart.setOpen(true);
  }

  async function wish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    toast.push("SAVED");
  }

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={productHref} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-950">
          {img && (
            <Image
              src={hover && img2 ? img2.url : img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          {displayColour && (
            <span className="absolute bottom-2 left-2 bg-bb-black/70 px-2 py-1 text-[9px] tracking-[0.16em] text-bb-off backdrop-blur-sm">
              {displayColour.toUpperCase()}
            </span>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1 text-[9px] tracking-[0.18em]">
            {product.isNew && <Badge>NEW</Badge>}
            {product.isBestseller && <Badge>BESTSELLER</Badge>}
            {product.isLimited && <Badge>LIMITED</Badge>}
            {off >= 10 && <Badge tone="red">SALE</Badge>}
            {low && inStock && <Badge>LOW STOCK</Badge>}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm">{product.name}</h3>
          <p className="text-sm">
            {formatInr(price)}{" "}
            {off > 0 && <span className="ml-2 text-bb-off/40 line-through">{formatInr(mrp)}</span>}
            {off > 0 && <span className="ml-2 text-bb-red text-xs">{off}% OFF</span>}
          </p>
          {colours.length > 1 && (
            <p className="text-[10px] tracking-[0.14em] text-bb-off/45">{colours.length} COLOURS</p>
          )}
          {Number(product.ratingCount) > 0 && (
            <p className="text-[11px] text-bb-off/50">★ {Number(product.ratingAvg).toFixed(1)}</p>
          )}
        </div>
      </Link>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {colours.map(([name, hex]) => {
          const slug = colourSlugFromName(name);
          const chipText = colorTextClass(hex);
          const chipBg = isLightColor(hex) ? "bg-white/90" : "bg-black/40";
          const active = name === displayColour;
          return (
            <Link
              key={name}
              href={`/product/${product.slug}?colour=${slug}`}
              title={`View in ${name}`}
              className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[9px] tracking-[0.14em] backdrop-blur-sm transition ${
                active ? "border-bb-off ring-1 ring-bb-off/40" : "border-bb-off/25 hover:border-bb-off/60"
              } ${chipBg} ${chipText}`}
            >
              <span className="h-3 w-3 shrink-0 border border-black/20" style={{ background: hex }} />
              {name.toUpperCase()}
            </Link>
          );
        })}
      </div>
      <button
        aria-label="Save"
        onClick={wish}
        className="absolute right-2 top-2 z-10 bg-bb-black/60 p-2"
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        onClick={add}
        className="absolute bottom-28 left-2 right-2 hidden bg-bb-off py-2 text-[10px] tracking-[0.2em] text-bb-black md:group-hover:block"
      >
        QUICK ADD
      </button>
    </article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: "red" }) {
  return (
    <span className={tone === "red" ? "bg-bb-red px-1.5 py-0.5 text-bb-off" : "bg-bb-off px-1.5 py-0.5 text-bb-black"}>
      {children}
    </span>
  );
}

export function ProductGrid({
  products,
  highlightColour,
}: {
  products: ProductCardData[];
  highlightColour?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} highlightColour={highlightColour} />
      ))}
    </div>
  );
}
