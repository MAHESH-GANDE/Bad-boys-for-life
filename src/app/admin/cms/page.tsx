import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";

export default async function Page() {
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  const banners = await prisma.banner.findMany();
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">CMS</h1>
        <p className="mt-2 text-sm text-bb-off/50">Homepage copy is stored in HomepageSection — not hardcoded in production edits.</p>
        <ul className="mt-8 space-y-3 text-sm">
          {sections.map((s) => (
            <li key={s.id} className="border border-bb-off/15 p-4">
              <p className="tracking-[0.16em]">{s.key}</p>
              <p>{s.title}</p>
              <p className="text-bb-off/50">{s.body}</p>
            </li>
          ))}
          {banners.map((b) => (
            <li key={b.id} className="border border-bb-off/15 p-4">
              Announcement: {b.title}
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
