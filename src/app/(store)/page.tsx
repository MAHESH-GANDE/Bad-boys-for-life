import Link from "next/link";
import { listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import { Hero } from "@/components/store/hero";

export default async function HomePage() {
  const black = await listProducts({ colour: ["Black"], sort: "bestselling" });
  const blackNew = await listProducts({ colour: ["Black"], sort: "newest" });

  return (
    <div>
      <Hero
        title="BADBOYS"
        subtitle="FOR LIFE"
        body="THE BLACK COLLECTION"
        image="/images/hero-menswear.jpg"
        ctaLabel="SHOP BLACK"
        ctaHref="/collections/black"
        secondaryLabel="NEW IN BLACK"
        secondaryHref="/collections/black?sort=newest"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead title="THE BLACK COLLECTION" href="/collections/black" />
        <p className="-mt-4 mb-10 max-w-xl text-sm text-bb-off/60">
          Matte black. No noise. Tees, cargos, jackets — cut for the night and built to last.
        </p>
        <ProductGrid products={black.slice(0, 8)} />
      </section>

      <section className="border-y border-bb-off/15 py-24 text-center">
        <SkullMark className="mx-auto mb-6 h-14 w-12" />
        <Wordmark spaced className="text-2xl md:text-3xl" />
        <p className="mt-6 font-display text-4xl tracking-[0.16em] md:text-6xl">WE DON&apos;T FOLLOW.</p>
        <p className="mt-4 font-display text-3xl tracking-[0.16em] text-bb-off/70 md:text-5xl">
          WE WEAR OUR OWN.
        </p>
        <Link
          href="/collections/black"
          className="mt-10 inline-block bg-bb-off px-10 py-3 text-xs tracking-[0.28em] text-bb-black"
        >
          SHOP ALL BLACK
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead title="NEW IN BLACK" href="/collections/black?sort=newest" />
        <ProductGrid products={blackNew.slice(0, 4)} />
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
