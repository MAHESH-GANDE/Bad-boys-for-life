"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import { colorTiers, colorsByTier } from "@/lib/colors";
import { fitModels } from "@/lib/fits";
import { useCartDrawer } from "@/components/store/cart-drawer";

const nav = [
  { href: "/new-arrivals", label: "NEW IN" },
  { href: "/collections/colours", label: "COLOURS" },
  { href: "/shop", label: "SHOP", mega: true },
  { href: "/collections", label: "COLLECTIONS" },
  { href: "/sale", label: "SALE" },
];

type Cat = { name: string; slug: string };

export function Header({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const cart = useCartDrawer();

  return (
    <header className="sticky top-0 z-50 border-b border-bb-off/15 bg-bb-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px]">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 md:gap-3"
            aria-label="BADBOYS home"
          >
            <SkullMark className="h-7 w-6 shrink-0 text-bb-off md:h-8 md:w-7" />
            <Wordmark className="truncate text-sm md:text-lg" spaced={false} />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex" onMouseLeave={() => setMega(false)}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setMega(!!item.mega)}
              className="text-[11px] tracking-[0.22em] text-bb-off/80 transition-colors hover:text-bb-off"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <Link href="/search" aria-label="Search" className="hidden sm:block">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/account" aria-label="Account" className="hidden sm:block">
            <User className="h-5 w-5" />
          </Link>
          <button aria-label="Bag" onClick={() => cart.setOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mega && (
        <div
          className="absolute left-0 right-0 hidden border-b border-bb-off/15 bg-bb-black md:block"
          onMouseEnter={() => setMega(true)}
          onMouseLeave={() => setMega(false)}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-8 py-10 lg:grid-cols-4">
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/50">COLOUR TIERS</p>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/collections/colours" className="text-bb-off/80 hover:text-bb-off">
                    All colours
                  </Link>
                </li>
                {colorTiers.map((tier) => (
                  <li key={tier.id}>
                    <p className="text-[9px] tracking-[0.2em] text-bb-off/40">{tier.label} · {tier.share}</p>
                    <ul className="mt-2 space-y-1.5">
                      {colorsByTier(tier.id).slice(0, 4).map((color) => (
                        <li key={color.slug}>
                          <Link href={`/collections/color/${color.slug}`} className="hover:text-bb-off">
                            {color.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/50">CLOTHING</p>
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="text-sm hover:text-bb-off">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/50">SHOP BY FIT</p>
              <ul className="space-y-2 text-sm">
                {fitModels.slice(0, 8).map((fit) => (
                  <li key={fit.slug}>
                    <Link href={fit.href}>{fit.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/50">TREND COLLECTIONS</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/collections/new-drop">New Drop</Link>
                </li>
                <li>
                  <Link href="/collections/streetwear">Streetwear</Link>
                </li>
                <li>
                  <Link href="/collections/limited-edition">Limited Edition</Link>
                </li>
                <li>
                  <Link href="/collections/essentials">Essentials</Link>
                </li>
                <li>
                  <Link href="/collections">All Collections</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-bb-black md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <SkullMark className="h-7 w-6" />
              <Wordmark spaced={false} className="text-lg" />
            </Link>
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>
          <nav className="flex flex-col gap-5 px-6 py-8 text-2xl font-display tracking-[0.18em]">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)}>
              SEARCH
            </Link>
            <Link href="/account" onClick={() => setOpen(false)}>
              ACCOUNT
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="text-base tracking-[0.12em] text-bb-off/70"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
