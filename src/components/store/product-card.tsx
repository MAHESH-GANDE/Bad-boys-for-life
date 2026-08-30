"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { discountPercent, formatInr } from "@/lib/utils";
import { sortColourEntries, brandColors, colorTextClass, isLightColor } from "@/lib/colors";
import type { ProductCardData } from "@/lib/catalog";
import { useToast } from "@/components/providers";
import { useCartDrawer } from "@/components/store/cart-drawer";

export function ProductCard({ product }: { product: ProductCardData }) {
  const [hover, setHover] = useState(false);
  const toast = useToast();
  const cart = useCartDrawer();
  const img = product.images[0];
  const img2 = product.images[1] ?? img;
  const price = Math.min(...product.variants.map((v) => v.price));
  const mrp = Math.min(...product.variants.map((v) => v.mrp));
  const off = discountPercent(mrp, price);
  const colours = sortColourEntries(
    [...new Map(product.variants.map((v) => [v.colour, v.colourHex])).entries()],
  );
  const inStock = product.variants.some((v) => (v.inventory?.available ?? 0) > 0);
  const low = product.variants.some((v) => (v.inventory?.available ?? 0) > 0 && (v.inventory?.available ?? 0) <= (v.inventory?.lowStockAt ?? 5));
  const defaultVariant = product.variants.find((v) => (v.inventory?.available ?? 0) > 0) ?? product.variants[0];

  async function add() {
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

  async function wish() {
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
      <Link href={`/product/${product.slug}`} className="block">
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
          {Number(product.ratingCount) > 0 && (
            <p className="text-[11px] text-bb-off/50">★ {Number(product.ratingAvg).toFixed(1)}</p>
          )}
        </div>
      </Link>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {colours.map(([name, hex]) => {
          const brand = brandColors.find((c) => c.name === name);
          const slug = brand?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
          const chipText = colorTextClass(hex);
          const chipBg = isLightColor(hex) ? "bg-white/90" : "bg-black/40";
          return (
            <Link
              key={name}
              href={`/collections/color/${slug}`}
              title={`Shop ${name} collection`}
              className={`inline-flex items-center gap-1.5 border border-bb-off/25 px-2 py-1 text-[9px] tracking-[0.14em] backdrop-blur-sm transition hover:border-bb-off/60 ${chipBg} ${chipText}`}
            >
              <span
                className="h-3 w-3 shrink-0 border border-black/20"
                style={{ background: hex }}
              />
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

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
