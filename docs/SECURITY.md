# Revisão de segurança (10/10/2026)

Escopo: site público, Control (control.grupov3x.com.br), APIs, banco (Supabase), segredos, dependências e o assistente de WhatsApp com IA.

## Corrigido nesta revisão
| Item | Risco | Correção |
|---|---|---|
| Next.js 16.2.9 | Crítico: execução remota de código no otimizador de imagens, bypass do proxy (camada que redireciona quem não está logado), SSRF, cache poisoning | Atualizado para 16.3.8 (versão fixa) |
| Dependências indiretas (undici, proxy-addr, postcss, sharp etc.) | Alto/crítico | `npm audit fix`; `next-sitemap` (sem uso) removido; `shadcn` (CLI) movido para devDependencies. Restam 4 moderadas em gray-matter/js-yaml, que só leem os MDX do próprio repositório (entrada confiável): risco aceito |
| Sem proteção contra clickjacking | O Control podia ser embutido em página maliciosa | `X-Frame-Options: DENY` e CSP `frame-ancestors 'none'` em todas as respostas |
| Cabeçalhos ausentes | Sniffing de tipo, vazamento de referrer, APIs do navegador | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, CSP base (`object-src 'none'`, `base-uri`, `form-action`, `upgrade-insecure-requests`); `X-Powered-By` removido |
| JSON-LD do blog e do "Sobre" sem escape | XSS armazenado: um título de artigo com `</script>` executaria código no site | Função `safeJson` compartilhada (testada) |
| Formulário de contato | Spam enchendo o Pipeline; injeção de fórmula na planilha (`=` vira fórmula no Google Sheets); envios a partir de outros sites | Limite de 5 envios/10 min por IP, deduplicação, tamanho máximo, checagem de origem, valores da planilha neutralizados, campo-armadilha |
| Segredo do webhook aceito na URL (`?token=`) | Segredo em logs de acesso | Aceito só no header `x-webhook-secret` |
| Link "interno" no Markdown decidido por texto | `evil.com/?grupov3x.com.br` era tratado como interno | Comparação pelo domínio real |
| GA4 com recursos de anúncio | Sinais do Google/personalização ativos na propriedade | Desligados no código (`allow_google_signals: false`); Consent Mode mantém `ad_*` negado |

## Verificado e em ordem
- Segredos: nenhuma chave no código nem no histórico do git; chaves do Supabase (service role), Gemini e Evolution só no servidor; variáveis da Vercel marcadas como sensíveis.
- Banco: RLS em todas as tabelas (inclusive as novas); Security Advisor com 0 erros. Cadastro público, login anônimo desligados; e-mail confirmado obrigatório.
- APIs: toda rota que altera dados exige sessão + checagem de origem (CSRF), exceto o formulário público (com as proteções acima), o webhook (segredo) e o cron (CRON_SECRET ou agente da Vercel + intervalo mínimo). Ações sensíveis (WhatsApp, respostas automáticas, rotina manual) exigem administrador.
- Markdown: HTML bruto escapado, `javascript:` bloqueado (testado). Upload: até 50 MB, só imagem/vídeo, sem SVG.
- Monitoramento: proteção contra SSRF por DNS e a cada redirecionamento.
- Assistente de WhatsApp: mensagens do cliente tratadas como conteúdo não confiável (proteção contra prompt injection), sem ferramentas/ações além de responder, resposta validada (tamanho, só links do grupov3x.com.br), limite por conversa e limite diário global de IA, nunca se passa por humano, pausa quando a equipe assume.

## Auditoria final (10/10/2026, noite)
| Item | Resultado |
|---|---|
| Teste de permissões no banco de produção (5 perfis, transação desfeita) | Visitante e usuário sem acesso: 0 registros, escrita negada. Cliente A: vê só o projeto e o relatório do cliente A (0 do cliente B, 0 internos), não edita nem vira admin. Membro: trabalha nos dados, não altera configurações de admin, não vê convites, não vira admin. Admin: acesso total |
| Histórico de auditoria | Era possível forjar o autor de um registro; agora o banco grava sempre o e-mail do usuário logado (trigger, testado). O histórico continua só de inclusão (membros não apagam nem editam) |
| Índices | 14 chaves estrangeiras sem índice receberam índice |
| Backups | Plano Free do Supabase não tem backup. Criado backup lógico diário (JSON) em bucket privado, 14 dias, e botão "Baixar backup" para admins |
| Limites de login | Supabase: 30 tentativas de login por 5 min por IP; recuperação de senha limitada pelo envio de e-mails do Supabase |
| Verificação por e-mail em novo dispositivo | Não implementada (não existe no projeto). Alternativa recomendada: MFA (TOTP) do Supabase para admins |

## Pendências recomendadas (dependem de você)
0. **Backups:** o plano Free não tem backup do Supabase. Considerar o plano Pro (backups diários de 7 dias) e baixar periodicamente o JSON em Control > Monitoramento > Baixar backup.
1. Supabase > Authentication > Attack Protection: ativar **proteção contra senhas vazadas** (único aviso do Security Advisor; pode exigir plano pago).
2. Ativar **MFA** para as contas de administrador.
3. Definir `CRON_SECRET` na Vercel (valor longo e aleatório) para a rotina diária exigir o segredo.
4. Revisar quem tem acesso à conta da Vercel, do Supabase e do Google Analytics; usar autenticação em dois fatores nelas.
5. Girar a chave do Gemini que apareceu em captura de tela durante a configuração.
6. Remover a variável sem uso `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` da Vercel.
7. WhatsApp via Evolution usa conexão não oficial (WhatsApp Web): há risco de bloqueio do número pelo WhatsApp, maior com respostas automáticas em volume. Usar um número dedicado e manter os limites.
