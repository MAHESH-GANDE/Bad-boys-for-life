import { AdminShell } from "@/components/admin/shell";
import { getSiteConfig } from "@/lib/settings";

export default async function Page() {
  const cfg = await getSiteConfig();
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">SETTINGS</h1>
        <pre className="mt-8 overflow-auto border border-bb-off/15 p-4 text-xs text-bb-off/70">{JSON.stringify(cfg, null, 2)}</pre>
        <p className="mt-4 text-xs text-bb-off/40">GSTIN, fees, COD, and analytics IDs live here. Do not hardcode business details in UI.</p>
      </div>
    </AdminShell>
  );
}
