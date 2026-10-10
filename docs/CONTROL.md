# V3X Control: guia de ativação e operação

O Control é o centro de operações interno da V3X (rota `/control`), no mesmo repositório do site público.
Ele funciona em três modos, escolhidos automaticamente pelas variáveis de ambiente:

| Modo | Quando | O que acontece |
|---|---|---|
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` definidas | Banco real, login obrigatório, RLS no banco. É o modo de produção. |
| **Local** | Desenvolvimento (`npm run dev`) sem Supabase | Dados em `.data/control.json` (ignorado pelo Git), sem login, só aceita acesso pelo próprio computador. |
| **Demonstração** | Produção sem Supabase | Somente leitura, registros marcados “Exemplo”, IA e escrita desativadas. |

## Estado atual (10/10/2026)

- Projeto Supabase **v3x-control** criado (região São Paulo, `https://lwmxrhaixxtgkbbcwawt.supabase.co`), com todas as migrations aplicadas e verificadas.
- Autenticação: Site URL `https://grupov3x.com.br`, redirect `https://grupov3x.com.br/login`, cadastro público **desligado**.
- Convite de administrador cadastrado para o e-mail do fundador (tabela `control_invites`).
- Vercel: `NEXT_PUBLIC_SUPABASE_URL` definida. Faltam as chaves (abaixo).

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
| `EVOLUTION_PATH_SEND` / `EVOLUTION_PATH_STATE` | Opcional, se a sua versão usar caminhos diferentes de `/message/sendText/{instance}` e `/instance/connectionState/{instance}` |

Na Evolution, cadastre o webhook:
- URL: `https://grupov3x.com.br/api/control/whatsapp/webhook`
- Eventos: `MESSAGES_UPSERT` e `MESSAGES_UPDATE`
- Autenticação: header `x-webhook-secret: <EVOLUTION_WEBHOOK_SECRET>` (ou `?token=<segredo>` na URL, se a versão não aceitar headers).

Requer o Supabase com `SUPABASE_SERVICE_ROLE_KEY`. Teste: **Integrações → Verificar agora** (consulta o estado da instância) e uma mensagem enviada do seu próprio celular para o número conectado deve aparecer em **Atendimento**. O Control nunca responde sozinho: a IA só sugere respostas.

## 4. Blog: do Control para o site

- Fluxo: Rascunho → Em revisão → Aprovado → **Publicar** (com confirmação) → Publicado. Despublicar e arquivar também pedem ação explícita.
- A publicação só é aceita com o checklist de SEO obrigatório completo (slug único, meta descrição de 120 a 160 caracteres, 600+ palavras, 3+ seções H2, sem `[VERIFICAR]`).
- O site lê os artigos publicados no banco (`src/lib/control/articles.ts`) junto com os arquivos MDX de `content/blog`. Slugs dos MDX ficam reservados.
- Ao publicar, `/blog`, `/blog/<slug>` e `/sitemap.xml` são revalidados na hora; edições de artigos já publicados aparecem em até 5 minutos.

## 4.1 Portfólio no site

Itens aprovados em **Portfólio → Aprovar para o site** (exige situação Concluído, descrição e capa) aparecem em `/projetos`, na seção “Entregas”, lidos da view `public_portfolio`. Nome do cliente e observações internas nunca saem do Control.

## 4.2 Mídia

Com o Supabase ativo, os campos de capa, miniatura e vídeo ganham o botão **Enviar arquivo** (bucket `control-media`, até 50 MB, imagens e vídeos). O bucket é público por link: não envie material confidencial.

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
