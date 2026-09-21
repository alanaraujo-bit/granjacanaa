# DESIGN — Granja Canaã (app do cliente)

Registro do mundo visual construído (ground truth do código, não intenção).

## Mundo

**A banca da Granja Canaã na feira.** A logo real (galinha + lettering arredondado sobre verde) e a tabela de preços verde-e-dourada da granja são a autoridade visual. O app é a barraca: toldo listrado no topo, placas de preço pintadas giradas, caixotes e bandejas de ovos com volume. Modo *Operate* — a interface serve a tarefa (escolher, pedir, acompanhar); a expressão vive no toldo, nas placas e nas ilustrações.

## Cor (estratégia: *Committed* — o verde ocupa regiões inteiras)

| Token | Valor | Uso |
|---|---|---|
| `--ground` | `#fbf7ee` | fundo das telas (branco-manhã) |
| `--surface` / `--surface-2` | `#ffffff` / `#f3efe2` | cartões / superfícies secundárias |
| `--line` / `--line-strong` | `#e9e3d3` / `#d5cfba` | hairlines / bordas de input |
| `--cream` | `#fbf6ea` | texto sobre verde; listra clara |
| `--leaf` / `--leaf-deep` / `--leaf-ink` | `#2b6a3f` / `#1e4d2c` / `#143521` | campos da marca (splash, herói, gaveta do carrinho), placas de preço, estado ativo, sucesso |
| `--leaf-soft` / `--leaf-wash` | `#e1efe1` / `#eef5ec` | pílula da aba ativa, seleção em opções |
| `--gold` / `--gold-deep` / `--gold-ink` | `#f2c14e` / `#e0ab2e` / `#6b4e0a` | **ação primária** (botão dourado com texto `leaf-ink`), títulos sobre verde, etapa atual |
| `--gold-soft` | `#fbefc9` | chips "mais pedido", bloco Pix |
| `--ink` / `--ink-2` / `--ink-3` | `#26201a` / `#5e554a` / `#8c8273` | texto (marrom-casca) |
| `--egg` / `--egg-soft` | `#c98b57` / `#f6e6d3` | acento de ovo, chip "novidade" |
| `--danger` / `--danger-soft` | `#c0392b` / `#fbe4e1` | erro |

Regra: dourado é ação e destaque; verde é campo e estado; nunca os dois como fundo do mesmo componente. Texto sobre verde é creme (corpo) ou dourado (título).

## Tipografia

- **Display:** Fredoka 400–700 (`--font-display`) — eco do lettering arredondado da logo. Títulos de tela 26–30px/600, títulos de seção 18–20px/600, preços e números em `tabular-nums`.
- **Corpo/UI:** Figtree 400–700 (`--font-sans`), 16px base, 13–15px em rótulos e metadados. Inputs sempre 16px (evita zoom no iOS).
- Escala fixa em px (não fluida). Tracking neutro; sem gradient text; sem kickers acima de títulos (o rótulo em caixa alta só aparece como metadado dentro de cartões).

## Materiais e assinatura

- **Toldo** (`.awning` + `.awning-edge`): listras 28px verde/branco com recorte em ondas (máscara CSS) — topo da home, cartões do onboarding, rodapé do splash.
- **Placa de preço** (`.sign-tag` / `<PriceSign>`): verde, girada −2,5°, furo do barbante dourado, "R$" dourado, cifra em creme. Balança uma vez ao entrar na tela de produto.
- **Ilustrações SVG autorais** (`components/illustrations`): ovo com gradiente radial, luz de borda, brilho e pintas (`EggShape`); caixas 6/12 em 3/4 (`Carton`), bandejas 15/30 (`Tray`), caixote de madeira (`Crate`), trio na palha (`EggCluster`). Fundo em pódio quente (`ProductImage`).
- **Logo real** em círculo (`public/brand/logo-circle*.png`) — splash, cabeçalhos, perfil, ícones do PWA.

## Componentes

- **Button**: 56px (`lg`), raio 18px, `primary` dourado com sombra dourada, `leaf` verde, `secondary` verde-suave, `outline`, `ghost`, `danger`. Curso de pressão (`.pressable`: scale .97 + 1px).
- **Field/TextArea**: 52px, raio 14px, borda `line-strong`, foco verde com halo `leaf-soft`, ícone à esquerda, erro em vermelho abaixo.
- **QtyStepper**: pílula com "+" verde, número em Fredoka, lixeira quando qty = 1.
- **Chip**: 24px, tons `gold` / `leaf` / `egg` / `neutral` / `danger`.
- **TabBar**: 68px + safe area, 3 abas, pílula verde-suave animada (`layoutId`).
- **CartBar**: gaveta flutuante verde-escura acima das abas, círculo dourado com badge.
- **Toast**: escuro, ícone circular colorido por tipo, topo com safe area.
- **Skeleton**: shimmer em tons de creme.

## Layout e comportamento nativo

- Coluna do app `--app-width: 430px` centralizada no desktop (fundo listrado suave + sombra); tela cheia no celular. Elementos fixos usam `.app-fixed`.
- Raio: 22–26px cartões/heróis, 18–20px listas, 14–16px inputs, pílulas em ações pequenas. Espaçamento em múltiplos de 4px; margens laterais 20px.
- `viewport-fit=cover`, `maximumScale=1`; safe areas via `--safe-top` / `--safe-bottom`; sem scrollbar visível; `user-select: none` exceto inputs e `[data-selectable]` (número do pedido, chave Pix); `touch-action: manipulation` nos controles.

## Motion

150–250ms, `cubic-bezier(0.16,1,0.3,1)`. Momentos autorados: placa de preço balança ao entrar; gaveta do carrinho sobe; check de confirmação com mola + confetes discretos; estrada e timeline do acompanhamento crescem com o tempo real; transição de tela 180ms (fade + 6px). `prefers-reduced-motion` respeitado.

## Estados

Carregamento: skeletons até hidratar. Vazio: carrinho e pedidos com ilustração e CTA. Erro: validação inline + toast. Sucesso: toast verde. Offline: service worker (app shell).
