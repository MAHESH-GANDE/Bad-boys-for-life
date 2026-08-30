import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  const notes = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">NOTIFICATIONS</h1>
      {notes.length === 0 && <p className="mt-8 text-bb-off/50">No alerts yet.</p>}
      <ul className="mt-8 space-y-4">
        {notes.map((n) => (
          <li key={n.id} className="border-b border-bb-off/10 pb-3">
            <p className="text-[10px] tracking-[0.16em] text-bb-off/40">{n.category}</p>
            <p>{n.title}</p>
            <p className="text-sm text-bb-off/60">{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
