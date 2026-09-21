# Granja Canaã — app de pedidos (versão de apresentação)

PWA mobile-first que demonstra a experiência do cliente da **Granja Canaã** (Canaã dos Carajás – PA): explorar o catálogo de ovos caipiras, montar o carrinho, informar entrega e pagamento, confirmar e acompanhar o pedido.

**Demo em produção:** https://granjacanaa.vercel.app

## Roteiro de demonstração (2 minutos)

1. Abra o link no celular (ou no desktop — o app aparece numa coluna de celular).
2. Splash → boas-vindas. Toque em **Explorar o app** (não precisa de login).
3. Na home, toque em **+** num produto ou abra a **Caixa com 12 ovos** e adicione.
4. **Ver carrinho** → ajuste quantidades → **Finalizar pedido**.
5. No checkout, toque em **Preencher exemplo** (dados fictícios), escolha horário e pagamento, **Confirmar pedido**.
6. Tela de confirmação com número do pedido → **Acompanhar pedido**: as etapas avançam sozinhas (Recebido → Em preparo → Saiu para entrega → Entregue) ou use **Avançar** no rodapé.
7. Aba **Pedidos** e **Perfil** (WhatsApp, Instagram, instalar o app, reiniciar demonstração).

Para instalar como app: Android/Chrome → "Instalar app"; iPhone/Safari → Compartilhar → "Adicionar à Tela de Início".

## O que é real e o que é fictício

- **Real (fornecido pela cliente):** logo, nome, cidade, WhatsApp, Instagram, S.I.M. 027, preços-base da tabela (12 ovos R$ 13 · 15 ovos R$ 16 · 30 ovos R$ 30).
- **Fictício (material de apresentação):** caixa com 6, Kit Família, Atacado 10 bandejas e seus preços; textos de produto; usuária "Mariana Souza" e endereço de exemplo; horários de entrega; taxa/valor mínimo de entrega grátis; chave Pix; número do pedido; avanço automático do acompanhamento.
- Não há backend: tudo roda no navegador e fica salvo no aparelho (localStorage).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Zustand (persist) · lucide-react · Service worker próprio · Deploy na Vercel.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

## Estrutura

- `src/app/` — rotas: `/` (splash), `/bem-vindo`, `/entrar`, `/cadastro`, `/inicio`, `/produto/[id]`, `/carrinho`, `/checkout`, `/pedido/[id]/confirmado`, `/pedido/[id]`, `/pedidos`, `/perfil`.
- `src/lib/` — `catalog.ts` (produtos, marca), `store.ts` (estado persistido), `useOrder.ts` (simulação do acompanhamento), `format.ts`.
- `src/components/` — `ui/` (Button, Field, Primitives, Toast), `app/` (Shell, ProductCard), `illustrations/` (ovos, caixas, bandejas, logo).
- `public/brand/` — logo original e recortes · `public/icons/` — ícones PWA · `public/sw.js`.
- `PRODUCT.md`, `DESIGN.md`, `PROGRESS.md`, `BLOCKERS.md` — contexto de produto, sistema visual, progresso e bloqueios.
