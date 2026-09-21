"use client";

import { usePathname } from "next/navigation";
import { CartBar, TAB_ROUTES, TabBar } from "@/components/app/Shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasTabs = TAB_ROUTES.includes(pathname);
  const showCart = pathname === "/inicio";

  return (
    <div
      className="app-frame flex min-h-dvh flex-col"
      style={{ paddingBottom: hasTabs ? "calc(68px + var(--safe-bottom))" : undefined }}
    >
      {children}
      {hasTabs && <TabBar />}
      {showCart && <CartBar />}
    </div>
  );
}
