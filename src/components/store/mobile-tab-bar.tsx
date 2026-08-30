"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shirt, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/collections", label: "Collections", icon: Shirt },
  { href: "/search", label: "Search", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileTabBar() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/checkout")) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-bb-off/15 bg-bb-black md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] tracking-[0.16em] uppercase",
                  active ? "text-bb-off" : "text-bb-off/50",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
