import Link from "next/link";
import { SkullMark } from "@/components/brand/mark";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  return (
    <SuccessInner searchParams={searchParams} />
  );
}

async function SuccessInner({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="px-4 py-24 text-center">
      <SkullMark className="mx-auto mb-6 h-12 w-10" />
      <p className="font-display text-5xl tracking-[0.14em]">IT&apos;S YOURS.</p>
      <p className="mt-4 text-bb-off/60">{order ? `Order ${order}` : "Order confirmed."}</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/account/orders" className="border border-bb-off px-6 py-3 text-xs tracking-[0.2em]">
          TRACK
        </Link>
        <Link href="/shop" className="bg-bb-off px-6 py-3 text-xs tracking-[0.2em] text-bb-black">
          KEEP SHOPPING
        </Link>
      </div>
    </div>
  );
}
