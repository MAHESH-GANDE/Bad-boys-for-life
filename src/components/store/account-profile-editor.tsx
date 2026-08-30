"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccountDashboard } from "@/lib/account";

export function AccountProfileEditor({
  user,
  tier,
  profileComplete,
}: {
  user: {
    mobile: string;
    name: string | null;
    email: string | null;
    dateOfBirth: string | null;
  };
  tier: AccountDashboard["tier"];
  profileComplete: number;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [dob, setDob] = useState(user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErr("");
    setMsg("");
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        dateOfBirth: dob || undefined,
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setErr(data.error || "Could not save.");
      return;
    }
    setMsg("Profile updated.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">
      {err && <p className="border border-bb-red px-3 py-2 text-sm text-bb-red">{err}</p>}
      {msg && <p className="border border-bb-off/25 px-3 py-2 text-sm text-bb-off/70">{msg}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] text-bb-off/45">FULL NAME</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full border border-bb-off/20 bg-transparent px-3 py-3"
          />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] text-bb-off/45">MOBILE</span>
          <input value={user.mobile} disabled className="mt-2 w-full border border-bb-off/10 bg-bb-off/5 px-3 py-3 text-bb-off/50" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] text-bb-off/45">EMAIL</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-2 w-full border border-bb-off/20 bg-transparent px-3 py-3"
          />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] text-bb-off/45">DATE OF BIRTH</span>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-2 w-full border border-bb-off/20 bg-transparent px-3 py-3"
          />
        </label>
      </div>

      <div className="border border-bb-off/15 p-4">
        <p className="text-[10px] tracking-[0.2em] text-bb-off/45">PROFILE STRENGTH</p>
        <div className="mt-3 h-1.5 bg-bb-off/10">
          <div className="h-full bg-bb-off" style={{ width: `${profileComplete}%` }} />
        </div>
        <p className="mt-2 text-xs text-bb-off/50">{profileComplete}% · Tier {tier.label}</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-bb-off px-8 py-3 text-xs tracking-[0.24em] text-bb-black disabled:opacity-50"
      >
        {pending ? "SAVING…" : "SAVE PROFILE"}
      </button>
    </form>
  );
}
