import Link from "next/link";
import { formatInr } from "@/lib/utils";
import type { AccountDashboard } from "@/lib/account";
import { CopyField } from "@/components/store/copy-field";
import { AccountLogoutButton } from "@/components/store/account-logout-button";

const quickLinks = [
  { href: "/account/profile", label: "Profile", desc: "Name, email, size prefs" },
  { href: "/account/orders", label: "Orders", desc: "Track & reorder" },
  { href: "/account/addresses", label: "Addresses", desc: "Delivery book" },
  { href: "/account/wishlist", label: "Wishlist", desc: "Saved pieces" },
  { href: "/account/coupons", label: "Coupons", desc: "Member codes" },
  { href: "/account/notifications", label: "Alerts", desc: "Drop & order updates" },
] as const;

function tierAccent(id: AccountDashboard["tier"]["id"]) {
  if (id === "black") return "border-bb-off/40 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black";
  if (id === "premium") return "border-bb-off/30 bg-gradient-to-br from-neutral-900 to-neutral-950";
  return "border-bb-off/20 bg-neutral-950/80";
}

export function AccountDashboard({ data }: { data: AccountDashboard }) {
  const { user, tier, stats, recentOrders, defaultAddress } = data;
  const memberSince = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(
    new Date(user.createdAt),
  );
  const displayName = user.name?.trim() || "BADBOY";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      {/* Membership hero */}
      <section className={`border p-6 md:p-8 ${tierAccent(tier.id)}`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">WELCOME BACK</p>
            <h1 className="mt-2 font-display text-4xl tracking-[0.12em] md:text-5xl">{displayName.toUpperCase()}</h1>
            <p className="mt-2 text-sm text-bb-off/60">
              {user.mobile}
              {user.email ? ` · ${user.email}` : " · Add email in profile"}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-bb-off/45">Member since {memberSince}</p>
          </div>
          <div className="shrink-0 text-left md:text-right">
            <span className="inline-block border border-bb-off/30 bg-bb-off/10 px-3 py-1 text-[10px] tracking-[0.24em]">
              {tier.label}
            </span>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-bb-off/55 md:ml-auto">{tier.blurb}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tier.perks.map((perk) => (
            <div key={perk} className="border border-bb-off/10 bg-black/20 px-3 py-2 text-[10px] tracking-[0.14em] text-bb-off/70">
              ✓ {perk.toUpperCase()}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "ORDERS", value: String(stats.orderCount), href: "/account/orders" },
          { label: "WISHLIST", value: String(stats.wishlistCount), href: "/account/wishlist" },
          { label: "LOYALTY PTS", value: String(stats.loyaltyPoints), href: "/account/profile" },
          { label: "LIFETIME SPEND", value: formatInr(stats.totalSpent), href: "/account/orders" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-bb-off/15 bg-neutral-950/50 p-4 transition hover:border-bb-off/35"
          >
            <p className="text-[10px] tracking-[0.22em] text-bb-off/45">{s.label}</p>
            <p className="mt-2 font-display text-2xl tracking-[0.08em]">{s.value}</p>
          </Link>
        ))}
      </section>

      {/* Profile completion */}
      {stats.profileComplete < 100 && (
        <section className="mt-8 border border-bb-off/15 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-bb-off/45">PROFILE COMPLETION</p>
              <p className="mt-1 text-sm text-bb-off/70">Complete your profile for size memory & member offers.</p>
            </div>
            <Link href="/account/profile" className="border border-bb-off px-4 py-2 text-[10px] tracking-[0.2em]">
              COMPLETE →
            </Link>
          </div>
          <div className="mt-4 h-1.5 bg-bb-off/10">
            <div className="h-full bg-bb-off transition-all" style={{ width: `${stats.profileComplete}%` }} />
          </div>
          <p className="mt-2 text-[10px] tracking-[0.16em] text-bb-off/45">{stats.profileComplete}% complete</p>
        </section>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Quick links */}
        <section className="lg:col-span-2">
          <h2 className="font-display text-2xl tracking-[0.12em]">YOUR HUB</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group border border-bb-off/15 p-4 transition hover:border-bb-off/35"
              >
                <p className="text-sm tracking-[0.12em] group-hover:text-bb-off">{link.label.toUpperCase()}</p>
                <p className="mt-1 text-xs text-bb-off/50">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <CopyField label="REFERRAL CODE · SHARE & EARN" value={user.referralCode} />

          {defaultAddress && (
            <div className="border border-bb-off/15 p-4">
              <p className="text-[10px] tracking-[0.22em] text-bb-off/45">DEFAULT ADDRESS</p>
              <p className="mt-2 text-sm text-bb-off/75">
                {defaultAddress.fullName}
                <br />
                {defaultAddress.house}, {defaultAddress.street}
                <br />
                {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
              </p>
              <Link href="/account/addresses" className="mt-3 inline-block text-[10px] tracking-[0.18em] text-bb-off/50 hover:text-bb-off">
                MANAGE →
              </Link>
            </div>
          )}

          <div className="border border-bb-off/15 p-4">
            <p className="text-[10px] tracking-[0.22em] text-bb-off/45">SEGMENT</p>
            <p className="mt-2 text-sm tracking-[0.12em]">{user.segment.replace(/_/g, " ")}</p>
            <p className="mt-1 text-xs text-bb-off/50">Auto-updated from your order activity.</p>
          </div>

          <AccountLogoutButton />
        </aside>
      </div>

      {/* Recent orders */}
      <section className="mt-12 border-t border-bb-off/15 pt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl tracking-[0.12em]">RECENT ORDERS</h2>
          <Link href="/account/orders" className="text-[10px] tracking-[0.2em] text-bb-off/50 hover:text-bb-off">
            VIEW ALL →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="mt-6 border border-dashed border-bb-off/20 p-8 text-center">
            <p className="text-sm text-bb-off/50">No orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block border border-bb-off px-6 py-2 text-[10px] tracking-[0.2em]">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-bb-off/10 border-y border-bb-off/10">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm tracking-[0.1em]">{o.number}</p>
                    <p className="text-[10px] tracking-[0.16em] text-bb-off/45">
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(o.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatInr(Number(o.grandTotal))}</p>
                    <p className="text-[10px] tracking-[0.16em] text-bb-off/45">{o.status.replace(/_/g, " ")}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
