"use client";

export function SizeGuideModal({
  title,
  rows,
  onClose,
}: {
  title: string;
  rows: Record<string, string | number>[];
  onClose: () => void;
}) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[80vh] w-full max-w-xl overflow-auto border border-bb-off/20 bg-bb-black p-6">
        <div className="mb-4 flex justify-between">
          <p className="text-sm tracking-[0.2em]">{title.toUpperCase()}</p>
          <button onClick={onClose} className="text-xs tracking-[0.16em]">
            CLOSE
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-bb-off/20 text-[10px] tracking-[0.16em] text-bb-off/50">
              {keys.map((k) => (
                <th key={k} className="py-2 pr-3 uppercase">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-bb-off/10">
                {keys.map((k) => (
                  <td key={k} className="py-2 pr-3">
                    {r[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-bb-off/50">Measurements in inches. Admin-configurable.</p>
      </div>
    </div>
  );
}
