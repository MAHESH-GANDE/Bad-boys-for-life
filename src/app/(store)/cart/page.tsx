import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { getSessionUser } from "@/lib/auth";
import { CartPage } from "@/components/store/cart-page";
import { remainingForFreeShipping } from "@/lib/shipping";
import { getSiteConfig } from "@/lib/settings";

export default async function Page() {
  const user = await getSessionUser();
  const cart = await getOrCreateCart(user?.id);
  const cfg = await getSiteConfig();
  const totals = cartTotals(cart.items);
  return (
    <CartPage
      items={JSON.parse(JSON.stringify(cart.items))}
      totals={{ ...totals, remainingFree: remainingForFreeShipping(totals.subtotal, cfg.shipping) }}
    />
  );
}
