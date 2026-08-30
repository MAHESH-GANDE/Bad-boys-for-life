"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const links = [
  ["/account/profile", "Profile"],
  ["/account/orders", "Orders"],
  ["/account/addresses", "Addresses"],
  ["/account/wishlist", "Wishlist"],
  ["/account/coupons", "Coupons"],
  ["/account/notifications", "Notifications"],
  ["/returns", "Returns"],
  ["/exchanges", "Exchanges"],
];

export function AccountHome({
  user,
}: {
  user: { mobile: string; name: string | null; email: string | null } | null;
}) {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [dev, setDev] = useState("");
  const [err, setErr] = useState("");

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl tracking-[0.14em]">ACCOUNT</h1>
        <p className="mt-2 text-sm text-bb-off/50">OTP login. No passwords.</p>
        {err && <p className="mt-4 text-sm text-bb-red">{err}</p>}
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" className="mt-8 w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <button
          className="mt-3 border border-bb-off px-4 py-2 text-xs tracking-[0.2em]"
          onClick={async () => {
            const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile, action: "request" }) });
            const data = await res.json();
            if (!res.ok) setErr(data.error);
            else setDev(data.devOtp || "");
          }}
        >
          SEND OTP
        </button>
        {dev && <p className="mt-2 text-xs text-bb-off/50">Dev OTP: {dev}</p>}
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" className="mt-4 w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <button
          className="mt-4 w-full bg-bb-off py-3 text-xs tracking-[0.24em] text-bb-black"
          onClick={async () => {
            const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile, action: "verify", code: otp }) });
            const data = await res.json();
            if (!res.ok) setErr(data.error);
            else router.refresh();
          }}
        >
          ENTER
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">ACCOUNT</h1>
      <p className="mt-2 text-sm text-bb-off/60">{user.name || "BADBOY"} · {user.mobile}</p>
      <ul className="mt-10 divide-y divide-bb-off/15 border-y border-bb-off/15">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="block py-4 text-sm tracking-[0.12em]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="mt-8 text-xs tracking-[0.2em] text-bb-off/50"
        onClick={async () => {
          await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
          router.refresh();
        }}
      >
        LOGOUT
      </button>
    </div>
  );
}
