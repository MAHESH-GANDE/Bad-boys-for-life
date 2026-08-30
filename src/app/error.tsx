"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-4xl tracking-[0.14em]">SOMETHING BROKE.</p>
      <p className="mt-3 text-bb-off/60">The house is still standing. Try again.</p>
      <div className="mt-8 flex gap-4">
        <button onClick={reset} className="border border-bb-off px-6 py-3 text-xs tracking-[0.2em]">
          RETRY
        </button>
        <Link href="/shop" className="bg-bb-off px-6 py-3 text-xs tracking-[0.2em] text-bb-black">
          BACK TO SHOP
        </Link>
      </div>
    </div>
  );
}
