import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CollectionsPage() {
  const cols = await prisma.collection.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="font-display text-5xl tracking-[0.16em]">COLLECTIONS</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cols.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="border border-bb-off/15 p-10">
            <p className="font-display text-3xl tracking-[0.12em]">{c.name.toUpperCase()}</p>
            <p className="mt-2 text-[10px] tracking-[0.2em] text-bb-off/40">ENTER</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
