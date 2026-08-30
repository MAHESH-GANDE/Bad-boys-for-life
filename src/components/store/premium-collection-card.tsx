import Image from "next/image";
import Link from "next/link";
import type { TrendCollection } from "@/lib/trend-collections";
import { cn } from "@/lib/utils";

export function PremiumCollectionCard({
  collection,
  priority,
  tall,
}: {
  collection: TrendCollection;
  priority?: boolean;
  tall?: boolean;
}) {
  return (
    <Link
      href={collection.href}
      className="group relative block overflow-hidden border border-bb-off/10 bg-neutral-950"
    >
      <div className={cn("relative w-full", tall ? "aspect-[3/4]" : "aspect-[4/5] md:aspect-[16/10]")}>
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/35 to-transparent" />
        {collection.accent === "yellow" && (
          <span className="absolute left-4 top-4 bg-bb-yellow px-2 py-1 text-[9px] tracking-[0.22em] text-bb-black">
            TRENDING
          </span>
        )}
        {collection.accent === "red" && (
          <span className="absolute left-4 top-4 bg-bb-red px-2 py-1 text-[9px] tracking-[0.22em] text-bb-off">
            LIMITED
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <p className="text-[10px] tracking-[0.32em] text-bb-off/50">COLLECTION</p>
          <h3 className="mt-2 font-display text-2xl tracking-[0.14em] md:text-4xl">{collection.title}</h3>
          <p className="mt-2 max-w-sm text-sm text-bb-off/70">{collection.subtitle}</p>
          <p className="mt-5 text-[10px] tracking-[0.28em] text-bb-off/80 transition-colors group-hover:text-bb-off">
            SHOP NOW →
          </p>
        </div>
      </div>
    </Link>
  );
}

export function PremiumCollectionGrid({ collections }: { collections: TrendCollection[] }) {
  const [hero, ...rest] = collections;
  return (
    <div className="grid gap-3 md:grid-cols-12 md:gap-4">
      {hero && (
        <div className="md:col-span-7">
          <PremiumCollectionCard collection={hero} priority tall />
        </div>
      )}
      <div className="grid gap-3 md:col-span-5 md:gap-4">
        {rest.slice(0, 2).map((c) => (
          <PremiumCollectionCard key={c.slug} collection={c} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:col-span-12 md:grid-cols-3 md:gap-4">
        {rest.slice(2).map((c) => (
          <PremiumCollectionCard key={c.slug} collection={c} />
        ))}
      </div>
    </div>
  );
}
