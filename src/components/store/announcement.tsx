import Link from "next/link";

export function AnnouncementBar({
  text,
  href,
  active,
}: {
  text: string;
  href: string;
  active: boolean;
}) {
  if (!active || !text) return null;
  return (
    <div className="border-b border-bb-off/15 bg-bb-black">
      <Link
        href={href || "/shop"}
        className="flex items-center justify-center px-4 py-2 text-center text-[10px] tracking-[0.28em] uppercase text-bb-off/90"
      >
        {text}
      </Link>
    </div>
  );
}
