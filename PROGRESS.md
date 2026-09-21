# PROGRESS — Granja Canaã (versão de apresentação)

Registro persistente de progresso e decisões. Atualizado continuamente para permitir retomada.

## Decisões de arquitetura
- **Sem backend / sem Railway.** Tudo client-side, dados mocados em módulos TS, estado (carrinho, pedidos, sessão demo) em `localStorage` via Zustand persist. Um único deploy Vercel. Motivo: zero superfícies de falha na apresentação; escopo é só o app do consumidor.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind v4 + Motion (framer-motion) + Zustand + lucide-react. PWA com manifest + service worker próprio (app shell cache).
- **Imagens:** ilustrações SVG autorais (ovos com volume, bandejas, caixotes) — offline-safe, sem licenciamento, fundo transparente. Nenhuma imagem externa (hotlink quebraria offline e em wifi ruim).
- **Direção visual (impeccable seed ae1130a7, índice 3):** "a banca da granja na feira" — letreiro pintado à mão, toldo listrado, caixote de madeira, luz da manhã. Estratégia de cor *Committed*: laranja-gema ocupa regiões inteiras (splash, cabeçalho da home, CTAs), ground branco-quente de manhã, verde-placa para tags/preço, marrom-casca para texto.
- **Tipografia:** Bricolage Grotesque (display — desenhada a partir de letreiros feitos à mão, a razão que nenhuma outra face satisfaz) + Figtree (corpo/UI).
- Challengers do sorteio (todos declinados, com doações): quarry→volume real nas ilustrações; streetwear→rótulos literais em todas as zonas; labanotation→tempo como comprimento na timeline; CD-ROM→botões com curso de pressão; ASCII→grade estrita de 4px; cutting bench→estado como marca (não só cor) e laranja em escala de região.

## Status
- [x] Repositório clonado (vazio) — greenfield
- [x] PRODUCT.md inferido do brief
- [ ] Scaffold Next.js + deploy hello-world em produção (prova o pipeline)
- [ ] Design system (tokens, fontes, componentes base)
- [ ] Ilustrações SVG (ovos, bandeja, caixote, logo)
- [ ] Telas: splash → onboarding → boas-vindas → login/cadastro → home → produto → carrinho → checkout → confirmação → acompanhamento → pedidos → perfil
- [ ] PWA (manifest, ícones, SW, safe areas, comportamento nativo)
- [ ] Walkthrough no navegador em viewport mobile (produção)
- [ ] Deploy final + push GitHub

## Próximos passos ao retomar
Ver seção Status; continuar no primeiro item não marcado.
