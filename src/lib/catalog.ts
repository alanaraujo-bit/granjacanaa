/**
 * Catálogo de demonstração da Granja Canaã (Canaã dos Carajás – PA).
 * Preços-base vêm da tabela publicada pela granja (12 ovos R$ 13 · 15 ovos R$ 16 · 30 ovos R$ 30);
 * os demais itens e textos são material sintético de apresentação, ajustáveis pela cliente.
 */

export type ProductVisual = "half-dozen" | "dozen" | "fifteen" | "tray" | "family" | "wholesale";

export type Category = "caixas" | "bandejas" | "kits" | "atacado";

export interface Product {
  id: string;
  name: string;
  shortName: string;
  price: number;
  compareAt?: number;
  unit: string;
  description: string;
  highlight: string;
  category: Category;
  visual: ProductVisual;
  badge?: "mais-pedido" | "melhor-preco" | "novo";
  eggs: number;
  details: { label: string; value: string }[];
}

export const CATEGORIES: { id: Category | "todos"; label: string }[] = [
  { id: "todos", label: "Tudo" },
  { id: "caixas", label: "Caixas" },
  { id: "bandejas", label: "Bandejas" },
  { id: "kits", label: "Kits" },
  { id: "atacado", label: "Atacado" },
];

export const PRODUCTS: Product[] = [
  {
    id: "caixa-12",
    name: "Caixa com 12 ovos caipiras",
    shortName: "12 ovos caipiras",
    price: 13,
    unit: "caixa com 12",
    description:
      "Nossa caixa clássica. Ovos de galinhas criadas soltas, colhidos de manhã e embalados no mesmo dia aqui na granja.",
    highlight: "Gema alaranjada e casca firme",
    category: "caixas",
    visual: "dozen",
    badge: "mais-pedido",
    eggs: 12,
    details: [
      { label: "Colheita", value: "Hoje de manhã" },
      { label: "Criação", value: "Galinhas soltas no pasto" },
      { label: "Inspeção", value: "S.I.M. Artesanal nº 027" },
      { label: "Validade", value: "30 dias em geladeira" },
    ],
  },
  {
    id: "caixa-15",
    name: "Caixa com 15 ovos caipiras",
    shortName: "15 ovos caipiras",
    price: 16,
    unit: "caixa com 15",
    description:
      "Três ovos a mais que a dúzia, para a semana render até o fim. Mesmo frescor, mesma gema alaranjada.",
    highlight: "Rende a semana inteira",
    category: "caixas",
    visual: "fifteen",
    eggs: 15,
    details: [
      { label: "Colheita", value: "Hoje de manhã" },
      { label: "Criação", value: "Galinhas soltas no pasto" },
      { label: "Inspeção", value: "S.I.M. Artesanal nº 027" },
      { label: "Validade", value: "30 dias em geladeira" },
    ],
  },
  {
    id: "bandeja-30",
    name: "Bandeja com 30 ovos caipiras",
    shortName: "Bandeja 30 ovos",
    price: 30,
    compareAt: 32.5,
    unit: "bandeja com 30",
    description:
      "Para quem cozinha em casa toda semana. A bandeja rende o café da manhã da família inteira com o melhor preço por ovo.",
    highlight: "R$ 1,00 por ovo",
    category: "bandejas",
    visual: "tray",
    badge: "melhor-preco",
    eggs: 30,
    details: [
      { label: "Colheita", value: "Hoje de manhã" },
      { label: "Preço por ovo", value: "R$ 1,00" },
      { label: "Inspeção", value: "S.I.M. Artesanal nº 027" },
      { label: "Embalagem", value: "Bandeja de polpa moldada" },
    ],
  },
  {
    id: "caixa-6",
    name: "Caixa com 6 ovos caipiras",
    shortName: "6 ovos caipiras",
    price: 7,
    unit: "caixa com 6",
    description:
      "A porção certa para quem mora sozinho ou quer experimentar antes de levar a caixa grande.",
    highlight: "Perfeito para experimentar",
    category: "caixas",
    visual: "half-dozen",
    badge: "novo",
    eggs: 6,
    details: [
      { label: "Colheita", value: "Hoje de manhã" },
      { label: "Criação", value: "Galinhas soltas no pasto" },
      { label: "Validade", value: "30 dias em geladeira" },
    ],
  },
  {
    id: "kit-familia",
    name: "Kit Família: 2 bandejas",
    shortName: "Kit Família",
    price: 58,
    compareAt: 60,
    unit: "60 ovos",
    description:
      "Duas bandejas de 30 com desconto e entrega única. Rende o mês de uma família que adora ovo mexido.",
    highlight: "Economize R$ 2,00",
    category: "kits",
    visual: "family",
    eggs: 60,
    details: [
      { label: "Conteúdo", value: "2 bandejas de 30 ovos" },
      { label: "Preço por ovo", value: "R$ 0,97" },
      { label: "Entrega", value: "Caixa de madeira reutilizável" },
    ],
  },
  {
    id: "atacado-10",
    name: "Atacado: 10 bandejas",
    shortName: "Atacado 10 bandejas",
    price: 280,
    compareAt: 300,
    unit: "300 ovos",
    description:
      "Para mercados, restaurantes e revendas. Entrega combinada direto da granja, com nota e inspeção S.I.M.",
    highlight: "Preço de atacado",
    category: "atacado",
    visual: "wholesale",
    eggs: 300,
    details: [
      { label: "Conteúdo", value: "10 bandejas de 30 ovos" },
      { label: "Preço por ovo", value: "R$ 0,93" },
      { label: "Prazo", value: "Combinado no WhatsApp" },
      { label: "Inspeção", value: "S.I.M. Artesanal nº 027" },
    ],
  },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const BADGE_LABEL: Record<NonNullable<Product["badge"]>, string> = {
  "mais-pedido": "Mais pedido",
  "melhor-preco": "Melhor preço",
  novo: "Novidade",
};

export const FREE_DELIVERY_MIN = 30;
export const DELIVERY_FEE = 5;

export const BRAND = {
  name: "Granja Canaã",
  city: "Canaã dos Carajás",
  state: "PA",
  whatsapp: "(94) 99287-4338",
  whatsappLink: "https://wa.me/5594992874338",
  instagram: "@granja.canaa._",
  sim: "S.I.M. Artesanal nº 027",
  tagline: "Sabor e qualidade direto da roça",
};

export const DELIVERY_WINDOWS = [
  { id: "manha", label: "Manhã", range: "8h – 11h" },
  { id: "tarde", label: "Tarde", range: "13h – 16h" },
  { id: "fim-tarde", label: "Fim de tarde", range: "16h – 19h" },
] as const;

export type DeliveryWindowId = (typeof DELIVERY_WINDOWS)[number]["id"];

export type PaymentMethod = "pix" | "dinheiro" | "cartao";

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão na entrega",
};
