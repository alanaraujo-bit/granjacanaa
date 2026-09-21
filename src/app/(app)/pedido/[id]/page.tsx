"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronRight,
  FastForward,
  Home,
  MessageCircle,
  Package,
  RotateCcw,
  Truck,
  Warehouse,
} from "lucide-react";
import { BRAND, DELIVERY_WINDOWS, PAYMENT_LABEL, PRODUCT_MAP } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { STAGES, useOrder } from "@/lib/useOrder";
import { formatTime, money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Chip, Price, Skeleton } from "@/components/ui/Primitives";
import { TopBar } from "@/components/app/Shell";
import { useToast } from "@/components/ui/Toast";

const ROAD_ICONS = [Warehouse, Package, Truck, Home];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const hydrated = useStore((s) => s.hydrated);
  const advanceStage = useStore((s) => s.advanceStage);
  const addToCart = useStore((s) => s.addToCart);
  const { order, progress } = useOrder(id);

  if (hydrated && !order) {
    return (
      <main className="flex flex-1 flex-col">
        <TopBar title="Pedido" backHref="/pedidos" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <h1 className="font-display text-[22px] font-semibold text-ink">Pedido não encontrado</h1>
          <p className="mt-2 text-ink-2">Talvez ele tenha sido feito em outro aparelho.</p>
          <Button href="/pedidos" className="mt-6">
            Ver meus pedidos
          </Button>
        </div>
      </main>
    );
  }

  const stage = order?.stage ?? 0;
  const delivered = stage >= 3;
  const win = order ? DELIVERY_WINDOWS.find((w) => w.id === order.delivery.slot) : undefined;
  // posição do marcador na estrada: 0..1 entre paradas
  const roadPos = delivered ? 1 : (stage + progress) / 3;

  const reorder = () => {
    if (!order) return;
    order.items.forEach((it) => addToCart(it.productId, it.qty));
    toast({ kind: "success", title: "Itens adicionados ao carrinho" });
    router.push("/carrinho");
  };

  return (
    <main className="flex flex-1 flex-col pb-12">
      <TopBar
        title={
          <span className="flex items-center gap-2">
            Pedido <span className="tabular text-leaf-deep" data-selectable>{order?.id ?? ""}</span>
          </span>
        }
        backHref="/pedidos"
      />

      {/* status atual */}
      <section
        className="relative mx-5 overflow-hidden rounded-[24px] p-5 text-cream shadow-float"
        style={{ background: "radial-gradient(100% 80% at 100% 0%, #2f7446 0%, #1e4d2c 70%)" }}
      >
        {order ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-cream/70">
                  {delivered ? "Concluído" : "Status agora"}
                </p>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={stage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 font-display text-[26px] font-semibold leading-[1.05] text-gold"
                  >
                    {STAGES[stage].title}
                  </motion.h2>
                </AnimatePresence>
                <p className="mt-1.5 text-[14px] text-cream/85">
                  {delivered ? STAGES[3].text : STAGES[stage].doing}
                </p>
              </div>
              {!delivered && (
                <span className="relative mt-1 flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
                </span>
              )}
            </div>

            {/* estrada */}
            <div className="relative mt-6 h-16">
              <div className="absolute inset-x-5 top-[22px] h-1.5 rounded-full bg-cream/20" />
              <motion.div
                className="absolute left-5 top-[22px] h-1.5 rounded-full bg-gold"
                initial={false}
                animate={{ width: `calc((100% - 40px) * ${roadPos})` }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
              />
              {ROAD_ICONS.map((Icon, i) => {
                const reached = i <= stage;
                return (
                  <div
                    key={i}
                    className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                    style={{ left: `calc(20px + (100% - 40px) * ${i / 3})` }}
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                        reached ? "border-gold bg-gold text-leaf-ink" : "border-cream/30 bg-leaf-deep text-cream/50"
                      }`}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </span>
                  </div>
                );
              })}
              {/* marcador móvel */}
              {!delivered && (
                <motion.span
                  className="absolute top-[14px] flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-cream text-leaf-deep shadow-float"
                  initial={false}
                  animate={{ left: `calc(20px + (100% - 40px) * ${roadPos})` }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <Truck size={13} strokeWidth={2.6} />
                </motion.span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[13px] text-cream/80">
              <span>
                Previsão:{" "}
                <strong className="text-cream">
                  {order.delivery.day === "hoje" ? "hoje" : "amanhã"}, {win?.range}
                </strong>
              </span>
              <Chip tone="gold">{PAYMENT_LABEL[order.payment]}</Chip>
            </div>
          </>
        ) : (
          <div>
            <Skeleton className="h-4 w-24 bg-cream/20" />
            <Skeleton className="mt-3 h-8 w-48 bg-cream/20" />
            <Skeleton className="mt-6 h-12 w-full bg-cream/20" />
          </div>
        )}
      </section>

      {/* timeline */}
      <section className="mx-5 mt-4 rounded-[22px] border border-line bg-surface p-5 shadow-card">
        <h3 className="font-display text-[18px] font-semibold text-ink">Acompanhamento</h3>
        <ol className="mt-4">
          {STAGES.map((s, i) => {
            const done = i < stage || delivered;
            const current = i === stage && !delivered;
            const time = order?.stageTimes[i];
            const last = i === STAGES.length - 1;
            return (
              <li key={s.title} className="relative flex gap-4">
                {/* marcador + conector */}
                <div className="flex w-7 flex-col items-center">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                      done
                        ? "border-leaf bg-leaf text-cream"
                        : current
                          ? "border-gold bg-gold text-leaf-ink"
                          : "border-line-strong bg-surface"
                    }`}
                  >
                    {done ? (
                      <Check size={14} strokeWidth={3.5} />
                    ) : current ? (
                      <motion.span
                        className="h-2.5 w-2.5 rounded-full bg-leaf-ink"
                        animate={{ scale: [1, 0.6, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                      />
                    ) : null}
                  </span>
                  {!last && (
                    <span className="relative my-1 w-0.5 flex-1 rounded-full bg-line" style={{ minHeight: 34 }}>
                      <motion.span
                        className="absolute left-0 top-0 w-full rounded-full bg-leaf"
                        initial={false}
                        animate={{ height: done ? "100%" : current ? `${Math.round(progress * 100)}%` : "0%" }}
                        transition={{ ease: "linear", duration: 0.9 }}
                      />
                    </span>
                  )}
                </div>
                <div className={`pb-5 ${last ? "pb-0" : ""}`}>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-[15.5px] font-semibold ${done || current ? "text-ink" : "text-ink-3"}`}>
                      {s.title}
                    </p>
                    {time && (
                      <span className="tabular text-[12.5px] font-semibold text-ink-3">{formatTime(time)}</span>
                    )}
                  </div>
                  <p className={`mt-0.5 text-[13.5px] leading-snug ${done || current ? "text-ink-2" : "text-ink-3/80"}`}>
                    {s.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* itens e entrega */}
      {order && (
        <section className="mx-5 mt-4 overflow-hidden rounded-[22px] border border-line bg-surface shadow-card">
          <ul className="divide-y divide-line">
            {order.items.map((it) => {
              const p = PRODUCT_MAP[it.productId];
              return (
                <li key={it.productId} className="flex items-center justify-between px-4 py-3 text-[14.5px]">
                  <span className="text-ink">
                    <span className="tabular mr-2 font-display font-semibold text-leaf-deep">{it.qty}×</span>
                    {p?.shortName ?? it.productId}
                  </span>
                  <span className="tabular font-semibold text-ink">{money(it.price * it.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-1.5 border-t border-line bg-surface-2/60 px-4 py-3 text-[13.5px] text-ink-2">
            <p>
              <span className="font-semibold text-ink">{order.customer.name}</span> · {order.customer.phone}
            </p>
            <p>
              {order.address.street}, {order.address.number}
              {order.address.complement ? ` · ${order.address.complement}` : ""} · {order.address.district},{" "}
              {order.address.city}
            </p>
            {order.notes && <p className="italic">“{order.notes}”</p>}
            <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2 text-ink">
              <span className="font-display text-[16px] font-semibold">Total</span>
              <Price value={order.total} size={20} />
            </div>
          </div>
        </section>
      )}

      {/* ações */}
      <div className="mt-5 flex flex-col gap-3 px-5">
        {delivered ? (
          <Button onClick={reorder} full icon={<RotateCcw size={20} />}>
            Pedir de novo
          </Button>
        ) : (
          <a
            href={`${BRAND.whatsappLink}?text=${encodeURIComponent(`Olá! Sobre o pedido ${order?.id ?? ""}…`)}`}
            target="_blank"
            rel="noreferrer"
            className="pressable inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[18px] bg-leaf text-[17px] font-semibold text-cream"
          >
            <MessageCircle size={20} />
            Falar com a granja
          </a>
        )}
        <Link
          href="/pedidos"
          className="pressable inline-flex h-12 items-center justify-center gap-1 text-[15px] font-semibold text-ink-2"
        >
          Ver todos os pedidos <ChevronRight size={16} />
        </Link>
      </div>

      {/* controle de demonstração */}
      {order && !delivered && (
        <div className="mx-5 mt-6 flex items-center gap-3 rounded-[18px] border border-dashed border-line-strong bg-surface-2/50 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-ink-3">Modo demonstração</p>
            <p className="text-[12.5px] leading-snug text-ink-3">
              As etapas avançam sozinhas; toque em Avançar para simular a entrega.
            </p>
          </div>
          <button
            type="button"
            onClick={() => advanceStage(order.id)}
            className="pressable inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-[12.5px] font-bold text-ink-2"
          >
            <FastForward size={14} /> Avançar
          </button>
        </div>
      )}
    </main>
  );
}
