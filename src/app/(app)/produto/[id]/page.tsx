"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Leaf, ShoppingBasket, Sunrise } from "lucide-react";
import { BADGE_LABEL, PRODUCT_MAP, PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Chip, Price, PriceSign, QtyStepper } from "@/components/ui/Primitives";
import { TopBar } from "@/components/app/Shell";
import { ProductImage, ProductRowCard } from "@/components/app/ProductCard";
import { useToast } from "@/components/ui/Toast";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCT_MAP[id];
  const router = useRouter();
  const { toast } = useToast();
  const addToCart = useStore((s) => s.addToCart);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).concat(
    PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category),
  ).slice(0, 3);

  const add = () => {
    if (added) {
      router.push("/carrinho");
      return;
    }
    addToCart(product.id, qty);
    setAdded(true);
    toast({
      kind: "success",
      title: "Adicionado ao carrinho",
      description: "Continue explorando ou toque para ver o carrinho.",
    });
  };

  return (
    <main className="flex flex-1 flex-col pb-32">
      <div className="relative">
        <ProductImage product={product} size="hero" className="aspect-[5/4] w-full" />
        <div className="absolute inset-x-0 top-0">
          <TopBar back transparent />
        </div>
        {product.badge && (
          <Chip
            tone={product.badge === "mais-pedido" ? "gold" : product.badge === "melhor-preco" ? "leaf" : "egg"}
            className="absolute bottom-10 left-5"
          >
            {BADGE_LABEL[product.badge]}
          </Chip>
        )}
      </div>

      <section className="relative -mt-6 flex-1 rounded-t-[30px] bg-ground px-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[26px] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
              {product.name}
            </h1>
            <p className="mt-1 text-[14px] font-medium text-ink-3">{product.unit}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
            <PriceSign value={product.price} size="lg" swing />
            {product.compareAt && <Price value={product.compareAt} size={14} strike className="mr-1 mt-1 !text-ink-2" />}
          </div>
        </div>

        <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip tone="leaf">
            <Leaf size={12} strokeWidth={2.5} /> {product.highlight}
          </Chip>
          <Chip tone="egg">
            <Sunrise size={12} strokeWidth={2.5} /> Colheita da manhã
          </Chip>
        </div>

        <dl className="mt-6 divide-y divide-line overflow-hidden rounded-[18px] border border-line bg-surface">
          {product.details.map((d) => (
            <div key={d.label} className="flex items-center justify-between px-4 py-3">
              <dt className="text-[13.5px] font-semibold text-ink-3">{d.label}</dt>
              <dd className="text-right text-[14px] font-semibold text-ink">{d.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-8 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">Você também pode gostar</h2>
        <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
          {related.map((p) => (
            <ProductRowCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ação fixa */}
      <div
        className="app-fixed bottom-0 z-40 border-t border-line bg-surface/95 px-5 pt-3 backdrop-blur-md"
        style={{ paddingBottom: "calc(14px + var(--safe-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <QtyStepper value={qty} onChange={setQty} min={1} size="lg" />
          <motion.div className="flex-1" animate={added ? { scale: [1, 0.97, 1] } : {}}>
            <Button onClick={add} full icon={added ? <Check size={20} strokeWidth={3} /> : <ShoppingBasket size={20} />}
              className={added ? "!bg-leaf !text-cream" : ""}>
              {added ? "Ver carrinho" : (
                <span className="flex items-baseline gap-2">
                  Adicionar
                  <Price value={product.price * qty} size={16} className="opacity-80" />
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
