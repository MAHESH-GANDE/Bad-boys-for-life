import { CatalogListing } from "@/components/store/catalog-listing";
import { parseCatalogParams } from "@/lib/search";
import { prisma } from "@/lib/db";
import { getAnonSessionId } from "@/lib/session-id";
import { getSessionUser } from "@/lib/auth";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogParams(sp);
  const q = filters.q || "";
  if (q) {
    const sessionId = await getAnonSessionId();
    const user = await getSessionUser();
    await prisma.searchHistory.create({
      data: { query: q, sessionId, userId: user?.id },
    });
  }
  return (
    <Suspense>
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <form>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products"
            className="w-full border-b border-bb-off/30 bg-transparent py-4 font-display text-2xl tracking-[0.12em] outline-none md:text-4xl"
          />
        </form>
      </div>
      <CatalogListing title={q ? `"${q.toUpperCase()}"` : "SEARCH"} filters={filters} />
    </Suspense>
  );
}
