"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight, ReceiptText } from "lucide-react";
import { PRODUCT_MAP } from "@/lib/catalog";
import { autoStageFor, useStore } from "@/lib/store";
import { STAGES } from "@/lib/useOrder";
import { formatDateTime, money, plural } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Chip, Skeleton } from "@/components/ui/Primitives";
import { TopBar } from "@/components/app/Shell";
import { ProductImage } from "@/components/app/ProductCard";
import { Egg } from "@/components/illustrations/Egg";

export default function OrdersPage() {
  const hydrated = useStore((s) => s.hydrated);
  const orders = useStore((s) => s.orders);

  return (
    <main className="flex flex-1 flex-col pb-8">
      <TopBar title="Meus pedidos" back={false} />

      {!hydrated ? (
        <div className="flex flex-col gap-3 px-5 pt-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-[20px]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-1 flex-col items-center px-8 pt-14 text-center">
          <div className="relative">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-surface-2">
              <ReceiptText size={44} className="text-ink-3" strokeWidth={1.6} />
            </div>
            <Egg width={44} tone="cream" className="absolute -left-3 top-2 -rotate-12" />
          </div>
          <h2 className="mt-7 font-display text-[24px] font-semibold text-ink">Nenhum pedido ainda</h2>
          <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-ink-2">
            Seus pedidos aparecem aqui com o acompanhamento em tempo real da entrega.
          </p>
          <Button href="/inicio" className="mt-7" iconRight={<ArrowRight size={18} />}>
            Fazer meu primeiro pedido
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 px-5 pt-1">
          {orders.map((o, i) => {
            const stage = autoStageFor(o);
            const delivered = stage >= 3;
            const count = o.items.reduce((a, it) => a + it.qty, 0);
            const first = PRODUCT_MAP[o.items[0]?.productId];
            return (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 5) * 0.05 }}
              >
                <Link
                  href={`/pedido/${o.id}`}
                  className="pressable flex items-center gap-3 rounded-[20px] border border-line bg-surface p-3 shadow-card"
                >
                  {first ? (
                    <ProductImage product={first} className="h-[72px] w-[88px] shrink-0 rounded-[14px]" size="thumb" />
                  ) : (
                    <div className="h-[72px] w-[88px] shrink-0 rounded-[14px] bg-surface-2" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="tabular font-display text-[15.5px] font-semibold text-ink">{o.id}</span>
                      <Chip tone={delivered ? "neutral" : stage === 2 ? "gold" : "leaf"}>
                        {!delivered && (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                        {STAGES[stage].title}
                      </Chip>
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-ink-3">
                      {count} {plural(count, "item", "itens")} · {formatDateTime(o.createdAt)}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-ink">{money(o.total)}</p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-ink-3" />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
