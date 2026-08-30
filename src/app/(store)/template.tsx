"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll to top and isolate page content on every route change. */
export default function StoreTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="min-h-[50vh]">
      {children}
    </div>
  );
}
