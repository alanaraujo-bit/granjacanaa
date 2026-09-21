"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  House,
  ReceiptText,
  ShoppingBasket,
  UserRound,
} from "lucide-react";
import { cartCount, cartSubtotal, useStore } from "@/lib/store";
import { Price } from "@/components/ui/Primitives";
import { IconButton } from "@/components/ui/Button";

/* ------------------------------------------------------------------ */
/* Barra superior                                                       */
/* ------------------------------------------------------------------ */
export function TopBar({
  title,
  back = true,
  backHref,
  right,
  transparent = false,
  tone = "ink",
}: {
  title?: React.ReactNode;
  back?: boolean;
  backHref?: string;
  right?: React.ReactNode;
  transparent?: boolean;
  tone?: "ink" | "cream";
}) {
  const router = useRouter();
  const goBack = () => {
    if (backHref) router.push(backHref);
    else if (window.history.length > 1) router.back();
    else router.push("/inicio");
  };
  return (
    <header
      className={`sticky top-0 z-30 flex h-[60px] items-center gap-2 px-4 ${
        transparent ? "" : "bg-ground/85 backdrop-blur-md"
      }`}
      style={{
        paddingTop: "var(--safe-top)",
        height: "calc(60px + var(--safe-top))",
      }}
    >
      {back ? (
        <IconButton
          label="Voltar"
          tone={tone === "cream" ? "cream" : "surface"}
          size={40}
          onClick={goBack}
        >
          <ChevronLeft size={22} strokeWidth={2.5} className="-ml-0.5" />
        </IconButton>
      ) : (
        <span className="w-1" />
      )}
      <h1
        className={`min-w-0 flex-1 truncate font-display text-[19px] font-bold tracking-[-0.02em] ${
          tone === "cream" ? "text-cream" : "text-ink"
        } ${back ? "" : "pl-1"}`}
      >
        {title}
      </h1>
      {right}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Barra de abas                                                        */
/* ------------------------------------------------------------------ */
const TABS = [
  { href: "/inicio", label: "Início", Icon: House },
  { href: "/pedidos", label: "Pedidos", Icon: ReceiptText },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
];

export const TAB_ROUTES = TABS.map((t) => t.href);

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="app-fixed bottom-0 z-40 border-t border-line bg-surface/92 backdrop-blur-md"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Navegação principal"
    >
      <ul className="flex h-[68px] items-stretch">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="pressable relative flex h-full flex-col items-center justify-center gap-1"
                aria-current={active ? "page" : undefined}
              >
                <span className="relative flex h-8 w-14 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-leaf-soft"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 36,
                      }}
                    />
                  )}
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className={`relative ${active ? "text-leaf-deep" : "text-ink-3"}`}
                  />
                </span>
                <span
                  className={`text-[11.5px] font-bold tracking-[0.01em] ${
                    active ? "text-leaf-deep" : "text-ink-3"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Gaveta do carrinho (flutuante)                                       */
/* ------------------------------------------------------------------ */
export function CartBar({ aboveTabs = true }: { aboveTabs?: boolean }) {
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);
  const show = hydrated && count > 0;

  return (
    <AnimatePresence>
      {show && (
        <div
          className="app-fixed pointer-events-none z-40 px-4"
          style={{
            bottom: aboveTabs
              ? "calc(68px + var(--safe-bottom) + 12px)"
              : "calc(var(--safe-bottom) + 16px)",
          }}
        >
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="pointer-events-auto"
          >
            <Link
              href="/carrinho"
              className="pressable flex h-[60px] items-center gap-3 rounded-[20px] bg-leaf-deep pl-4 pr-5 text-cream shadow-float"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold text-leaf-ink">
                <ShoppingBasket size={20} strokeWidth={2.4} />
                <motion.span
                  key={count}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1 text-[11px] font-bold text-leaf-ink"
                >
                  {count}
                </motion.span>
              </span>
              <span className="flex-1 text-[15px] font-semibold">
                Ver carrinho
              </span>
              <Price value={subtotal} size={18} className="text-cream" />
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
