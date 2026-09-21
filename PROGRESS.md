# PROGRESS — Granja Canaã (versão de apresentação)

Registro persistente de progresso e decisões. Atualizado continuamente para permitir retomada.

## Decisões de arquitetura
- **Sem backend / sem Railway.** Tudo client-side, dados mocados em módulos TS, estado (carrinho, pedidos, sessão demo) em `localStorage` via Zustand persist. Um único deploy Vercel. Motivo: zero superfícies de falha na apresentação; escopo é só o app do consumidor.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind v4 + Motion (framer-motion) + Zustand + lucide-react. PWA com manifest + service worker próprio (app shell cache).
- **Imagens:** ilustrações SVG autorais (ovos com volume, bandejas, caixotes) — offline-safe, sem licenciamento, fundo transparente. Nenhuma imagem externa (hotlink quebraria offline e em wifi ruim).
- **Direção visual (impeccable seed ae1130a7, índice 3):** "a banca da granja na feira" — letreiro pintado à mão, toldo listrado, caixote de madeira, luz da manhã. Estratégia de cor *Committed*: laranja-gema ocupa regiões inteiras (splash, cabeçalho da home, CTAs), ground branco-quente de manhã, verde-placa para tags/preço, marrom-casca para texto.
- **Tipografia:** Bricolage Grotesque (display — desenhada a partir de letreiros feitos à mão, a razão que nenhuma outra face satisfaz) + Figtree (corpo/UI).
- Challengers do sorteio (todos declinados, com doações): quarry→volume real nas ilustrações; streetwear→rótulos literais em todas as zonas; labanotation→tempo como comprimento na timeline; CD-ROM→botões com curso de pressão; ASCII→grade estrita de 4px; cutting bench→estado como marca (não só cor) e laranja em escala de região.

## Identidade (atualizada com material real da cliente)
- Cliente enviou: logo real (galinha + lettering arredondado, fundo verde), tabela de preços (12 ovos R$ 13 · 15 ovos R$ 16 · 30 ovos R$ 30), perfil do Instagram (@granja.canaa._, Canaã dos Carajás – PA, WhatsApp (94) 99287-4338, S.I.M. Artesanal 027).
- Logo original salva em `public/brand/logo-original.jpg`; recorte circular em `public/brand/logo-circle*.png`; ícones PWA gerados por `sharp` em `public/icons/`.
- Paleta: verde da marca (#2b6a3f / #1e4d2c) + dourado (#f2c14e) + creme (#fbf6ea) + marrom-casca. Display: **Fredoka** (eco do lettering); corpo: Figtree. Substitui a direção laranja/Bricolage inicial.
- Catálogo baseado na tabela real + itens sintéticos (caixa 6, Kit Família, Atacado 10 bandejas). Entrega grátis a partir de R$ 30; taxa R$ 5.

## Status
- [x] Repositório clonado (vazio) — greenfield
- [x] PRODUCT.md inferido do brief
- [x] Scaffold Next.js 16 + deploy hello-world em produção
- [x] Design system (tokens, fontes, Button/Field/Primitives/Toast/Shell)
- [x] Ilustrações SVG autorais (ovo com volume, caixas 6/12, bandejas 15/30, caixote, trio na palha)
- [x] Telas: splash, onboarding, login, cadastro, home, produto, carrinho, checkout (3 passos), confirmação, acompanhamento (auto-avanço + controle demo), pedidos, perfil
- [x] PWA: manifest, ícones (192/512/maskable/apple), service worker (app shell), viewport-fit cover, safe areas, sem zoom/seleção
- [x] Walkthrough completo no navegador (desktop e mobile) — fluxo validado ponta a ponta
- [x] Deploy produção: https://granjacanaa.vercel.app (público) · push GitHub main
- [x] Detector impeccable (limpo) + polimento (lid da caixa, transições, not-found)
- [x] DESIGN.md + README de apresentação
- [x] Revisão independente (agente crítico) — 17 achados, 15 corrigidos e deployados
- [x] Verdict pass do revisor: 11 resolvidos, 3 parciais → corrigidos (alvos ≥40px, erros acessíveis com foco, identidade do visitante a partir do pedido) + 2 novos achados corrigidos
- [x] Deploy final em produção e push — https://granjacanaa.vercel.app

## Entrega
Versão de apresentação concluída, validada ponta a ponta no navegador (desktop + mobile) contra a produção. Roteiro de demo no README.md. Próxima fase (fora de escopo desta versão): painel administrativo, backend real (pedidos/pagamentos), notificações.

## Notas técnicas
- `.app-frame` (CSS sem layer) sobrescreve utilities de background — usar `style` inline quando precisar de fundo diferente no frame.
- Elementos fixos: `.app-fixed` (centralizado na coluna de 430px). Não animar `transform` no mesmo elemento (motion sobrescreve o translateX) — envolver em wrapper.
- `touch-action: manipulation` fica só nos controles (no body travava a ferramenta de clique do navegador do agente).
- Ferramenta de navegador: cliques em viewport mobile emulada travam (limitação da ferramenta) — interagir em desktop, inspecionar em mobile.
- Estado persistido em localStorage (`granja-canaa-v2`); `hydrated` evita mismatch de SSR e alimenta skeletons.

## Próximos passos ao retomar
Ver seção Status; continuar no primeiro item não marcado.
