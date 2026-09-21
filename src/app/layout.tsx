import type { Metadata, Viewport } from "next";
import { Fredoka, Figtree } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app/AppProviders";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Granja Canaã — Ovos caipiras em casa",
    template: "%s · Granja Canaã",
  },
  description:
    "Ovos caipiras fresquinhos, colhidos de manhã e entregues na sua casa. Peça em poucos toques.",
  applicationName: "Granja Canaã",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Granja Canaã",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

const DIRECTION = `
  DIREÇÃO — impeccable seed ae1130a7 · direção 3 (operate) · mundo fixado pela marca real
  THESIS: a banca da Granja Canaã na feira — a logo real (galinha + lettering arredondado)
  e sua tabela de preços verde-e-dourada viram o app; não um marketplace branco genérico.
  OWN-WORLD: verde da marca (#2b6a3f/#1e4d2c) em campos inteiros (splash, herói, gaveta do
  carrinho), dourado (#f2c14e) nas ações primárias e no lettering, creme (#fbf6ea) e branco-manhã
  (#fbf7ee) como ground, marrom-casca no texto. Fredoka (display, eco do lettering da logo) +
  Figtree (corpo). Toldo listrado verde/creme, placa de preço verde girada com "R$" dourado,
  ilustrações SVG de ovos com volume, cantos 16–24px, botões 56px com curso de pressão.
  STORY: "é a minha granja, entregando em casa" — abre, explora sem barreira, escolhe, confirma
  e acompanha como num app de verdade.
  FIRST VIEWPORT: splash verde com a logo real em círculo; boas-vindas com trio de ovos na
  palha em tamanho de herói e três ações empilhadas — "Explorar o app" (dourado) é a primária.
  FORM: banca da granja, 3ª da lista ordenada; seed ae1130a7. Motion: a placa de preço balança
  uma vez ao entrar; o carrinho sobe como gaveta; a timeline de entrega cresce com o tempo real.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
  the verdict, DESIGN.md, and every shipping raster carrying its provenance.
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full">
        <div hidden aria-hidden dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION}-->` }} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
