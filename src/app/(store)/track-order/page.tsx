"use client";

import { useState } from "react";

export default function TrackOrderPage() {
  const [number, setNumber] = useState("");
  const [data, setData] = useState<{ status?: string; error?: string } | null>(null);
  async function go() {
    const res = await fetch(`/api/orders/track?number=${encodeURIComponent(number)}`);
    setData(await res.json());
  }
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">TRACK ORDER</h1>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="BAD-XXXXXX"
        className="mt-8 w-full border border-bb-off/20 bg-transparent px-3 py-3"
      />
      <button onClick={go} className="mt-4 bg-bb-off px-6 py-3 text-xs tracking-[0.2em] text-bb-black">
        TRACK
      </button>
      {data?.status && (
        <ol className="mt-10 space-y-3 text-sm">
          {["PENDING_PAYMENT", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].map((s) => (
            <li key={s} className={data.status === s ? "text-bb-off" : "text-bb-off/35"}>
              {s.replaceAll("_", " ")}
            </li>
          ))}
        </ol>
      )}
      {data?.error && <p className="mt-4 text-sm text-bb-red">{data.error}</p>}
    </div>
  );
}
