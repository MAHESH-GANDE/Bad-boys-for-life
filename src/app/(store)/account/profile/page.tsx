import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getAccountDashboard } from "@/lib/account";
import { AccountProfileEditor } from "@/components/store/account-profile-editor";
import { CopyField } from "@/components/store/copy-field";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/account");

  const data = await getAccountDashboard(session.id);
  if (!data) redirect("/account");

  const { user, tier, stats } = data;
  const memberSince = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(
    new Date(user.createdAt),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link href="/account" className="text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off">
        ← ACCOUNT
      </Link>

      <div className="mt-6 border border-bb-off/20 bg-neutral-950/80 p-6 md:p-8">
        <p className="text-[10px] tracking-[0.32em] text-bb-off/50">MEMBERSHIP</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-[0.12em]">PROFILE</h1>
            <p className="mt-2 text-sm text-bb-off/60">
              {tier.label} · Member since {memberSince}
            </p>
          </div>
          <div className="text-right text-xs text-bb-off/50">
            <p>{stats.loyaltyPoints} loyalty pts</p>
            <p>{stats.orderCount} orders · {stats.addressCount} addresses saved</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {tier.perks.map((perk) => (
            <p key={perk} className="text-[10px] tracking-[0.14em] text-bb-off/55">
              ✓ {perk}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl tracking-[0.12em]">PERSONAL DETAILS</h2>
        <p className="mt-2 text-sm text-bb-off/55">Used for checkout, size memory, and member offers.</p>
        <div className="mt-6">
          <AccountProfileEditor
            user={{
              mobile: user.mobile,
              name: user.name,
              email: user.email,
              dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : null,
            }}
            tier={tier}
            profileComplete={stats.profileComplete}
          />
        </div>
      </div>

      <div className="mt-10">
        <CopyField label="YOUR REFERRAL CODE" value={user.referralCode} />
        <p className="mt-2 text-xs text-bb-off/45">Share with friends — rewards apply on their first order.</p>
      </div>
    </div>
  );
}
