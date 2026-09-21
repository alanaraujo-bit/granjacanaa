import { PRODUCTS } from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default function ProductLayout({ children }: LayoutProps<"/produto/[id]">) {
  return children;
}
