import Link from "next/link";
import { getAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const links = [
    ["/admin", "Dashboard"],
    ["/admin/products", "Products"],
    ["/admin/inventory", "Inventory"],
    ["/admin/orders", "Orders"],
    ["/admin/customers", "Customers"],
    ["/admin/coupons", "Coupons"],
    ["/admin/cms", "CMS"],
    ["/admin/settings", "Settings"],
  ];
  return (
    <div className="min-h-screen bg-bb-black text-bb-off">
      <aside className="fixed bottom-0 left-0 top-0 hidden w-56 border-r border-bb-off/15 p-6 md:block">
        <p className="font-display tracking-[0.2em]">BADBOYS</p>
        <p className="mt-1 text-[10px] text-bb-off/40">{admin.role}</p>
        <nav className="mt-8 flex flex-col gap-3 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="text-bb-off/70 hover:text-bb-off">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-56">
        <div className="flex gap-3 overflow-x-auto border-b border-bb-off/15 px-4 py-3 text-xs md:hidden">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
