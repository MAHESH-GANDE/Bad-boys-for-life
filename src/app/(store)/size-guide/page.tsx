import { prisma } from "@/lib/db";

export default async function Page() {
  const guides = await prisma.sizeGuide.findMany();
  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">SIZE GUIDE</h1>
      {guides.map((g) => (
        <section key={g.id} className="mt-10">
          <h2 className="mb-3 text-sm tracking-[0.2em]">{g.title.toUpperCase()}</h2>
          <pre className="overflow-auto border border-bb-off/15 p-4 text-xs">{JSON.stringify(g.rows, null, 2)}</pre>
        </section>
      ))}
    </article>
  );
}
