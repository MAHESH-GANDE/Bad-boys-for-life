import Link from "next/link";
import { listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import { Hero } from "@/components/store/hero";
import { PremiumCollectionGrid } from "@/components/store/premium-collection-card";
import { ShopByColor } from "@/components/store/shop-by-color";
import { trendCollections } from "@/lib/trend-collections";

export default async function HomePage() {
  const black = await listProducts({ colour: ["Black"], sort: "bestselling" });
  const newest = await listProducts({ sort: "newest" });
  const street = await listProducts({ collection: "streetwear", sort: "bestselling" });

  return (
    <div>
      <Hero
        title="BADBOYS"
        subtitle="FOR LIFE"
        body="MENSWEAR"
        image="/images/hero-menswear.jpg"
        ctaLabel="SHOP COLLECTIONS"
        ctaHref="/collections"
        secondaryLabel="SHOP BLACK"
        secondaryHref="/collections/black"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">CURATED DROPS</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">TREND COLLECTIONS</h2>
          </div>
          <Link href="/collections" className="hidden text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off md:block">
            VIEW ALL
          </Link>
        </div>
        <PremiumCollectionGrid collections={trendCollections.slice(0, 5)} />
      </section>

      <ShopByColor />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="THE BLACK COLLECTION" href="/collections/black" />
        <ProductGrid products={black.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="NEW DROP" href="/collections/new-drop" />
        <ProductGrid products={newest.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="STREETWEAR" href="/collections/streetwear" />
        <ProductGrid products={street.slice(0, 4)} />
      </section>

      <section className="border-y border-bb-off/15 py-24 text-center">
        <SkullMark className="mx-auto mb-6 h-14 w-12" />
        <Wordmark spaced className="text-2xl md:text-3xl" />
        <p className="mt-6 font-display text-4xl tracking-[0.16em] md:text-6xl">WE DON&apos;T FOLLOW.</p>
        <p className="mt-4 font-display text-3xl tracking-[0.16em] text-bb-off/70 md:text-5xl">
          WE WEAR OUR OWN.
        </p>
        <Link href="/collections" className="mt-10 inline-block bg-bb-off px-10 py-3 text-xs tracking-[0.28em] text-bb-black">
          EXPLORE ALL COLLECTIONS
        </Link>
      </section>
    </div>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="font-display text-3xl tracking-[0.16em] md:text-4xl">{title}</h2>
      <Link href={href} className="text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off">
        VIEW ALL
      </Link>
    </div>
  );
}
