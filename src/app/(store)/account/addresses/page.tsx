import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  const addresses = await prisma.address.findMany({ where: { userId: user.id } });
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">ADDRESSES</h1>
      <ul className="mt-8 space-y-4 text-sm">
        {addresses.map((a) => (
          <li key={a.id} className="border border-bb-off/15 p-4">
            {a.fullName}
            <br />
            {a.house}, {a.street}
            <br />
            {a.city} {a.pincode}
          </li>
        ))}
      </ul>
      {addresses.length === 0 && <p className="mt-6 text-bb-off/50">No saved addresses yet.</p>}
    </div>
  );
}
