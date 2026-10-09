# DESIGN.md — V3X Digital Product Studio

## 1. Visual Theme & Atmosphere

V3X embodies **precisão técnica com direção de arte editorial** — a confiança de quem constrói
produtos digitais reais, comunicada com a mesma disciplina visual que se exige de um produto de
software. A interface não tenta parecer "amigável" ou "corporativa": ela parece **construída**,
como um console técnico com camada editorial por cima. Preto e papel off-white alternam seção a
seção; um único gradiente diagonal azul→violeta (herdado do símbolo "X" da marca) é o único
elemento de cor permitido, usado como assinatura, nunca como decoração repetida.

**Key Characteristics:**
- Alternância rígida entre seções pretas (`#0A0A0A`) e seções papel (`#F3F2EE`) — nunca duas seções consecutivas com o mesmo fundo
- Gradiente diagonal azul→violeta como assinatura única da marca (logo, linha de corte, sublinhados de destaque) — nunca em botões cheios ou texto corrido
- Marcações técnicas discretas: cruzes `+` nos cantos, numeração editorial `01 / 08` em mono, linhas finas de 1px como régua
- Tipografia grande, pesada, com tracking apertado nos títulos — corpo de texto contido e legível
- Grid de 12 colunas exposto propositalmente em alguns blocos (linhas verticais finas visíveis)
- Zero cards arredondados genéricos — bordas retas (0–6px), hierarquia por espaço negativo e linha, não por sombra
- Imagens de produto real (Veredito) tratadas como prova, nunca como decoração — sempre com moldura de janela/browser
- Movimento funcional: revela conteúdo ao rolar, nunca anima por capricho

---

## 2. Color Palette & Roles

### Primary
- **Ink** (`#0A0A0A`): `--color-ink` — Fundo das seções escuras; texto principal sobre papel
- **Paper** (`#F3F2EE`): `--color-paper` — Fundo das seções claras (off-white quente, nunca `#FFFFFF` puro em área grande)

### Accent
- **Accent Blue** (`#3B6EFF`): `--color-accent` — Links, foco, ícones ativos, CTA secundário
- **Accent Violet** (`#8B3FFB`): `--color-accent-2` — Par do gradiente; usado só dentro de `--gradient-signature`
- **Gradient Signature**: `linear-gradient(135deg, #3B6EFF 0%, #8B3FFB 100%)` — logo, linha diagonal, sublinhado de destaque, borda ativa de 2px
- **Accent Hover** (`#2A54E0`): `--color-accent-hover` — Hover de links/botões accent

### Interactive
- **Link Default** (`#3B6EFF`): `--color-link` — sobre papel (contraste 4.6:1 em `#F3F2EE`)
- **Link on Dark** (`#8FA8FF`): `--color-link-dark` — sobre ink (contraste 6.1:1 em `#0A0A0A`)
- **Focus Ring** (`#3B6EFF`): `--color-focus` — outline 2px, offset 2px, ambos os temas

### Neutral Scale
- **White** (`#FFFFFF`): `--color-neutral-0` — usado só em texto sobre `--color-ink`, nunca como fundo de seção
- **Paper** (`#F3F2EE`): `--color-neutral-50` — fundo claro padrão
- **Gray 100** (`#E8E7E1`): `--color-neutral-100` — cards sobre papel, hover sutil
- **Gray 200** (`#D4D2C9`): `--color-neutral-200` — bordas sobre papel
- **Gray 400** (`#8F8D84`): `--color-neutral-400` — placeholder, ícones secundários sobre papel (3.1:1 — só para elementos grandes/decorativos)
- **Gray 600** (`#6B6A62`): `--color-neutral-600` — texto secundário sobre papel (5.3:1 — passa AA texto normal)
- **Gray 800** (`#2B2A26`): `--color-neutral-800` — texto primário sobre papel (14.8:1)
- **Ink** (`#0A0A0A`): `--color-neutral-900` — títulos sobre papel, fundo de seção escura
- **Dark Gray 600** (`#A6A49B`): `--color-neutral-dark-600` — texto secundário sobre ink (7.8:1)
- **Dark Gray 400** (`#56544C`): `--color-neutral-dark-400` — bordas e divisores sobre ink

### Surface & Borders
- **Surface Primary (light)** (`#F3F2EE`): `--surface-primary` — fundo de página clara
- **Surface Primary (dark)** (`#0A0A0A`): `--surface-primary-dark` — fundo de página escura
- **Surface Elevated** (`#FFFFFF`): `--surface-elevated` — cards/janelas de produto sobre papel
- **Surface Elevated (dark)** (`#141412`): `--surface-elevated-dark` — cards sobre ink
- **Border Default** (`#D4D2C9`): `--border-default` — sobre papel
- **Border Default (dark)** (`#2A2924`): `--border-default-dark` — sobre ink
- **Border Subtle** (`#E8E7E1` / `#1C1B18`): `--border-subtle` — divisores claro/escuro

### Shadow Colors
- **Shadow SM** (`rgba(10, 10, 10, 0.06)`): `--shadow-color-sm` — leve separação de cards sobre papel
- **Shadow MD** (`rgba(10, 10, 10, 0.10)`): `--shadow-color-md` — elevação de janelas de produto
- **Shadow LG** (`rgba(10, 10, 10, 0.18)`): `--shadow-color-lg` — modais, menu mobile

---

## 3. Typography Rules

**Primary Font:** Geist, -apple-system, BlinkMacSystemFont, sans-serif (variável, self-hosted via pacote `geist`)
**Secondary Font:** Geist Mono, ui-monospace, "SF Mono", monospace — numeração, eyebrows, labels técnicos

**OpenType Features:** `font-feature-settings: 'ss01', 'cv05';` (Geist stylistic sets — "1" de haste reta, "a" de caixa única)

### Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display / Hero | Geist | clamp(2.75rem, 6vw, 5.5rem) / 44–88px | 700 | 0.98 | -0.03em | Home hero apenas, quebra em 2–3 linhas |
| H1 | Geist | clamp(2.25rem, 4vw, 3.5rem) / 36–56px | 700 | 1.05 | -0.025em | Título de página |
| H2 | Geist | clamp(1.75rem, 3vw, 2.5rem) / 28–40px | 600 | 1.1 | -0.02em | Header de seção |
| H3 | Geist | 1.5rem / 24px | 600 | 1.2 | -0.01em | Título de card/subseção |
| H4 | Geist | 1.125rem / 18px | 600 | 1.3 | -0.005em | Título de item em lista |
| Body Large | Geist | 1.25rem / 20px | 400 | 1.55 | 0 | Lead/subhead, 60–70ch |
| Body | Geist | 1rem / 16px | 400 | 1.6 | 0 | Corpo padrão |
| Body Small | Geist | 0.875rem / 14px | 400 | 1.5 | 0.005em | Legendas, metadados |
| Label / Eyebrow | Geist Mono | 0.75rem / 12px | 500 | 1.4 | 0.14em (UPPERCASE) | "QUEM SOMOS", tags de categoria |
| Numbering | Geist Mono | 0.75rem / 12px | 500 | 1.4 | 0.04em | "01 / 08", contadores de seção |

---

## 4. Component Stylings

### Buttons

**Primary Button**
- Default: `bg: #0A0A0A; color: #F3F2EE; padding: 14px 28px; border-radius: 4px; box-shadow: none; font-weight: 600; font-size: 16px; border: 1px solid #0A0A0A;`
- Hover: `bg: #2B2A26; transform: translateY(-1px);`
- Focus: `outline: 2px solid #3B6EFF; outline-offset: 2px;`
- Active: `bg: #000000; transform: translateY(0);`
- *Sobre fundo escuro, inverte:* `bg: #F3F2EE; color: #0A0A0A; border: 1px solid #F3F2EE;` hover `bg: #D4D2C9`

**Secondary Button**
- Default: `bg: transparent; color: #0A0A0A; border: 1px solid #0A0A0A; padding: 13px 27px; border-radius: 4px;`
- Hover: `bg: #0A0A0A; color: #F3F2EE;`
- Focus: `outline: 2px solid #3B6EFF; outline-offset: 2px;`
- Active: `bg: #2B2A26; color: #F3F2EE;`
- *Sobre fundo escuro:* `border: 1px solid #F3F2EE; color: #F3F2EE;` hover `bg: #F3F2EE; color: #0A0A0A;`

**Ghost / Link Button** (CTAs secundárias tipo "Ver Guias →")
- Default: `color: #0A0A0A; border-bottom: 1px solid currentColor; padding-bottom: 2px; font-weight: 500;`
- Hover: seta desloca `4px` à direita, `transition: transform 200ms ease;`

### Cards

- Background: `#FFFFFF` (sobre papel) / `#141412` (sobre ink)
- Border: `1px solid #D4D2C9` (papel) / `1px solid #2A2924` (ink)
- Shadow: `--shadow-color-sm` no estado padrão, `--shadow-color-md` no hover
- Border Radius: `4px`
- Padding: `32px` (desktop) / `24px` (mobile)
- Hover: `border-color` muda para `#0A0A0A` (papel) ou `#F3F2EE` (ink); nunca scale — só translateY(-2px)

### Product Window Frame (componente próprio — screenshots do Veredito)
- Container: `border-radius: 8px; border: 1px solid var(--border-default); overflow: hidden; box-shadow: var(--shadow-color-md);`
- Top bar: `height: 32px; bg: #1C1B18; display:flex; align-items:center; padding-inline: 12px; gap: 6px;` com 3 pontos de 8px (`#3A3832`) simulando controles de janela
- Nunca usar screenshot sem essa moldura — é o que sinaliza "produto real" vs. mockup solto

### Inputs

- Background: `#FFFFFF` (papel) / `#141412` (ink)
- Border: `1px solid #D4D2C9` / `1px solid #2A2924`
- Border (Focus): `1px solid #3B6EFF`
- Focus Ring: `0 0 0 3px rgba(59, 110, 255, 0.18)`
- Padding: `12px 16px`
- Placeholder Color: `#6B6A62` (papel, 5.3:1) / `#A6A49B` (ink)
- Border Radius: `4px`
- Font Size: `16px`

### Navigation

- Background: `rgba(243, 242, 238, 0.85)` com `backdrop-filter: blur(12px)` ao rolar; transparente no topo sobre hero escuro
- Link Color: `#2B2A26` (inativo) / `#F3F2EE` sobre hero escuro
- Link Hover: `#0A0A0A` com sublinhado gradiente de 2px nascendo da esquerda
- Active Indicator: sublinhado gradiente `--gradient-signature` de 2px, `width: 100%`, sem transição de entrada (estado, não animação)
- Mobile Menu Background: `#0A0A0A` tela cheia, itens em Geist 32px

---

## 5. Layout Principles

- **Base Unit:** 4px
- **Spacing Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- **Max Container Width:** 1280px (conteúdo), 1440px (seções full-bleed com padding lateral)
- **Grid Columns:** 12 colunas, gutter de 24px (desktop), 16px (mobile)
- **Section Spacing:** 128px desktop / 72px mobile de padding vertical entre seções principais
- **Border-Radius Scale:**
  - Small (tags, badges, inputs): 4px
  - Medium (botões): 4px
  - Large (cards): 4px
  - XL (janelas de produto, blocos de imagem): 8px
  - Full (avatares, dots de navegação): 9999px

---

## 6. Depth & Elevation

| Level | Name | Shadow Value | Usage |
|---|---|---|---|
| 0 | Flat | `none` | Texto, seções de fundo, divisores |
| 1 | Low | `0 1px 2px rgba(10,10,10,0.04), 0 1px 3px rgba(10,10,10,0.06)` | Cards em repouso |
| 2 | Medium | `0 4px 6px rgba(10,10,10,0.08), 0 2px 4px rgba(10,10,10,0.06)` | Cards em hover, janelas de produto |
| 3 | High | `0 10px 15px rgba(10,10,10,0.12), 0 4px 6px rgba(10,10,10,0.08)` | Menu mobile, dropdown de navegação |
| 4 | Highest | `0 20px 40px rgba(10,10,10,0.20)` | Modal de projeto, lightbox de motion |

---

## 7. Do's and Don'ts

### Do
- Usar a escala de espaçamento exclusivamente — nunca valores arbitrários
- Alternar fundo ink/paper a cada seção — nunca duas seguidas iguais
- Reservar o gradiente para o logo, linha de assinatura e estado ativo — é raro de propósito
- Testar todo par texto/fundo contra WCAG AA antes de shippar (ver ratios anotados acima)
- Mostrar screenshots reais do Veredito sempre dentro do Product Window Frame
- Identificar status de projeto (`Em desenvolvimento`, `Estudo`) de forma visível, nunca escondido
- Usar Geist Mono só para números, eyebrows e labels técnicos — nunca para parágrafos

### Don't
- Não misturar fontes além do par Geist/Geist Mono
- Não usar mais que 2 pesos de fonte por bloco de texto (ex: 400 + 600)
- Não aplicar `border-radius` acima de 8px em nada — quebra a linguagem técnica/reta
- Não usar o gradiente como fundo sólido de seção inteira — vira "gradiente neon genérico", exatamente o que a marca evita
- Não inventar depoimentos, métricas ou clientes — "Selected work" mostra status real
- Não usar ícones genéricos de foguete/cérebro/circuito
- Não animar scroll com parallax pesado — revelação simples (fade + translateY 16px, 400ms) é suficiente

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Coluna única, nav vira tela cheia, seções com padding 48px, hero quebra em 2 linhas |
| Tablet | 640px – 1023px | Grid de serviços 2 colunas, portfólio 1 coluna, nav ainda hamburger |
| Desktop | 1024px – 1279px | Grid completo (12 col), nav persistente, cards de serviço em 4 colunas |
| Wide | ≥ 1280px | Container travado em 1280px, margens laterais crescem |

### Touch Targets
- Mínimo 44×44px em todo elemento clicável
- Espaçamento mínimo de 8px entre alvos adjacentes

### Font Scaling
- Mobile: Body 16px, H1 36px, Display 44px
- Tablet: Body 16px, H1 44px, Display 56px
- Desktop+: escala completa da Seção 3

### Collapsing Strategy
- **Navigation:** Hamburger abaixo de 1024px → overlay preto full-screen com itens em Geist 32px
- **Grid:** 12 colunas → 6 (tablet) → 1 (mobile)
- **Service Cards:** 4 colunas → 2 (tablet) → 1 empilhado (mobile)
- **Portfolio:** editorial 2 colunas → 1 coluna com imagem full-bleed (mobile)
- **Founders:** 3 colunas lado a lado → 1 coluna empilhada, foto full-width (mobile)
- **Tables (se houver):** scroll horizontal com sombra de borda indicando overflow

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Ink:        #0A0A0A    Accent:     #3B6EFF
Paper:      #F3F2EE    Accent2:    #8B3FFB
Text/800:   #2B2A26    Border:     #D4D2C9
Text/600:   #6B6A62    Focus:      #3B6EFF
Dark text:  #F3F2EE    Dark border:#2A2924
```

### Component Prompts

**"Build a hero section"**
- Container: full-bleed, min-height 92vh, padding 128px top / 64px bottom, bg `#0A0A0A`
- Heading: Geist, clamp(2.75rem,6vw,5.5rem), weight 700, color `#F3F2EE`, letter-spacing -0.03em, max-width 14ch
- Subheading: Geist, 20px, weight 400, color `#A6A49B`, max-width 48ch
- CTA primary: bg `#F3F2EE`, color `#0A0A0A`, padding 14px 28px, radius 4px, hover `bg:#D4D2C9`
- Detalhe de marca: linha diagonal 1px com `--gradient-signature`, cruzes `+` em `#56544C` nos 4 cantos do container

**"Build a service card grid (4 pilares)"**
- Grid: 4 colunas, 24px gap, responsive → 2 (tablet) → 1 (mobile)
- Card: bg `#FFFFFF`, border 1px solid `#D4D2C9`, radius 4px, padding 32px, shadow Level 1
- Card hover: border-color `#0A0A0A`, translateY(-2px), shadow Level 2, transition 200ms ease
- Número do card: Geist Mono 12px `#6B6A62` ("01")
- Card Title: Geist 18px weight 600 color `#0A0A0A`
- Card Body: Geist 15px weight 400 color `#6B6A62` line-height 1.5

**"Build a project/case study card (Selected Work)"**
- Layout editorial: imagem full-bleed topo (Product Window Frame se for screenshot de produto), status badge sobreposto
- Status badge: Geist Mono 11px uppercase, bg `#0A0A0A`, color `#F3F2EE`, padding 4px 10px, radius 9999px
- Título: Geist 24px weight 600
- Categoria: Geist Mono 12px uppercase `#6B6A62` letter-spacing 0.14em
- Hover: imagem escala 1.02 (só a imagem, 400ms ease), nunca o card inteiro

**"Build a founder bio block"**
- Layout: foto quadrada/retrato real, aspect-ratio 4/5, grayscale(0) — nunca filtro decorativo
- Área (eyebrow): Geist Mono 11px uppercase `#6B6A62`, acima do nome
- Nome: Geist 28px weight 600
- Cargo: Geist 15px weight 500 `#3B6EFF`
- Bio: Geist 15px `#6B6A62` line-height 1.6, max-width 42ch
