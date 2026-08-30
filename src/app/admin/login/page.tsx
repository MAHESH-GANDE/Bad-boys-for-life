"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SkullMark } from "@/components/brand/mark";

export default function AdminLogin() {
  const [email, setEmail] = useState("nathan.k@example.net");
  const [password, setPassword] = useState("BadBoys#Admin1");
  const [err, setErr] = useState("");
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-bb-black px-4">
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) setErr(data.error);
          else router.push("/admin");
        }}
      >
        <SkullMark className="mx-auto h-10 w-8" />
        <p className="text-center font-display text-2xl tracking-[0.2em]">ADMIN</p>
        {err && <p className="text-sm text-bb-red">{err}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <button className="w-full bg-bb-off py-3 text-xs tracking-[0.24em] text-bb-black">ENTER</button>
      </form>
    </div>
  );
}
