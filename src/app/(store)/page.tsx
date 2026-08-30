import Link from "next/link";
import { listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import { Hero } from "@/components/store/hero";
import { PremiumCollectionGrid } from "@/components/store/premium-collection-card";
import { ColorCollectionsGrid } from "@/components/store/color-collections-grid";
import { brandColors } from "@/lib/colors";
import { trendCollections } from "@/lib/trend-collections";

export default async function HomePage() {
  const newest = await listProducts({ sort: "newest" });
  const best = await listProducts({ sort: "bestselling" });

  const colourEdits = await Promise.all(
    brandColors.map(async (color) => ({
      color,
      products: await listProducts({ colour: [color.name], sort: "bestselling" }),
    })),
  );

  return (
    <div>
      <Hero
        title="BADBOYS"
        subtitle="FOR LIFE"
        body="MENSWEAR"
        image="/images/look-night-out.jpg"
        ctaLabel="SHOP NOW"
        ctaHref="/shop"
        secondaryLabel="ALL COLOURS"
        secondaryHref="/collections/colours"
      />

      <ColorCollectionsGrid />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="NEW IN" href="/new-arrivals" />
        <ProductGrid products={newest.slice(0, 8)} />
      </section>

      {colourEdits.map(({ color, products }) =>
        products.length > 0 ? (
          <section key={color.slug} className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-8 flex items-end justify-between border-b border-bb-off/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="h-5 w-5 border border-bb-off/30" style={{ background: color.hex }} />
                <h2 className="font-display text-2xl tracking-[0.14em] md:text-3xl">{color.name.toUpperCase()}</h2>
              </div>
              <Link
                href={`/collections/color/${color.slug}`}
                className="text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off"
              >
                VIEW ALL
              </Link>
            </div>
            <ProductGrid products={products.slice(0, 4)} />
          </section>
        ) : null,
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">THIS SEASON</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">COLLECTIONS</h2>
          </div>
          <Link href="/collections" className="hidden text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off md:block">
            VIEW ALL
          </Link>
        </div>
        <PremiumCollectionGrid collections={trendCollections.slice(0, 5)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="BEST SELLERS" href="/bestsellers" />
        <ProductGrid products={best.slice(0, 8)} />
      </section>

      <section className="border-y border-bb-off/15 py-24 text-center">
        <SkullMark className="mx-auto mb-6 h-14 w-12" />
        <Wordmark spaced className="text-2xl md:text-3xl" />
        <p className="mt-6 font-display text-4xl tracking-[0.16em] md:text-6xl">WE DON&apos;T FOLLOW.</p>
        <p className="mt-4 font-display text-3xl tracking-[0.16em] text-bb-off/70 md:text-5xl">
          WE WEAR OUR OWN.
        </p>
        <Link
          href="/collections/colours"
          className="mt-10 inline-block bg-bb-off px-10 py-3 text-xs tracking-[0.28em] text-bb-black"
        >
          SHOP ALL COLOURS
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
