import Link from "next/link";
import { SkullMark } from "@/components/brand/mark";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SkullMark className="mb-6 h-12 w-10" />
      <p className="font-display text-5xl tracking-[0.14em]">NOTHING HERE.</p>
      <p className="mt-3 text-bb-off/60">BUT YOU CAN CHANGE THAT.</p>
      <Link href="/shop" className="mt-8 border border-bb-off px-8 py-3 text-xs tracking-[0.22em]">
        BACK TO SHOP
      </Link>
    </div>
  );
}
