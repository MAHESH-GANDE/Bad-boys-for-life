"use client";

import Link from "next/link";
import { useState } from "react";
import { normalizeMobileInput, normalizeOtpInput } from "@/lib/validations";

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
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [dev, setDev] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState<"send" | "verify" | null>(null);
  const [err, setErr] = useState("");

  async function sendOtp() {
    setPending("send");
    setErr("");
    const normalized = normalizeMobileInput(mobile);
    if (!/^[6-9]\d{9}$/.test(normalized)) {
      setErr("Enter a valid 10-digit mobile (e.g. 9876543210 or +91 9876543210).");
      setPending(null);
      return;
    }
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mobile: normalized, action: "request" }),
    });
    const data = await res.json();
    setPending(null);
    if (!res.ok) {
      setErr(data.error || "Could not send OTP.");
      return;
    }
    setMobile(normalized);
    setSent(true);
    setDev(data.devOtp || "");
  }

  async function verifyLogin() {
    setPending("verify");
    setErr("");
    const normalizedMobile = normalizeMobileInput(mobile);
    const normalizedOtp = normalizeOtpInput(otp);
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      setErr("Enter your 10-digit mobile number first.");
      setPending(null);
      return;
    }
    if (normalizedOtp.length !== 6) {
      setErr("Enter the 6-digit OTP.");
      setPending(null);
      return;
    }
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mobile: normalizedMobile, action: "verify", code: normalizedOtp }),
    });
    const data = await res.json();
    setPending(null);
    if (!res.ok) {
      setErr(data.error || "That code did not work.");
      return;
    }
    window.location.href = "/account";
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl tracking-[0.14em]">ACCOUNT</h1>
        <p className="mt-2 text-sm text-bb-off/50">OTP login. No passwords.</p>
        {err && <p className="mt-4 border border-bb-red px-3 py-2 text-sm text-bb-red">{err}</p>}
        {sent && !err && (
          <p className="mt-4 border border-bb-off/20 px-3 py-2 text-sm text-bb-off/70">
            OTP sent to {mobile}. Enter it below.
          </p>
        )}
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile · 9876543210"
          inputMode="tel"
          autoComplete="tel"
          className="mt-8 w-full border border-bb-off/20 bg-transparent px-3 py-3"
        />
        <button
          type="button"
          disabled={pending === "send"}
          className="mt-3 border border-bb-off px-4 py-2 text-xs tracking-[0.2em] disabled:opacity-50"
          onClick={sendOtp}
        >
          {pending === "send" ? "SENDING…" : sent ? "RESEND OTP" : "SEND OTP"}
        </button>
        {dev && <p className="mt-2 text-xs text-bb-off/50">Dev OTP: {dev}</p>}
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
          inputMode="numeric"
          maxLength={6}
          className="mt-4 w-full border border-bb-off/20 bg-transparent px-3 py-3"
        />
        <button
          type="button"
          disabled={pending === "verify"}
          className="mt-4 w-full bg-bb-off py-3 text-xs tracking-[0.24em] text-bb-black disabled:opacity-50"
          onClick={verifyLogin}
        >
          {pending === "verify" ? "VERIFYING…" : "ENTER"}
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
        type="button"
        className="mt-8 text-xs tracking-[0.2em] text-bb-off/50"
        onClick={async () => {
          await fetch("/api/auth/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ action: "logout" }),
          });
          window.location.href = "/account";
        }}
      >
        LOGOUT
      </button>
    </div>
  );
}
