import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import { Hero } from "@/components/store/hero";

export default async function HomePage() {
  const hero = await prisma.homepageSection.findUnique({ where: { key: "hero" } });
  const statement = await prisma.homepageSection.findUnique({ where: { key: "brand-statement" } });
  const editorial = await prisma.homepageSection.findUnique({ where: { key: "editorial" } });
  const story = await prisma.homepageSection.findUnique({ where: { key: "story" } });
  const cats = await prisma.category.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  const newest = await listProducts({ sort: "newest" });
  const best = await listProducts({ sort: "bestselling" });
  const limited = (await listProducts()).filter((p) => p.isLimited);
  const look = await prisma.look.findFirst({
    where: { published: true },
    include: { items: { include: { product: { include: { images: true, variants: { include: { inventory: true } }, category: true } } } } },
  });

  return (
    <div>
      <Hero
        title={hero?.title || "BADBOYS"}
        subtitle={hero?.subtitle || "FOR LIFE"}
        body={hero?.body || "MENSWEAR"}
        image={hero?.image || "/images/hero-menswear.jpg"}
        ctaLabel={hero?.ctaLabel || "SHOP MEN"}
        ctaHref={hero?.ctaHref || "/shop"}
        secondaryLabel={(hero?.config as { secondaryCta?: string } | null)?.secondaryCta || "EXPLORE NEW DROP"}
        secondaryHref={(hero?.config as { secondaryHref?: string } | null)?.secondaryHref || "/new-arrivals"}
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead title="NEW DROP" href="/new-arrivals" />
        <ProductGrid products={newest.slice(0, 8)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="SHOP BY CATEGORY" href="/shop" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="group border border-bb-off/15 p-8 text-center">
              <p className="font-display text-2xl tracking-[0.14em]">{c.name.toUpperCase()}</p>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-bb-off/40 group-hover:text-bb-off">SHOP</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-bb-off/15 py-24 text-center">
        <SkullMark className="mx-auto mb-8 h-14 w-12" />
        <p className="font-display text-4xl tracking-[0.16em] md:text-6xl">{statement?.title || "WE DON'T FOLLOW."}</p>
        <p className="mt-4 font-display text-3xl tracking-[0.16em] text-bb-off/70 md:text-5xl">
          {statement?.subtitle || "WE WEAR OUR OWN."}
        </p>
      </section>

      {look && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div className="relative aspect-[3/4] bg-neutral-950">
            <Image src={look.image} alt={look.name} fill className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.28em] text-bb-off/50">SHOP THE LOOK</p>
            <h2 className="mt-3 font-display text-5xl tracking-[0.12em]">{look.name}</h2>
            <p className="mt-4 max-w-md text-bb-off/70">{look.description}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {look.items.map((i) => (
                <li key={i.productId}>
                  <Link href={`/product/${i.product.slug}`} className="hover:underline">
                    {i.product.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="mt-8 inline-block bg-bb-off px-8 py-3 text-xs tracking-[0.24em] text-bb-black">
              SHOP THE LOOK
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead title="BESTSELLERS" href="/bestsellers" />
        <ProductGrid products={best.slice(0, 8)} />
      </section>

      {editorial && (
        <section className="relative min-h-[60vh]">
          <Image src={editorial.image || "/images/campaign-night.jpg"} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <p className="font-display text-5xl tracking-[0.2em] md:text-7xl">{editorial.title}</p>
            <p className="mt-4 max-w-lg text-bb-off/80">{editorial.body}</p>
            <Link href={editorial.ctaHref || "/shop"} className="mt-8 border border-bb-off px-8 py-3 text-xs tracking-[0.24em]">
              {editorial.ctaLabel || "SHOP"}
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead title="LIMITED DROP" href="/collections/limited-edition" />
        <ProductGrid products={limited.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-[10px] tracking-[0.28em] text-bb-off/50">SOCIAL PROOF FROM REAL ORDERS</p>
        <p className="mt-4 text-bb-off/70">Ratings and “bought today” counts appear only after real purchases and approved reviews.</p>
      </section>

      {story && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <Wordmark spaced className="text-3xl" />
            <h2 className="mt-6 font-display text-4xl tracking-[0.12em]">{story.title}</h2>
            <p className="mt-4 max-w-md text-bb-off/70">{story.body}</p>
            <Link href={story.ctaHref || "/about"} className="mt-8 inline-block text-xs tracking-[0.24em] underline">
              {story.ctaLabel || "OUR STORY"}
            </Link>
          </div>
          <div className="relative aspect-video bg-neutral-950">
            <Image src={story.image || "/images/editorial-still.jpg"} alt="" fill className="object-cover" />
          </div>
        </section>
      )}

      <section className="border-t border-bb-off/15 px-4 py-20 text-center">
        <p className="font-display text-3xl tracking-[0.16em]">GET THE DROP</p>
        <form className="mx-auto mt-6 flex max-w-md border border-bb-off/20">
          <input
            type="email"
            required
            placeholder="EMAIL"
            className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          />
          <button className="bg-bb-off px-6 text-xs tracking-[0.2em] text-bb-black">JOIN</button>
        </form>
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
