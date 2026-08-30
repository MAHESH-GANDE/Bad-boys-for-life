import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { trendCollections } from "@/lib/trend-collections";
import { PremiumCollectionCard } from "@/components/store/premium-collection-card";
import { ShopByColor } from "@/components/store/shop-by-color";

export default async function CollectionsPage() {
  const cols = await prisma.collection.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  const trendBySlug = Object.fromEntries(trendCollections.map((t) => [t.slug, t]));

  return (
    <div>
      <section className="relative min-h-[42vh] border-b border-bb-off/15">
        <Image src="/images/campaign-night.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-bb-black/55" />
        <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end px-4 pb-12">
          <p className="text-[10px] tracking-[0.32em] text-bb-off/60">BADBOYS · MENSWEAR</p>
          <h1 className="mt-3 font-display text-5xl tracking-[0.16em] md:text-7xl">COLLECTIONS</h1>
          <p className="mt-4 max-w-lg text-sm text-bb-off/70">
            Trend-led drops. Premium cuts. Every colour we release — curated like a lookbook, not a catalog.
          </p>
        </div>
      </section>

      <ShopByColor />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <p className="mb-8 text-[10px] tracking-[0.32em] text-bb-off/50">TRENDING NOW</p>
        <div className="grid gap-4 md:grid-cols-2">
          {trendCollections.slice(0, 4).map((c) => (
            <PremiumCollectionCard key={c.slug} collection={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <p className="mb-8 text-[10px] tracking-[0.32em] text-bb-off/50">ALL COLLECTIONS</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cols.map((c) => {
            const meta = trendBySlug[c.slug];
            return (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative overflow-hidden border border-bb-off/10 bg-neutral-950"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={meta?.image || c.banner || "/images/editorial-still.jpg"}
                    alt={c.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-2xl tracking-[0.12em]">{c.name.toUpperCase()}</p>
                    <p className="mt-2 text-[10px] tracking-[0.22em] text-bb-off/50">ENTER →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
