"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShoppingBasket, Truck } from "lucide-react";
import { FREE_DELIVERY_MIN, PRODUCT_MAP, PRODUCTS } from "@/lib/catalog";
import { cartCount, cartSubtotal, deliveryFeeFor, useStore } from "@/lib/store";
import { money, plural } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Price, QtyStepper, Skeleton } from "@/components/ui/Primitives";
import { TopBar } from "@/components/app/Shell";
import { ProductImage, ProductRowCard } from "@/components/app/ProductCard";
import { Egg } from "@/components/illustrations/Egg";

export default function CartPage() {
  const hydrated = useStore((s) => s.hydrated);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);

  const items = cart
    .map((c) => ({ ...c, product: PRODUCT_MAP[c.productId] }))
    .filter((c) => !!c.product);
  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);
  const fee = deliveryFeeFor(subtotal);
  const total = subtotal + fee;
  const missing = Math.max(0, FREE_DELIVERY_MIN - subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_MIN);

  const suggestions = PRODUCTS.filter((p) => !cart.some((c) => c.productId === p.id)).slice(0, 3);

  return (
    <main className="flex min-h-dvh flex-col pb-40">
      <TopBar
        title={
          <span className="flex items-baseline gap-2">
            Seu carrinho
            {hydrated && count > 0 && (
              <span className="text-[14px] font-semibold text-ink-3">
                {count} {plural(count, "item", "itens")}
              </span>
            )}
          </span>
        }
        backHref="/inicio"
      />

      {!hydrated ? (
        <div className="flex flex-col gap-3 px-5 pt-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-[104px] w-full rounded-[20px]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          {/* barra de frete grátis */}
          <div className="mx-5 mt-1 rounded-[18px] border border-line bg-surface px-4 py-3 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf">
                <Truck size={16} strokeWidth={2.4} />
              </span>
              <p className="text-[13.5px] leading-snug text-ink-2">
                {missing > 0 ? (
                  <>
                    Faltam <strong className="text-ink">{money(missing)}</strong> para a entrega grátis
                  </>
                ) : (
                  <>
                    <strong className="text-leaf-deep">Entrega grátis</strong> liberada neste pedido
                  </>
                )}
              </p>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full bg-leaf"
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {/* itens */}
          <ul className="mt-4 flex flex-col gap-3 px-5">
            <AnimatePresence initial={false}>
              {items.map(({ product, qty }) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-3 shadow-card"
                >
                  <Link href={`/produto/${product.id}`} className="shrink-0">
                    <ProductImage product={product} className="h-[76px] w-[96px] rounded-[14px]" size="thumb" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-[15.5px] font-semibold text-ink">{product.shortName}</h3>
                    <p className="text-[12.5px] text-ink-3">{product.unit}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Price value={product.price * qty} size={17} className="text-ink" />
                      <QtyStepper value={qty} onChange={(v) => setQty(product.id, v)} size="sm" allowRemove />
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* sugestões */}
          {suggestions.length > 0 && (
            <>
              <h2 className="mt-8 px-5 font-display text-[18px] font-semibold text-ink">Que tal levar também?</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
                {suggestions.map((p) => (
                  <ProductRowCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}

          {/* resumo fixo */}
          <div
            className="app-fixed bottom-0 z-40 border-t border-line bg-surface/95 px-5 pt-3 backdrop-blur-md"
            style={{ paddingBottom: "calc(14px + var(--safe-bottom))" }}
          >
            <dl className="mb-3 flex flex-col gap-1 text-[14px]">
              <div className="flex justify-between text-ink-2">
                <dt>Subtotal</dt>
                <dd className="tabular font-semibold">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-2">
                <dt>Entrega</dt>
                <dd className={`tabular font-semibold ${fee === 0 ? "text-leaf-deep" : ""}`}>
                  {fee === 0 ? "Grátis" : money(fee)}
                </dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2 text-ink">
                <dt className="font-display text-[17px] font-semibold">Total</dt>
                <dd>
                  <Price value={total} size={22} />
                </dd>
              </div>
            </dl>
            <Button href="/checkout" full iconRight={<ArrowRight size={20} />}>
              Finalizar pedido
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center px-8 pt-12 text-center">
      <div className="relative">
        <span className="absolute inset-0 -z-10 scale-125 rounded-full bg-gold-soft blur-2xl" />
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-surface-2">
          <ShoppingBasket size={44} className="text-ink-3" strokeWidth={1.6} />
        </div>
        <Egg width={44} tone="brown" className="absolute -right-2 -top-1 rotate-12" />
      </div>
      <h2 className="mt-7 font-display text-[24px] font-semibold text-ink">Seu carrinho está vazio</h2>
      <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-ink-2">
        Que tal começar por uma caixa de 12 ovos caipiras colhidos hoje de manhã?
      </p>
      <Button href="/inicio" className="mt-7" iconRight={<ArrowRight size={18} />}>
        Ver o catálogo
      </Button>
    </div>
  );
}
