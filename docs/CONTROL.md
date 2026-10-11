# V3X Control: guia de ativação e operação

O Control é o centro de operações interno da V3X (rota `/control`), no mesmo repositório do site público.
Ele funciona em três modos, escolhidos automaticamente pelas variáveis de ambiente:

| Modo | Quando | O que acontece |
|---|---|---|
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` definidas | Banco real, login obrigatório, RLS no banco. É o modo de produção. |
| **Local** | Desenvolvimento (`npm run dev`) sem Supabase | Dados em `.data/control.json` (ignorado pelo Git), sem login, só aceita acesso pelo próprio computador. |
| **Demonstração** | Produção sem Supabase | Somente leitura, registros marcados “Exemplo”, IA e escrita desativadas. |

## Endereço

O Control roda em **https://control.grupov3x.com.br** (CNAME `control` na Hostinger → Vercel, variável `CONTROL_HOST`).
No domínio principal, `/control` e `/login` redirecionam para o subdomínio, e o site público não tem mais link para o Control.
O subdomínio responde com `X-Robots-Tag: noindex` e devolve as páginas do site ao domínio principal.

## Estado atual (10/10/2026)

- Projeto Supabase **v3x-control** criado (região São Paulo, `https://lwmxrhaixxtgkbbcwawt.supabase.co`), com todas as migrations aplicadas e verificadas.
- Autenticação: Site URL `https://control.grupov3x.com.br`, redirects `/login` nos dois domínios, cadastro público **desligado**.
- Security Advisor do Supabase: 0 erros, 0 avisos.
- Convite de administrador cadastrado para o e-mail do fundador (tabela `control_invites`).
- Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` e `CONTROL_HOST` definidas.

## 1. Ativar o banco e o login (Supabase)

1. No projeto Supabase da V3X, abra **SQL Editor**, cole o conteúdo de `supabase/setup.sql` e execute
   (ou `npx supabase login`, `npx supabase link --project-ref <ref>` e `npx supabase db push`).
   As migrations são aditivas e podem ser executadas de novo sem duplicar dados. Elas criam as tabelas, as políticas RLS,
   o organograma inicial, os monitores do site e do próprio Control, a tabela de uso da IA e o bucket de mídia `control-media`.
2. Na Vercel (projeto `v3x-website`, ambiente **Production**), defina:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto (Settings → API).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública *anon/publishable*.
   - `SUPABASE_SERVICE_ROLE_KEY`: chave *service_role*. Só servidor, usada apenas pelo webhook do WhatsApp e pela rotina diária. Nunca com prefixo `NEXT_PUBLIC_`.
3. Em **Authentication → Users**, crie (ou convide) as contas da equipe. Não há cadastro público.
4. Libere cada conta no Control. O jeito mais simples é o convite: cadastre o e-mail antes, e o acesso é concedido
   automaticamente quando a conta for criada (Authentication → Users → Add user):
   ```sql
   insert into public.control_invites (email, role) values ('pessoa@grupov3x.com.br', 'member');
   ```
   Ou, para contas que já existem:
   ```sql
   insert into public.control_users (user_id, role)
   select id, 'admin' from auth.users where email = 'email-da-pessoa@grupov3x.com.br';
   ```
   Papéis: `admin` (gerencia acessos), `member` (equipe), `client_viewer` (futuro portal do cliente; vê só o próprio cliente).
5. Em **Authentication → URL Configuration**, adicione `https://grupov3x.com.br/login` às Redirect URLs (recuperação de senha).
6. Faça um novo deploy. Teste: abrir `/control` deve levar ao login; depois de entrar, **Integrações → Verificar agora** deve mostrar o Supabase como verificado.

## 2. Ativar a IA (Google Gemini)

- `GEMINI_API_KEY` (obrigatória, só servidor).
- Opcionais: `GEMINI_MODEL` (padrão `gemini-3.8-flash`, conteúdo longo), `GEMINI_MODEL_FAST` (padrão `gemini-3.5-flash-lite`, ações rápidas), `GEMINI_TIMEOUT_MS` (padrão 60000), `CONTROL_AI_DAILY_LIMIT` (padrão 200 chamadas por dia por instância).
- Teste: **Integrações → Verificar agora**. Teste automatizado real (fora do repositório, sem gravar a chave):
  `GEMINI_LIVE=1 GEMINI_API_KEY=... npx vitest run tests/gemini.live.test.ts`

Toda chamada passa por `src/lib/control/ai/gemini.ts` (modelo, tempo limite, cota, JSON inválido) e as ações ficam em `src/lib/control/ai/actions.ts`.

## 3. Ativar o WhatsApp (Evolution API)

Variáveis (Vercel, Production):

| Variável | Conteúdo |
|---|---|
| `EVOLUTION_API_URL` | URL base da sua instância Evolution (sem barra final) |
| `EVOLUTION_API_KEY` | Chave de API da instância |
| `EVOLUTION_INSTANCE` | Nome da instância |
| `EVOLUTION_WEBHOOK_SECRET` | Segredo longo e aleatório gerado por você |
| `EVOLUTION_PATH_SEND`, `_STATE`, `_CONNECT`, `_LOGOUT`, `_WEBHOOK` | Opcional, se a sua versão usar caminhos diferentes dos documentados |

Endpoints usados (docs.evolutionfoundation.com.br, API 2.3.x, header `apikey`):
`GET /instance/connectionState/{instance}`, `GET /instance/connect/{instance}` (QR Code / código de pareamento), `DELETE /instance/logout/{instance}`, `POST /message/sendText/{instance}` e `POST /webhook/set/{instance}`.

Passo a passo depois de definir as variáveis e fazer o redeploy (somente administradores):
1. **Integrações → Evolution API → Cadastrar webhook.** O Control aponta a instância para `https://grupov3x.com.br/api/control/whatsapp/webhook`, eventos `MESSAGES_UPSERT` e `MESSAGES_UPDATE`, com o segredo no header `x-webhook-secret` (nunca na URL).
2. **Conectar WhatsApp.** Aparece o QR Code (e o código de pareamento, quando a Evolution fornece). No celular: WhatsApp → Aparelhos conectados → Conectar um aparelho. O estado muda para "Conectado" sozinho.
3. **Desconectar** pede confirmação e só desliga o número da instância; as conversas salvas continuam.

Validação feita sem credenciais: testes automatizados no formato da documentação e um servidor simulado (QR, conexão, webhook, mensagem recebida, resposta enviada e desconexão). Com a instância real, conferir a primeira mensagem de ponta a ponta.

Requer o Supabase com `SUPABASE_SERVICE_ROLE_KEY`. Teste: **Integrações → Verificar agora** (consulta o estado da instância) e uma mensagem enviada do seu próprio celular para o número conectado deve aparecer em **Atendimento**. O Control nunca responde sozinho: a IA só sugere respostas.

## 3.1 Assistente de WhatsApp (Gemini)

Control → **Assistente IA**. Desligado por padrão; só administradores ligam.
- Responde com base no conteúdo real do site (serviços, processo, FAQs, projetos, fundadores) + a **Base de conhecimento** da equipe (horários, prazos médios, como funciona o orçamento, políticas). Tudo na base pode ser dito ao cliente.
- Tom natural de WhatsApp, mensagens curtas, mostra "digitando..." antes de enviar e espera alguns segundos para responder uma única vez quando o cliente manda várias mensagens.
- Nunca inventa preço, prazo ou condição; nunca diz que é humano (se perguntarem, confirma que é o assistente virtual).
- Passa para uma pessoa (pausa a IA na conversa e marca como pendente) quando o cliente pede, em reclamação, financeiro, contrato, negociação, dúvida fora da base ou orçamento com as informações reunidas. Cria a oportunidade no Pipeline com origem WhatsApp.
- Para sozinho quando alguém da equipe responde (pelo Control ou pelo celular) e respeita o limite de respostas por hora. Em Atendimento, cada conversa tem "Pausar IA / Retomar IA".
- "Testar o assistente" simula a resposta sem enviar nada.
- Requer Evolution API e Gemini configurados; sem eles nada é enviado.

## 3.2 Rotina diária

Vercel Cron às 08:00 (Brasília), `vercel.json`: verifica todos os sites monitorados (abre/fecha incidentes) e registra um resumo (tarefas atrasadas, incidentes, artigos para revisar, conversas esperando, leads novos), visível em Monitoramento. Não envia mensagens nem usa IA. Recomendado definir `CRON_SECRET` na Vercel.

## 4. Blog: do Control para o site

- Fluxo: Rascunho → Em revisão → Aprovado → **Publicar** (com confirmação) → Publicado. Despublicar e arquivar também pedem ação explícita.
- A publicação só é aceita com o checklist de SEO obrigatório completo (slug único, meta descrição de 120 a 160 caracteres, 600+ palavras, 3+ seções H2, sem `[VERIFICAR]`).
- O site lê os artigos publicados no banco (`src/lib/control/articles.ts`) junto com os arquivos MDX de `content/blog`. Slugs dos MDX ficam reservados.
- Ao publicar, `/blog`, `/blog/<slug>` e `/sitemap.xml` são revalidados na hora; edições de artigos já publicados aparecem em até 5 minutos.

## 4.1 Portfólio no site

Itens aprovados em **Portfólio → Aprovar para o site** (exige situação Concluído, descrição e capa) aparecem em `/projetos`, na seção “Entregas”, lidos da view `public_portfolio`. Nome do cliente e observações internas nunca saem do Control.

## 4.2 Mídia

Com o Supabase ativo, os campos de capa, miniatura e vídeo ganham o botão **Enviar arquivo** (bucket `control-media`, até 50 MB, imagens e vídeos). O bucket é público por link: não envie material confidencial.

## 4.3 Busca, prazos e portal do cliente

- **Busca (Ctrl+K ou botão "Buscar")**: encontra tarefas, projetos, artigos, clientes, leads, portfólio e motion, e oferece ações rápidas (nova tarefa, artigo com IA, novo projeto, relatório).
- **Tarefas → Por prazo**: Atrasadas, Hoje, Próximos 7 dias, Depois e Sem prazo (só tarefas abertas).
- **Portal do cliente**: uma conta com papel `client_viewer` (convite em `control_invites` com `client_id`) vê só Visão geral, Projetos, Monitoramento e Relatórios do próprio cliente, sem botões de edição. Quem filtra os dados é o banco (RLS); a interface apenas esconde o que não se aplica. Páginas internas abertas pela URL mostram "Área interna da V3X".

## 5. Rotina diária (preparada, não agendada)

`GET /api/control/automations/daily` com `Authorization: Bearer <CRON_SECRET>` devolve tarefas atrasadas, incidentes abertos e artigos aguardando revisão. Não usa IA, não publica nada.
Para agendar: defina `CRON_SECRET` na Vercel e crie `vercel.json` com
```json
{ "crons": [{ "path": "/api/control/automations/daily", "schedule": "0 11 * * 1-5" }] }
```
Sugestões automáticas de pauta com IA devem ser adicionadas a essa rota apenas quando houver decisão sobre custo e revisão.

## 6. Comandos

```bash
npm run dev        # desenvolvimento (modo local)
npm run lint
npm run typecheck
npm test           # testes unitários (vitest)
npm run build
```

## 7. Segurança implementada

- Chaves só no servidor; a interface mostra apenas “definida/ausente”.
- Login Supabase + lista de acesso `control_users`; RLS em todas as tabelas; histórico (`activity_log`) não editável.
- Escrita protegida contra CSRF (verificação de Origin) e validada com zod no servidor.
- Publicação de artigo e aprovação de portfólio só por ações dedicadas com confirmação.
- Portfólio público exposto apenas pela view `public_portfolio` (sem notas internas nem nome do cliente).
- Markdown dos artigos renderizado sem HTML bruto e com links limitados a http(s)/mailto/caminhos do site.
- Webhook autenticado por segredo em tempo constante e idempotente pelo id da mensagem.
- Monitor bloqueia endereços internos pelo nome, pelo IP resolvido no DNS e em cada redirecionamento (proteção contra SSRF).
- Limite diário de IA compartilhado entre todas as instâncias (tabela `ai_usage`, sem guardar conteúdo).
