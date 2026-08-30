import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">PROFILE</h1>
      <p className="mt-4 text-bb-off/70">{user.mobile}</p>
      <p className="text-bb-off/50">{user.email || "Add email at checkout."}</p>
      <p className="mt-6 text-xs tracking-[0.16em] text-bb-off/40">REFERRAL {user.referralCode}</p>
    </div>
  );
}
