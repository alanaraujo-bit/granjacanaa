"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  PRODUCT_MAP,
  type DeliveryWindowId,
  type PaymentMethod,
} from "./catalog";

export interface User {
  name: string;
  phone: string;
  email?: string;
  mode: "guest" | "account";
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  reference: string;
}

export interface OrderItem {
  productId: string;
  qty: number;
  price: number;
}

export type DeliveryDay = "hoje" | "amanha";

export interface Order {
  id: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: { name: string; phone: string };
  address: Address;
  delivery: { day: DeliveryDay; slot: DeliveryWindowId };
  payment: PaymentMethod;
  changeFor?: number;
  notes?: string;
  /** 0 recebido · 1 em preparo · 2 saiu para entrega · 3 entregue */
  stage: number;
  stageTimes: (number | null)[];
}

export interface CheckoutDraft {
  name: string;
  phone: string;
  address: Address;
  delivery: { day: DeliveryDay; slot: DeliveryWindowId };
  payment: PaymentMethod;
  changeFor: string;
  notes: string;
}

export const EMPTY_ADDRESS: Address = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  reference: "",
};

export const DEMO_USER: User = {
  name: "Mariana Souza",
  phone: "(94) 99812-4470",
  email: "mariana.souza@email.com",
  mode: "guest",
};

export const DEMO_ADDRESS: Address = {
  cep: "68537-000",
  street: "Rua das Castanheiras",
  number: "184",
  complement: "Casa 2",
  district: "Novo Horizonte",
  city: "Canaã dos Carajás – PA",
  reference: "Portão verde, ao lado da padaria",
};

export const emptyDraft = (): CheckoutDraft => ({
  name: "",
  phone: "",
  address: { ...EMPTY_ADDRESS },
  delivery: { day: "hoje", slot: "tarde" },
  payment: "pix",
  changeFor: "",
  notes: "",
});

/**
 * Tempos (ms) desde a criação em que cada etapa é alcançada automaticamente.
 * A entrega ("Entregue") não acontece sozinha: só pelo controle de demonstração.
 */
export const STAGE_AUTO_MS = [0, 25_000, 70_000, Number.POSITIVE_INFINITY] as const;
export const AUTO_MAX_STAGE = 2;

interface State {
  hydrated: boolean;
  user: User | null;
  onboardingDone: boolean;
  cart: CartItem[];
  orders: Order[];
  draft: CheckoutDraft;
  lastOrderId: string | null;

  setUser: (u: User | null) => void;
  completeOnboarding: () => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setDraft: (patch: Partial<CheckoutDraft>) => void;
  fillDemoDraft: () => void;
  placeOrder: () => Order | null;
  syncStage: (orderId: string, stage: number, times?: (number | null)[]) => void;
  advanceStage: (orderId: string) => void;
  resetDemo: () => void;
}

function newOrderId(existing: Order[]) {
  const base = 2417 + existing.length * 3;
  const noise = Math.floor(Math.random() * 3);
  return `GC-${base + noise}`;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      onboardingDone: false,
      cart: [],
      orders: [],
      draft: emptyDraft(),
      lastOrderId: null,

      setUser: (user) => set({ user }),
      completeOnboarding: () => set({ onboardingDone: true }),

      addToCart: (productId, qty = 1) =>
        set((s) => {
          const found = s.cart.find((c) => c.productId === productId);
          if (found) {
            return {
              cart: s.cart.map((c) =>
                c.productId === productId ? { ...c, qty: Math.min(c.qty + qty, 20) } : c,
              ),
            };
          }
          return { cart: [...s.cart, { productId, qty: Math.min(qty, 20) }] };
        }),

      setQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.productId !== productId)
              : s.cart.map((c) =>
                  c.productId === productId ? { ...c, qty: Math.min(qty, 20) } : c,
                ),
        })),

      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),

      clearCart: () => set({ cart: [] }),

      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

      fillDemoDraft: () =>
        set((s) => ({
          draft: {
            ...s.draft,
            name: s.user?.name || DEMO_USER.name,
            phone: s.user?.phone || DEMO_USER.phone,
            address: { ...DEMO_ADDRESS },
          },
        })),

      placeOrder: () => {
        const s = get();
        if (s.cart.length === 0) return null;
        const items: OrderItem[] = s.cart.map((c) => ({
          productId: c.productId,
          qty: c.qty,
          price: PRODUCT_MAP[c.productId]?.price ?? 0,
        }));
        const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
        const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
        const now = Date.now();
        const order: Order = {
          id: newOrderId(s.orders),
          createdAt: now,
          items,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          customer: { name: s.draft.name, phone: s.draft.phone },
          address: { ...s.draft.address },
          delivery: { ...s.draft.delivery },
          payment: s.draft.payment,
          changeFor:
            s.draft.payment === "dinheiro" && s.draft.changeFor
              ? Number(s.draft.changeFor.replace(/\D/g, "")) || undefined
              : undefined,
          notes: s.draft.notes || undefined,
          stage: 0,
          stageTimes: [now, null, null, null],
        };
        set({
          orders: [order, ...s.orders],
          cart: [],
          lastOrderId: order.id,
          draft: { ...s.draft, notes: "", changeFor: "" },
          user:
            s.user?.mode === "account"
              ? s.user
              : { name: s.draft.name, phone: s.draft.phone, email: s.user?.email, mode: "guest" },
          onboardingDone: true,
        });
        return order;
      },

      syncStage: (orderId, stage, times) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId || stage <= o.stage) return o;
            const stageTimes = [...o.stageTimes];
            const now = Date.now();
            for (let i = o.stage + 1; i <= stage; i++) {
              if (stageTimes[i] == null) stageTimes[i] = times?.[i] ?? now;
            }
            return { ...o, stage, stageTimes };
          }),
        })),

      advanceStage: (orderId) => {
        const o = get().orders.find((x) => x.id === orderId);
        if (!o || o.stage >= 3) return;
        get().syncStage(orderId, o.stage + 1);
      },

      resetDemo: () =>
        set({
          user: null,
          onboardingDone: false,
          cart: [],
          orders: [],
          draft: emptyDraft(),
          lastOrderId: null,
        }),
    }),
    {
      name: "granja-canaa-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        onboardingDone: s.onboardingDone,
        cart: s.cart,
        orders: s.orders,
        draft: s.draft,
        lastOrderId: s.lastOrderId,
      }),
      onRehydrateStorage: () => (state) => {
        // marca hidratação no próximo tick para evitar mismatch de SSR
        queueMicrotask(() => useStore.setState({ hydrated: true }));
        void state;
      },
    },
  ),
);

/* ------------------------------------------------------------------ */
/* Seletores derivados                                                 */
/* ------------------------------------------------------------------ */

export function cartSubtotal(cart: CartItem[]) {
  return cart.reduce((acc, c) => acc + (PRODUCT_MAP[c.productId]?.price ?? 0) * c.qty, 0);
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((acc, c) => acc + c.qty, 0);
}

export function deliveryFeeFor(subtotal: number) {
  return subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
}

/** Etapa automática com base no tempo desde a criação do pedido. */
export function autoStageFor(order: Order, now = Date.now()) {
  const elapsed = now - order.createdAt;
  let stage = 0;
  for (let i = 0; i <= AUTO_MAX_STAGE; i++) {
    if (elapsed >= STAGE_AUTO_MS[i]) stage = i;
  }
  return Math.max(stage, order.stage);
}

/** Instantes em que as etapas automáticas foram (ou seriam) alcançadas. */
export function autoStageTimes(order: Order) {
  return STAGE_AUTO_MS.map((ms, i) => (i <= AUTO_MAX_STAGE ? order.createdAt + ms : null));
}
