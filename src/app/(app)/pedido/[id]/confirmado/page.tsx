"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Copy, Home, MessageCircle, PackageSearch } from "lucide-react";
import { BRAND, DELIVERY_WINDOWS, PAYMENT_LABEL, PRODUCT_MAP } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { formatDateTime, money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Price, Skeleton } from "@/components/ui/Primitives";
import { EggShape, EggDefs } from "@/components/illustrations/Egg";
import { useToast } from "@/components/ui/Toast";

const PIX_KEY = "94 99287-4338";

export default function OrderConfirmedPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useStore((s) => s.hydrated);
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY.replace(/\s/g, ""));
    } catch {
      /* clipboard indisponível */
    }
    setCopied(true);
    toast({ kind: "success", title: "Chave Pix copiada" });
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (hydrated && !order) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-[22px] font-semibold text-ink">Pedido não encontrado</h1>
        <p className="mt-2 text-ink-2">Talvez ele tenha sido feito em outro aparelho.</p>
        <Button href="/inicio" className="mt-6">
          Voltar ao início
        </Button>
      </main>
    );
  }

  const win = order ? DELIVERY_WINDOWS.find((w) => w.id === order.delivery.slot) : undefined;

  return (
    <main className="flex flex-1 flex-col pb-10">
      {/* campo verde de sucesso */}
      <section
        className="relative overflow-hidden px-5 pb-14 text-center text-cream"
        style={{
          paddingTop: "calc(var(--safe-top) + 44px)",
          background: "radial-gradient(90% 70% at 50% 0%, #2f7446 0%, #1e4d2c 75%)",
        }}
      >
        <Confetti />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold shadow-gold"
        >
          <motion.span
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            className="flex items-center justify-center text-leaf-ink"
          >
            <Check size={52} strokeWidth={3.2} />
          </motion.span>
          <span className="absolute -right-3 -top-2 rotate-12">
            <svg viewBox="0 0 100 130" width="30" aria-hidden="true">
              <EggDefs id="cf-egg" tone="brown" />
              <EggShape tone="brown" defs="cf-egg" shadow={false} />
            </svg>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-6"
        >
          <h1 className="font-display text-[30px] font-semibold leading-[1.05]">Pedido confirmado!</h1>
          <p className="mx-auto mt-2 max-w-[30ch] text-[15px] text-cream/85">
            Obrigado, {order ? order.customer.name.split(" ")[0] : "…"}. Já avisamos a granja e seus ovos
            estão sendo separados.
          </p>
          <div className="mt-5 inline-flex items-baseline gap-2 rounded-full bg-cream/12 px-5 py-2 ring-1 ring-cream/25">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-cream/75">Pedido</span>
            {order ? (
              <span className="tabular font-display text-[24px] font-semibold text-gold" data-selectable>
                {order.id}
              </span>
            ) : (
              <Skeleton className="h-6 w-20 bg-cream/30" />
            )}
          </div>
        </motion.div>
      </section>

      {/* resumo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative -mt-7 mx-5 overflow-hidden rounded-[22px] border border-line bg-surface shadow-float"
      >
        {order ? (
          <>
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
            <dl className="flex flex-col gap-1.5 border-t border-line bg-surface-2/60 px-4 py-3 text-[13.5px] text-ink-2">
              <Row label="Entrega">
                {order.delivery.day === "hoje" ? "Hoje" : "Amanhã"}, {win?.label.toLowerCase()} ({win?.range})
              </Row>
              <Row label="Endereço">
                {order.address.street}, {order.address.number}
                {order.address.complement ? ` · ${order.address.complement}` : ""} · {order.address.district}
              </Row>
              <Row label="Pagamento">
                {PAYMENT_LABEL[order.payment]}
                {order.changeFor ? ` · troco para ${money(order.changeFor)}` : ""}
              </Row>
              <Row label="Feito em">{formatDateTime(order.createdAt)}</Row>
              <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2 text-ink">
                <dt className="font-display text-[16px] font-semibold">Total</dt>
                <dd>
                  <Price value={order.total} size={22} />
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <div className="p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-3 h-5 w-1/2" />
            <Skeleton className="mt-3 h-5 w-3/4" />
          </div>
        )}
      </motion.section>

      {/* pix */}
      {order?.payment === "pix" && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-5 mt-4 rounded-[22px] border border-gold/60 bg-gold-soft/60 p-4"
        >
          <h2 className="font-display text-[17px] font-semibold text-ink">Pagamento por Pix</h2>
          <p className="mt-1 text-[13.5px] leading-snug text-ink-2">
            Copie a chave abaixo, faça o Pix de <strong className="text-ink">{money(order.total)}</strong> e envie o
            comprovante no WhatsApp. Sem pressa: dá para pagar na entrega também.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-[14px] border border-line-strong bg-surface px-3 py-2.5">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-3">Chave</span>
            <span className="tabular flex-1 font-display text-[16px] font-semibold text-ink" data-selectable>
              {PIX_KEY}
            </span>
            <button
              type="button"
              onClick={copyPix}
              className="pressable inline-flex h-10 items-center gap-1.5 rounded-full bg-leaf px-3.5 text-[13px] font-bold text-cream"
            >
              {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </motion.section>
      )}

      {/* ações */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.72, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex flex-col gap-3 px-5"
      >
        <Button href={`/pedido/${id}`} full icon={<PackageSearch size={20} />}>
          Acompanhar pedido
        </Button>
        <a
          href={`${BRAND.whatsappLink}?text=${encodeURIComponent(`Olá! Acabei de fazer o pedido ${id} pelo app.`)}`}
          target="_blank"
          rel="noreferrer"
          className="pressable inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[18px] border border-line-strong bg-surface text-[17px] font-semibold text-ink"
        >
          <MessageCircle size={20} className="text-leaf" />
          Falar com a granja
        </a>
        <Link
          href="/inicio"
          className="pressable inline-flex h-12 items-center justify-center gap-2 text-[15px] font-semibold text-ink-2"
        >
          <Home size={18} /> Voltar ao início
        </Link>
      </motion.div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0">{label}</dt>
      <dd className="text-right font-semibold text-ink">{children}</dd>
    </div>
  );
}

/** Confetes discretos em tons da marca. */
function Confetti() {
  const pieces = [
    { x: "8%", d: 0, c: "#f2c14e", r: 12 },
    { x: "18%", d: 0.15, c: "#fbf6ea", r: -20 },
    { x: "30%", d: 0.05, c: "#c98b57", r: 30 },
    { x: "44%", d: 0.25, c: "#f2c14e", r: 0 },
    { x: "58%", d: 0.1, c: "#fbf6ea", r: 45 },
    { x: "70%", d: 0.3, c: "#c98b57", r: -10 },
    { x: "82%", d: 0.18, c: "#f2c14e", r: 25 },
    { x: "92%", d: 0.08, c: "#fbf6ea", r: -35 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, opacity: 0, rotate: p.r }}
          animate={{ y: 260, opacity: [0, 1, 1, 0], rotate: p.r + 180 }}
          transition={{ duration: 2.6, delay: 0.3 + p.d, ease: "easeIn" }}
          className="absolute top-0 block h-3 w-2 rounded-[2px]"
          style={{ left: p.x, background: p.c }}
        />
      ))}
    </div>
  );
}
