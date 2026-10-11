# Medição do site público (GA4, GTM e consentimento)

Escopo: somente o site público `grupov3x.com.br`. O Control (`control.grupov3x.com.br`, `/control`, `/login`) não carrega Analytics, não mostra o aviso de cookies e é filtrado das métricas da Vercel.

## Arquitetura

| Peça | Estado |
| --- | --- |
| GA4 | Propriedade existente, fluxo "V3X WEBSITE", ID de medição `G-H3NVMRK99E` (público, não é segredo). Reaproveitado. |
| Google Tag Manager | Não existe container na conta Google usada. Integração pronta: basta definir `NEXT_PUBLIC_GTM_ID`. |
| Consentimento | Aviso próprio (Aceitar, Recusar, Personalizar) + Consent Mode v2. Nada não essencial carrega antes da escolha. |
| Vercel Analytics / Speed Insights | Sem cookies. Mantidos, sem as páginas do Control. |

Código: `src/lib/analytics/*` (config, consent, track, clicks, campaign, forms) e `src/components/analytics/*` (AnalyticsProvider, ConsentBanner, CookiePreferencesButton, VercelMetrics).

### Modos (sem duplicidade)

- **Sem `NEXT_PUBLIC_GTM_ID`** (atual): o site carrega o GA4 direto (`gtag.js`) depois do consentimento.
- **Com `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`**: o site carrega SOMENTE o container. O GA4 passa a ser configurado dentro do GTM (tag "Google Tag" com `G-H3NVMRK99E`). O código não carrega mais o `gtag.js`, então não há duplicidade.
- `NEXT_PUBLIC_GA_ID` permite trocar o ID do GA4 sem mudar código (padrão: `G-H3NVMRK99E`).

### Consentimento (LGPD)

- Padrão Consent Mode (antes de qualquer tag): `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` = `denied`.
- Os scripts do Google só são baixados depois que o visitante permite "Análise". Quem recusa não carrega GA4 (modo básico). Isso é mais restritivo que o "modo avançado" do Consent Mode, e por isso o GA4 não recebe pings sem cookies de quem recusou.
- A escolha fica no próprio navegador (`localStorage`, chave `v3x-consent`) e vale por 12 meses.
- "Preferências de cookies", no rodapé, reabre o painel. Ao revogar: `consent update` negado, `ga-disable-G-H3NVMRK99E = true` e os cookies `_ga*` são apagados.
- A categoria "Marketing" existe só para o futuro: hoje não há pixel de anúncios instalado.
- A política de privacidade (`/privacidade`) foi atualizada para descrever isso. **Recomenda-se revisão jurídica do texto.**

### page_view e navegação

O site é uma aplicação Next.js (navegação sem recarregar). O `page_view` vem da medição otimizada do GA4 ("alterações de página com base no histórico do navegador", ligada na propriedade). O código **não** envia `page_view` manualmente, para não duplicar. Se o GTM for adotado, use a tag do Google com page_view padrão e NÃO crie também um gatilho de "Alteração no histórico" para page_view.

Também vêm da medição otimizada (já ligada) e não são reenviados pelo código: `scroll` (90%), `click` (links de saída), `file_download`, `view_search_results`, `video_*` (YouTube), `form_start`/`form_submit` automáticos.

> Os eventos automáticos `form_start`/`form_submit` do GA4 contam qualquer formulário, inclusive envios que falham. Para o funil comercial use os eventos `lead_form_*` e `generate_lead` abaixo, que refletem o resultado real. Opcional: desligar "Interações com o formulário" na medição otimizada para evitar confusão.

### Campanhas (UTM)

GA4 lê `utm_*` do primeiro hit. Como as tags só carregam após o consentimento, a campanha da página de entrada é guardada na sessão (`sessionStorage`) e repassada ao GA4 pelos campos oficiais `campaign_source`, `campaign_medium`, `campaign_name`, `campaign_term`, `campaign_content` e `campaign_id`, caso o visitante aceite em outra página. Com GTM, o mesmo objeto é enviado na dataLayer como `landing_campaign` (mapeie nos campos da tag do Google).

Não há medição entre domínios: o Control não faz parte do funil, e os demais links externos (WhatsApp) são saídas.

## Eventos

Regras: nomes em `snake_case`; somente parâmetros da lista permitida (`src/lib/analytics/track.ts`); valores curtos; qualquer valor que pareça e-mail ou telefone é descartado. Nunca são enviados nome, e-mail, telefone, mensagem ou campos digitados. Todos os eventos levam `page_type` (home, service_list, service, project_list, project, blog_list, article, contact, about, legal, other).

Um único ouvinte de cliques (captura no `document`) decide no máximo **um** evento por clique, nesta ordem: canal de contato > `data-track` explícito > card de conteúdo > navegação.

| Evento | Quando dispara | Parâmetros | Finalidade | Conversão? |
| --- | --- | --- | --- | --- |
| `generate_lead` (recomendado GA4) | O servidor confirmou o recebimento do formulário (`/api/contato` respondeu ok) | form_name (`contato_pagina`, `contato_modal`), lead_source=`site_form`, service_interest | Lead real recebido | **Sim, principal** |
| `contact_click` | Clique em WhatsApp, e-mail ou telefone (botão flutuante, rodapé, contato, home, menu) | contact_method (`whatsapp`, `email`, `phone`), cta_location, cta_name | Intenção de contato. Não é lead nem venda: não sabemos se a conversa aconteceu | **Sim, intenção** |
| `cta_click` | Clique em chamada para ação marcada (`Começar um projeto`, `Explorar os serviços`, abrir formulário) | cta_name, cta_location, link_url, service_interest | Quais chamadas e posições levam ao contato | Não |
| `lead_form_start` | Primeiro campo do formulário recebe foco | form_name | Início do funil do formulário | Não |
| `lead_form_submit` | Tentativa de envio que passou na validação | form_name | Tentativas (comparar com generate_lead) | Não |
| `lead_form_error` | Validação, servidor indisponível, erro do servidor ou rede | form_name, error_type (`validation`, `unavailable`, `server`, `network`) | Falhas que impedem o lead | Não |
| `lead_form_abandon` | Formulário iniciado e não concluído quando o visitante sai da página, troca de página ou fecha o modal | form_name, last_field (nome do campo, nunca o valor) | Onde as pessoas desistem | Não |
| `select_content` (recomendado GA4) | Clique em link/card de serviço, projeto ou artigo | content_type (`service`, `portfolio_project`, `blog_article`), content_id (slug), cta_location | Que conteúdo atrai cliques e de onde | Não |
| `content_view` | Abertura de página de serviço, projeto ou artigo (uma vez por página) | content_type, content_id | Funil: viu serviço/projeto/artigo antes de contatar | Não |
| `navigation_click` | Clique em link interno do cabeçalho, rodapé, menu mobile ou da página 404 | nav_location, nav_item (`logo` no logotipo), link_url | Uso da navegação | Não |
| `menu_toggle` | Abrir/fechar o menu mobile | menu_state (`open`, `close`) | Uso do menu no celular | Não |
| `content_filter` | Troca de categoria no blog | filter_name=`blog_category`, filter_value | Interesse por tema | Não |
| `faq_expand` | Abertura de pergunta frequente (serviços e artigos) | faq_question, content_type | Dúvidas mais consultadas | Não |
| `video_interaction` | Play, pausa, som no vídeo institucional (só ações do visitante; o autoplay mudo não conta) | video_title=`v3x_motion`, video_action | Engajamento com o vídeo | Não |
| `page_not_found` | Página 404 exibida | page_path (sem parâmetros de URL) | Links quebrados | Não |

### Onde validar

- **Local**: `npm run dev` registra cada evento no console (`[analytics] ...`) e não carrega nada do Google.
- **Produção**: abra o site com `?analytics_debug=1`, aceite os cookies e use **GA4 > Administrador > DebugView**. O modo debug vale para a aba aberta.
- **Navegador**: `window.dataLayer` mostra os comandos `consent`, `config` e `event`.

### Marcação para novos elementos

```html
<a href="/contato" data-track="cta_click" data-track-cta-name="nome_curto">...</a>
<section data-track-area="nome_da_area">...</section>
```

Links de WhatsApp, `mailto:` e `tel:` já viram `contact_click` automaticamente.

## Funil comercial sugerido (Explorar > Funil no GA4)

1. `session_start` (visita)
2. `content_view` com content_type = service (viu um serviço)
3. `content_view` com content_type = portfolio_project ou blog_article (viu prova/conteúdo)
4. `cta_click` (clicou em chamada para ação)
5. `contact_click` OU `lead_form_start` (abriu um canal de contato)
6. `generate_lead` (lead confirmado)

Venda ou lead qualificado não são medidos no site. Desde 10/10/2026 cada lead do formulário entra no **Pipeline do Control** com a origem (página de entrada, site de referência e UTMs da visita), então a qualificação e o fechamento podem ser acompanhados por canal lá. Enviar essas etapas de volta ao GA4 (Measurement Protocol) ainda não foi feito.

## Configuração no GA4

- **Feito (10/10/2026):** 13 dimensões personalizadas de escopo evento: cta_name, cta_location, contact_method, content_type, content_id, form_name, error_type, nav_location, nav_item, page_type, last_field, service_interest, filter_value. Os valores aparecem nos relatórios a partir do registro (não retroativo).
- **Pendente:** marcar `generate_lead` e `contact_click` como eventos principais (estrela em Administrador > Eventos). O GA4 só lista um evento depois que ele chega com dados reais, normalmente até 24 h após o primeiro visitante que aceitar os cookies.
- Medição otimizada: já estava ligada (inclui page_view por histórico, rolagem, cliques de saída, downloads e formulários).

## Validação realizada (10/10/2026)

- Build de produção local e produção (`grupov3x.com.br`) com Chrome automatizado, bloqueando toda requisição ao Google e à Vercel e simulando a API de contato (nenhum lead nem visita falsa foi registrado): 45/46 verificações; a única "falha" foi o console registrar o 503 simulado e a página 404 testada de propósito.
- Payload real do GA4 lido antes de sair (requisições `/g/collect` respondidas localmente, nada chegou ao Google): um `page_view` por página, inclusive na navegação interna; cada evento uma vez; parâmetros corretos; nenhum dado digitado.
- **Não validado:** chegada dos eventos na propriedade (DebugView/Tempo real), porque isso exige aceitar os cookies num navegador real. Para conferir: abrir `https://grupov3x.com.br/?analytics_debug=1`, aceitar, clicar em "Começar um projeto" e ver em GA4 > Administrador > DebugView.

## Se for adotar o GTM

1. Criar conta/container Web em tagmanager.google.com (requer aceite dos termos do Google pelo titular).
2. No container: tag "Google Tag" com `G-H3NVMRK99E`, gatilho Initialization – All Pages; ativar "Configurações de consentimento" (exigir `analytics_storage`).
3. Tags "Evento do GA4" para cada evento da tabela, gatilho "Evento personalizado" com o mesmo nome, parâmetros vindos de variáveis da camada de dados com os mesmos nomes.
4. Definir `NEXT_PUBLIC_GTM_ID` na Vercel (Production) e publicar o container. Validar no modo Preview do GTM.
