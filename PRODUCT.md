# Product

<!-- impeccable:product-schema 1 -->

> Registro inferido a partir do brief detalhado do cliente (sessão autônoma, sem entrevista). Itens marcados **[inferido]** são hipóteses razoáveis a confirmar; os demais vêm literalmente do brief.

## Platform

web

## Stack

delegated: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion, PWA client-side sem backend (dados mocados, estado em localStorage), deploy na Vercel. Escolhido por ser o caminho mais confiável para um PWA instalável, com deploy em um comando e zero superfícies de falha em apresentação.

## Users

- **Consumidor final** (cliente da Granja Canaã): pessoa que compra ovos caipiras para a casa, pelo celular, em poucos toques — quer repetir o pedido com facilidade e receber em casa em um horário combinado.
- **A dona da granja (cliente do projeto)**: avaliará esta versão de apresentação para decidir fechar o projeto. Precisa "se ver" no app e sentir que é produto pronto.

## Product Purpose

Delivery de ovos caipiras da Granja Canaã. O app permite escolher produtos (dúzia, bandeja, kits), ajustar quantidade, informar entrega (nome, telefone, endereço, horário), escolher pagamento (Pix, Dinheiro, Cartão), confirmar e acompanhar o pedido (Recebido → Em preparo → Saiu para entrega → Entregue). Sucesso desta versão: a cliente abre, navega o fluxo inteiro sem barreira e pensa "é exatamente isso".

## Positioning

Ovo caipira de granja própria, entregue em casa, com atmosfera acolhedora e confiável — não um marketplace genérico. **[inferido]** O diferencial é a relação direta granja→casa: frescor, origem conhecida, entrega combinada.

## Operating Context

- Uso pelo celular, geralmente instalado como PWA; a apresentação à cliente pode acontecer em desktop (link) ou no celular dela.
- Dados fictícios coerentes; nenhum pagamento real, nenhum backend.
- Deve funcionar após recarregar a página e em conexão ruim (estado persistido localmente).

## Capabilities and Constraints

- Somente a experiência do consumidor nesta fase; painel administrativo fora de escopo.
- Fluxo mínimo: entrada/apresentação → login/cadastro/explorar sem login → home → catálogo → produto → carrinho → checkout (dados, horário, pagamento) → confirmação com número de pedido → acompanhamento com timeline.
- Comportamento de app nativo: sem zoom acidental, sem seleção de texto desnecessária, safe areas, inputs bem resolvidos, instalável.
- Terminologia: "ovos caipiras", "dúzia", "bandeja com 30", "granja", "entrega", "pedido".
- Preços são fictícios e devem ser marcados como tal na documentação de entrega (não no app, que precisa parecer real).

## Brand Commitments

- Nome: **Granja Canaã**.
- Atmosfera: acolhedora, natural, confiável, premium, "simplicidade sofisticada", alimentação caseira e saudável.
- Evitar: visual genérico, frio, poluído, "cara de sistema", neon, sci-fi, excessivamente tecnológico.
- Copy humana, amigável, leve, acolhedora, profissional; em português do Brasil.
- **[inferido]** Sem logotipo fornecido; a marca será desenhada (logomarca tipográfica + símbolo) e deve ser substituível.

## Evidence on Hand

- Nenhum asset real (fotos, logo, preços, endereço, telefone) foi fornecido. Tudo será autorado como material sintético, identificado na documentação de entrega para substituição posterior.
- Não inventar depoimentos de clientes reais nem certificações; se usados como demonstração, marcá-los como fictícios na documentação.

## Product Principles

1. Zero barreira para experimentar: "explorar sem login" é caminho de primeira classe.
2. Cada tela vende o produto: o ovo é o protagonista visual.
3. Fluxo curto e óbvio; o botão principal sempre visível e inequívoco.
4. Sensação de app pronto: estados de carregamento, vazio, erro e sucesso tratados; nada quebra ao recarregar.
5. Calor sem infantilidade: orgânico e premium, nunca "fofo demais" nem "corporativo".
