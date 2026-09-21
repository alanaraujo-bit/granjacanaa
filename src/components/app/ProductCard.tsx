"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { BADGE_LABEL, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Chip, PriceSign, QtyStepper } from "@/components/ui/Primitives";
import { ProductVisualScene } from "@/components/illustrations/Scenes";

/** Moldura da ilustração: pódio quente com luz da manhã. */
export function ProductImage({
  product,
  className = "",
  size = "card",
}: {
  product: Product;
  className?: string;
  size?: "card" | "hero" | "thumb";
}) {
  const pad = size === "hero" ? "p-4" : size === "thumb" ? "p-1" : "p-2";
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          size === "hero"
            ? "radial-gradient(120% 90% at 50% 100%, #efe3cf 0%, #f8f3e8 55%, #fbf7ee 100%)"
            : "radial-gradient(110% 80% at 50% 100%, #f1e6d3 0%, #f8f4ea 60%, #fdfbf6 100%)",
      }}
    >
      <div className={`h-full w-full ${pad}`}>
        <ProductVisualScene visual={product.visual} className="h-full w-full" />
      </div>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const inCart = useStore((s) => s.cart.find((c) => c.productId === product.id)?.qty ?? 0);
  const addToCart = useStore((s) => s.addToCart);
  const setQty = useStore((s) => s.setQty);
  const { toast } = useToast();

  const badgeTone =
    product.badge === "mais-pedido" ? "gold" : product.badge === "melhor-preco" ? "leaf" : "egg";

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-card"
    >
      <Link href={`/produto/${product.id}`} className="pressable block" aria-label={product.name}>
        <ProductImage product={product} className="aspect-[4/3] rounded-t-[22px]" />
        {product.badge && (
          <Chip tone={badgeTone} className="absolute left-3 top-3">
            {BADGE_LABEL[product.badge]}
          </Chip>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-3.5 pb-3.5 pt-3">
        <Link href={`/produto/${product.id}`} className="block">
          <h3 className="font-display text-[16px] font-bold leading-[1.15] tracking-[-0.015em] text-ink">
            {product.shortName}
          </h3>
          <p className="mt-0.5 text-[12.5px] font-medium text-ink-3">{product.unit}</p>
        </Link>
        <div className="mt-2 flex items-end justify-between gap-2">
          <PriceSign value={product.price} size="sm" />
          {inCart > 0 ? (
            <QtyStepper value={inCart} onChange={(v) => setQty(product.id, v)} size="sm" allowRemove />
          ) : (
            <button
              type="button"
              aria-label={`Adicionar ${product.name}`}
              onClick={() => {
                addToCart(product.id);
                toast({ kind: "success", title: "Adicionado ao carrinho", description: product.name });
              }}
              className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-gold text-leaf-ink shadow-gold hover:bg-gold-deep"
            >
              <Plus size={20} strokeWidth={2.75} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** Cartão horizontal (para a fileira "mais pedidos"). */
export function ProductRowCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produto/${product.id}`}
      className="pressable flex w-[268px] shrink-0 items-center gap-3 rounded-[20px] border border-line bg-surface p-2.5 pr-4 shadow-card"
    >
      <ProductImage product={product} className="h-[84px] w-[104px] shrink-0 rounded-[14px]" size="thumb" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
          {product.shortName}
        </h3>
        <p className="truncate text-[12.5px] text-ink-3">{product.highlight}</p>
        <div className="mt-2">
          <PriceSign value={product.price} size="sm" />
        </div>
      </div>
    </Link>
  );
}
