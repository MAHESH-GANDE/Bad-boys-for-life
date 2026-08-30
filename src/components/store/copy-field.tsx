"use client";

import { useState } from "react";

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border border-bb-off/15 bg-neutral-950/80 p-4">
      <p className="text-[10px] tracking-[0.22em] text-bb-off/45">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <code className="truncate text-sm tracking-[0.12em]">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 border border-bb-off/25 px-3 py-1.5 text-[10px] tracking-[0.18em] hover:border-bb-off/50"
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
    </div>
  );
}
