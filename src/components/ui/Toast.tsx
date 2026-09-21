"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Info, AlertTriangle } from "lucide-react";

type ToastKind = "success" | "info" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastApi {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast fora do ToastProvider");
  return ctx;
}

const ICON: Record<ToastKind, React.ReactNode> = {
  success: <Check size={16} strokeWidth={3} />,
  info: <Info size={16} strokeWidth={2.5} />,
  error: <AlertTriangle size={16} strokeWidth={2.5} />,
};

const COLOR: Record<ToastKind, string> = {
  success: "bg-leaf text-cream",
  info: "bg-gold text-leaf-ink",
  error: "bg-danger text-cream",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++counter.current;
    setItems((prev) => [...prev.slice(-2), { ...t, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 2100);
  }, []);

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        className="app-fixed pointer-events-none z-[100] flex flex-col items-center gap-2 px-4"
        style={{ top: "calc(var(--safe-top) + 12px)" }}
        aria-live="polite"
      >
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-cream shadow-float"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${COLOR[t.kind]}`}
              >
                {ICON[t.kind]}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-[13px] leading-snug text-cream/75">{t.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
