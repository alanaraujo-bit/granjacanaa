"use client";

import { useEffect, useState } from "react";
import { autoStageFor, STAGE_AUTO_MS, useStore, type Order } from "./store";

export const STAGES = [
  {
    title: "Pedido recebido",
    text: "Recebemos seu pedido e já avisamos a granja.",
    doing: "Confirmando com a granja…",
  },
  {
    title: "Em preparo",
    text: "Separando os ovos mais frescos da colheita de hoje.",
    doing: "Embalando com cuidado…",
  },
  {
    title: "Saiu para entrega",
    text: "Nosso entregador está a caminho do seu endereço.",
    doing: "A caminho da sua casa…",
  },
  {
    title: "Entregue",
    text: "Chegou! Bom apetite e até o próximo pedido.",
    doing: "",
  },
] as const;

/**
 * Observa um pedido e faz a etapa avançar automaticamente com o tempo
 * (simulação de demonstração). Devolve o pedido, o instante atual e o
 * progresso (0–1) dentro da etapa atual.
 */
export function useOrder(orderId: string | undefined) {
  const order = useStore((s) => s.orders.find((o) => o.id === orderId));
  const syncStage = useStore((s) => s.syncStage);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!order || order.stage >= 3) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      const auto = autoStageFor(order, t);
      if (auto > order.stage) syncStage(order.id, auto);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [order, syncStage]);

  const progress = order ? stageProgress(order, now) : 0;
  return { order, now, progress };
}

function stageProgress(order: Order, now: number) {
  if (order.stage >= 3) return 1;
  const start = order.stageTimes[order.stage] ?? order.createdAt;
  const autoStart = order.createdAt + STAGE_AUTO_MS[order.stage];
  const autoEnd = order.createdAt + STAGE_AUTO_MS[order.stage + 1];
  const from = Math.max(start, autoStart);
  const span = Math.max(autoEnd - from, 5000);
  return Math.max(0, Math.min(1, (now - from) / span));
}

export function orderStatusLabel(stage: number) {
  return STAGES[Math.min(stage, 3)].title;
}
