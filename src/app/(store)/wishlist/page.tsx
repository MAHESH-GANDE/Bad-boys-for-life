import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productCardInclude, serialize } from "@/lib/catalog";
import { ProductGrid } from "@/components/store/product-card";
import Link from "next/link";

export default async function WishlistPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <Empty
        title="YOUR WISHLIST IS EMPTY."
        cta="LOGIN TO SAVE"
        href="/account"
      />
    );
  }
  const wish = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: { items: true },
  });
  const ids = wish?.items.map((i) => i.productId) ?? [];
  const products = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } }, include: productCardInclude })
    : [];
  if (!products.length) {
    return <Empty title="YOUR WISHLIST IS EMPTY." cta="BACK TO SHOP" href="/shop" />;
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 font-display text-4xl tracking-[0.14em]">WISHLIST</h1>
      <ProductGrid products={serialize(products)} />
    </div>
  );
}

function Empty({ title, cta, href }: { title: string; cta: string; href: string }) {
  return (
    <div className="px-4 py-24 text-center">
      <p className="font-display text-4xl tracking-[0.12em]">{title}</p>
      <Link href={href} className="mt-8 inline-block border border-bb-off px-8 py-3 text-xs tracking-[0.2em]">
        {cta}
      </Link>
    </div>
  );
}
