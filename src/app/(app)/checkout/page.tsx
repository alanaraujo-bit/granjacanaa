"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  MapPin,
  Phone,
  QrCode,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";
import {
  DELIVERY_WINDOWS,
  PAYMENT_LABEL,
  PRODUCT_MAP,
  type DeliveryWindowId,
  type PaymentMethod,
} from "@/lib/catalog";
import { cartSubtotal, deliveryFeeFor, useStore, type DeliveryDay } from "@/lib/store";
import { maskCep, maskPhone, money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";
import { Price } from "@/components/ui/Primitives";
import { TopBar } from "@/components/app/Shell";
import { useToast } from "@/components/ui/Toast";

const STEPS = ["Entrega", "Horário", "Pagamento"];
const WINDOW_END: Record<DeliveryWindowId, number> = { manha: 11, tarde: 16, "fim-tarde": 19 };

const PAYMENTS: { id: PaymentMethod; Icon: typeof QrCode; title: string; text: string }[] = [
  { id: "pix", Icon: QrCode, title: "Pix", text: "Chave enviada no WhatsApp após confirmar" },
  { id: "dinheiro", Icon: Banknote, title: "Dinheiro", text: "Pague na entrega. Precisa de troco?" },
  { id: "cartao", Icon: CreditCard, title: "Cartão na entrega", text: "Maquininha: débito ou crédito" },
];


/** Leva o foco ao primeiro campo inválido após a validação. */
function focusFirstInvalid() {
  window.setTimeout(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 0);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const hydrated = useStore((s) => s.hydrated);
  const cart = useStore((s) => s.cart);
  const draft = useStore((s) => s.draft);
  const setDraft = useStore((s) => s.setDraft);
  const fillDemoDraft = useStore((s) => s.fillDemoDraft);
  const placeOrder = useStore((s) => s.placeOrder);
  const user = useStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const subtotal = cartSubtotal(cart);
  const fee = deliveryFeeFor(subtotal);
  const total = subtotal + fee;

  // sem carrinho, sem checkout
  useEffect(() => {
    if (hydrated && cart.length === 0 && !placing) router.replace("/carrinho");
  }, [hydrated, cart.length, placing, router]);

  // preenche nome/telefone do usuário logado e a cidade padrão
  useEffect(() => {
    if (!hydrated) return;
    const patch: Partial<typeof draft> = {};
    if (!draft.name && user?.name) patch.name = user.name;
    if (!draft.phone && user?.phone) patch.phone = user.phone;
    if (!draft.address.city) patch.address = { ...draft.address, city: "Canaã dos Carajás – PA" };
    if (Object.keys(patch).length) setDraft(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const hour = new Date().getHours();
  const todayAvailable = useMemo(
    () => DELIVERY_WINDOWS.some((w) => hour < WINDOW_END[w.id] - 1),
    [hour],
  );

  const setAddr = (k: keyof typeof draft.address, v: string) =>
    setDraft({ address: { ...draft.address, [k]: v } });

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (draft.name.trim().split(" ").length < 2) e.name = "Digite nome e sobrenome.";
    if (draft.phone.replace(/\D/g, "").length < 10) e.phone = "Digite um celular com DDD.";
    if (!draft.address.street.trim()) e.street = "Informe a rua.";
    if (!draft.address.number.trim()) e.number = "Informe o número.";
    if (!draft.address.district.trim()) e.district = "Informe o bairro.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) {
      toast({ kind: "error", title: "Faltou preencher alguns campos" });
      focusFirstInvalid();
      return;
    }
    if (step === 1 && draft.delivery.day === "hoje" && !todayAvailable) {
      setDraft({ delivery: { ...draft.delivery, day: "amanha" } });
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => {
    if (step === 0) router.push("/carrinho");
    else {
      setDir(-1);
      setStep((s) => s - 1);
    }
  };

  const confirm = () => {
    setPlacing(true);
    window.setTimeout(() => {
      const order = placeOrder();
      if (!order) {
        setPlacing(false);
        return;
      }
      router.replace(`/pedido/${order.id}/confirmado`);
    }, 1300);
  };

  const slide = {
    initial: (d: number) => ({ opacity: 0, x: d * 40 }),
    animate: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  return (
    <main className="flex flex-1 flex-col pb-44">
      <TopBar title="Finalizar pedido" backHref="/carrinho" />

      {/* passos */}
      <ol className="mx-5 mt-1 flex items-center gap-2" aria-label="Etapas">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-semibold transition-colors ${
                  done
                    ? "bg-leaf text-cream"
                    : active
                      ? "bg-gold text-leaf-ink"
                      : "bg-surface-2 text-ink-3"
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[13px] font-semibold ${active ? "text-ink" : "text-ink-3"}`}>{label}</span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line-strong" />}
            </li>
          );
        })}
      </ol>

      <div className="relative mt-6 px-5">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {step === 0 && (
            <motion.section key="s0" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <h2 className="font-display text-[22px] font-semibold text-ink">Para quem e onde?</h2>
                <button
                  type="button"
                  onClick={() => {
                    fillDemoDraft();
                    setErrors({});
                    toast({ kind: "info", title: "Dados de exemplo preenchidos" });
                  }}
                  className="pressable inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-soft px-3.5 text-[12.5px] font-bold text-gold-ink"
                >
                  <Wand2 size={13} strokeWidth={2.5} /> Preencher exemplo
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <Field label="Nome completo" placeholder="Quem vai receber?" autoComplete="name" value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} error={errors.name} icon={<UserRound size={18} />} />
                <Field label="Celular (WhatsApp)" placeholder="(94) 99999-9999" inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e) => setDraft({ phone: maskPhone(e.target.value) })} error={errors.phone} icon={<Phone size={18} />} />

                <div className="mt-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <MapPin size={14} /> Endereço de entrega
                </div>
                <div className="grid grid-cols-[1fr_1.4fr] gap-3">
                  <Field label="CEP" placeholder="00000-000" inputMode="numeric" autoComplete="postal-code" value={draft.address.cep} onChange={(e) => setAddr("cep", maskCep(e.target.value))} />
                  <Field label="Bairro" placeholder="Seu bairro" autoComplete="address-level3" value={draft.address.district} onChange={(e) => setAddr("district", e.target.value)} error={errors.district} />
                </div>
                <div className="grid grid-cols-[1.6fr_0.8fr] gap-3">
                  <Field label="Rua" placeholder="Nome da rua" autoComplete="address-line1" value={draft.address.street} onChange={(e) => setAddr("street", e.target.value)} error={errors.street} />
                  <Field label="Número" placeholder="Nº" inputMode="numeric" value={draft.address.number} onChange={(e) => setAddr("number", e.target.value)} error={errors.number} />
                </div>
                <Field label="Complemento" placeholder="Casa, apto, bloco (opcional)" value={draft.address.complement} onChange={(e) => setAddr("complement", e.target.value)} />
                <Field label="Cidade" value={draft.address.city} onChange={(e) => setAddr("city", e.target.value)} />
                <Field label="Ponto de referência" placeholder="Ajuda o entregador a te encontrar" value={draft.address.reference} onChange={(e) => setAddr("reference", e.target.value)} />
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="s1" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-display text-[22px] font-semibold text-ink">Quando você prefere receber?</h2>
              <p className="mt-1 text-[14px] text-ink-2">Entregamos em Canaã dos Carajás nos horários abaixo.</p>

              <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Dia">
                {(
                  [
                    { id: "hoje", label: "Hoje", sub: todayAvailable ? "ainda dá tempo" : "horários esgotados" },
                    { id: "amanha", label: "Amanhã", sub: "colheita da manhã" },
                  ] as { id: DeliveryDay; label: string; sub: string }[]
                ).map((d) => {
                  const active = draft.delivery.day === d.id;
                  const disabled = d.id === "hoje" && !todayAvailable;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={disabled}
                      onClick={() => setDraft({ delivery: { ...draft.delivery, day: d.id } })}
                      className={`pressable flex flex-col items-start rounded-[16px] border px-4 py-3 text-left transition-colors disabled:opacity-40 ${
                        active ? "border-leaf bg-leaf-wash" : "border-line-strong bg-surface"
                      }`}
                    >
                      <span className="font-display text-[17px] font-semibold text-ink">{d.label}</span>
                      <span className="text-[12.5px] text-ink-3">{d.sub}</span>
                    </button>
                  );
                })}
              </div>

              <ul className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Horário">
                {DELIVERY_WINDOWS.map((w) => {
                  const active = draft.delivery.slot === w.id;
                  const past = draft.delivery.day === "hoje" && hour >= WINDOW_END[w.id] - 1;
                  return (
                    <li key={w.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={past}
                        onClick={() => setDraft({ delivery: { ...draft.delivery, slot: w.id } })}
                        className={`pressable flex w-full items-center gap-3 rounded-[16px] border px-4 py-3.5 text-left transition-colors disabled:opacity-40 ${
                          active ? "border-leaf bg-leaf-wash" : "border-line-strong bg-surface"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            active ? "border-leaf bg-leaf" : "border-line-strong"
                          }`}
                        >
                          {active && <Check size={12} strokeWidth={3.5} className="text-cream" />}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold text-ink">{w.label}</span>
                          <span className="block text-[12.5px] text-ink-3">{past ? "Já passou" : "Janela de entrega"}</span>
                        </span>
                        <span className="tabular font-display text-[15px] font-semibold text-leaf-deep">{w.range}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <TextArea
                className="mt-5"
                label="Alguma observação?"
                placeholder="Ex.: deixar com o porteiro, tocar a campainha…"
                value={draft.notes}
                onChange={(e) => setDraft({ notes: e.target.value })}
              />
            </motion.section>
          )}

          {step === 2 && (
            <motion.section key="s2" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-display text-[22px] font-semibold text-ink">Como você quer pagar?</h2>
              <ul className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Forma de pagamento">
                {PAYMENTS.map(({ id, Icon, title, text }) => {
                  const active = draft.payment === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setDraft({ payment: id })}
                        className={`pressable flex w-full items-center gap-3 rounded-[16px] border px-4 py-3.5 text-left transition-colors ${
                          active ? "border-leaf bg-leaf-wash" : "border-line-strong bg-surface"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            active ? "bg-leaf text-cream" : "bg-surface-2 text-ink-2"
                          }`}
                        >
                          <Icon size={19} strokeWidth={2.2} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold text-ink">{title}</span>
                          <span className="block text-[12.5px] text-ink-3">{text}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            active ? "border-leaf bg-leaf" : "border-line-strong"
                          }`}
                        >
                          {active && <Check size={12} strokeWidth={3.5} className="text-cream" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence>
                {draft.payment === "dinheiro" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <Field
                      className="mt-4"
                      label="Troco para quanto?"
                      placeholder={`Ex.: R$ ${Math.ceil(total / 10) * 10 + 10}`}
                      inputMode="numeric"
                      value={draft.changeFor}
                      onChange={(e) => setDraft({ changeFor: e.target.value.replace(/[^\d]/g, "") })}
                      hint="Deixe em branco se não precisar de troco."
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* revisão */}
              <h3 className="mt-7 font-display text-[18px] font-semibold text-ink">Revise seu pedido</h3>
              <div className="mt-3 overflow-hidden rounded-[18px] border border-line bg-surface">
                <ul className="divide-y divide-line">
                  {cart.map((c) => {
                    const p = PRODUCT_MAP[c.productId];
                    if (!p) return null;
                    return (
                      <li key={c.productId} className="flex items-center justify-between px-4 py-3 text-[14px]">
                        <span className="text-ink">
                          <span className="tabular mr-2 font-display font-semibold text-leaf-deep">{c.qty}×</span>
                          {p.shortName}
                        </span>
                        <span className="tabular font-semibold text-ink">{money(p.price * c.qty)}</span>
                      </li>
                    );
                  })}
                </ul>
                <dl className="flex flex-col gap-1 border-t border-line bg-surface-2/60 px-4 py-3 text-[13.5px] text-ink-2">
                  <div className="flex justify-between">
                    <dt>Entrega · {draft.delivery.day === "hoje" ? "hoje" : "amanhã"}, {DELIVERY_WINDOWS.find((w) => w.id === draft.delivery.slot)?.range}</dt>
                    <dd className={`tabular font-semibold ${fee === 0 ? "text-leaf-deep" : ""}`}>{fee === 0 ? "Grátis" : money(fee)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Pagamento</dt>
                    <dd className="font-semibold">{PAYMENT_LABEL[draft.payment]}</dd>
                  </div>
                  <div className="flex justify-between truncate">
                    <dt className="truncate">
                      {draft.address.street}, {draft.address.number} · {draft.address.district}
                    </dt>
                  </div>
                </dl>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* rodapé fixo */}
      <div
        className="app-fixed bottom-0 z-40 border-t border-line bg-surface/95 px-5 pt-3 backdrop-blur-md"
        style={{ paddingBottom: "calc(14px + var(--safe-bottom))" }}
      >
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[14px] text-ink-2">
            Total com entrega
            {fee === 0 && <span className="ml-1.5 text-[12px] font-bold text-leaf-deep">grátis</span>}
          </span>
          <Price value={total} size={22} className="text-ink" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={back} className="w-[112px]" disabled={placing}>
            Voltar
          </Button>
          {step < 2 ? (
            <Button onClick={next} full iconRight={<ArrowRight size={20} />}>
              Continuar
            </Button>
          ) : (
            <Button onClick={confirm} loading={placing} full icon={<Sparkles size={20} />}>
              {placing ? "Enviando pedido" : "Confirmar pedido"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
