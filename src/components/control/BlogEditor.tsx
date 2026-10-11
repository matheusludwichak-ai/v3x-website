"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArrowLeft, CheckCircle2, Circle, ExternalLink, Eye, Globe, Plus, RotateCcw, Save, Send, Sparkles, Trash2, Undo2, XCircle } from "lucide-react";
import type { Article } from "@/lib/control/schema";
import { slugify } from "@/lib/control/schema";
import { seoChecklist } from "@/lib/control/seo";
import { renderMarkdown, wordCount } from "@/lib/markdown";
import { AIBtn, Badge, Btn, Card, Confirm, ErrorBox, Field, ModeBanner, Page, Select, Skeleton, Tabs, TextArea, TextInput, optionsOf } from "./ui";
import { ai, api, ApiError, relative, useRecord, useSession, fmtDate } from "./lib/client";
import { ARTICLE_STATUS_LABEL, ARTICLE_STATUS_TONE, AWARENESS_LABEL, INTENT_LABEL, label } from "./lib/labels";
import { cn } from "@/lib/utils";

type Tab = "content" | "seo" | "preview" | "review";
type Action = "review" | "approve" | "publish" | "unpublish" | "archive" | "restore";
const EDITABLE: (keyof Article)[] = ["title", "seo_title", "slug", "meta_description", "excerpt", "content_md", "category", "tags", "primary_keyword", "secondary_keywords", "search_intent", "audience", "awareness_stage", "related_service", "internal_links", "external_sources", "faq", "cover_suggestion", "cover_url", "cover_alt", "cta", "review_notes"];

export function BlogEditor({ id }: { id: string }) {
  const session = useSession();
  const router = useRouter();
  const { row, setRow, loading, error, reload } = useRecord("articles", id);
  /* Local edits are kept against the saved version they started from; after a save the draft follows the record again. */
  const [edit, setEdit] = useState<{ base: string; value: Article } | null>(null);
  const draft: Article | null = row ? (edit && edit.base === row.updated_at ? edit.value : row) : null;
  const [tab, setTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [taken, setTaken] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<Action | "delete" | null>(null);
  const [acting, setActing] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ text: string; start: number; end: number; kind: "selection" | "section" } | null>(null);
  const [section, setSection] = useState("");
  const [instruction, setInstruction] = useState("Deixe mais claro e prático, com um exemplo concreto.");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    Promise.all([api<{ data: { slug: string }[] }>("/api/control/site-posts"), api<{ data: Article[] }>("/api/control/data/articles")])
      .then(([site, all]) => setTaken([...site.data.map((p) => p.slug), ...all.data.filter((a) => a.id !== id).map((a) => a.slug)]))
      .catch(() => undefined);
  }, [id]);

  const dirty = useMemo(() => !!row && !!draft && EDITABLE.some((k) => JSON.stringify(row[k] ?? null) !== JSON.stringify(draft[k] ?? null)), [row, draft]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!row || !draft) return null;
    const patch = Object.fromEntries(EDITABLE.filter((k) => JSON.stringify(row[k] ?? null) !== JSON.stringify(draft[k] ?? null)).map((k) => [k, draft[k] ?? null]));
    if (!Object.keys(patch).length) return row;
    setSaving(true);
    setFieldErrors({});
    try {
      const res = await api<{ data: Article }>(`/api/control/data/articles/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setRow(res.data);
      toast.success("Rascunho salvo");
      return res.data;
    } catch (e) {
      if (e instanceof ApiError && e.fields) {
        setFieldErrors(e.fields);
        setTab("seo");
      }
      toast.error((e as Error).message);
      return null;
    } finally {
      setSaving(false);
    }
  }, [row, draft, id, setRow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  if (loading) return <Page><Skeleton rows={8} /></Page>;
  if (error || !row || !draft) return <Page><ErrorBox message={error ?? "Artigo não encontrado."} onRetry={reload} /></Page>;

  const set = <K extends keyof Article>(k: K, v: Article[K]) =>
    setEdit((prev) => {
      const current = prev && prev.base === row.updated_at ? prev.value : row;
      return { base: row.updated_at, value: { ...current, [k]: v } };
    });
  const checks = seoChecklist(draft, taken);
  const required = checks.filter((c) => c.level === "required");
  const ready = required.every((c) => c.ok);
  const readonly = !session?.canWrite;
  const headings = [...draft.content_md.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => m[2]!.trim());

  const run = async (action: Action) => {
    setActing(true);
    try {
      if (dirty) {
        const saved = await save();
        if (!saved) return;
      }
      const res = await api<{ data: Article; publicUrl: string | null }>(`/api/control/articles/${id}/publish`, { method: "POST", body: JSON.stringify({ action, confirm: action === "publish" || action === "unpublish" }) });
      setRow(res.data);
      setConfirm(null);
      toast.success({ review: "Enviado para revisão", approve: "Artigo aprovado", publish: "Publicado no site", unpublish: "Retirado do site", archive: "Arquivado", restore: "Restaurado como rascunho" }[action], res.publicUrl ? { description: `Disponível em ${res.publicUrl} (pode levar alguns segundos).` } : undefined);
    } catch (e) {
      const issues = e instanceof ApiError ? (e.extra?.issues as string[] | undefined) : undefined;
      toast.error((e as Error).message, issues ? { description: issues.join(" · ") } : undefined);
      setConfirm(null);
    } finally {
      setActing(false);
    }
  };

  const textAction = async (op: "improve" | "summarize" | "expand" | "rewrite") => {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = draft.content_md.slice(start, end);
    if (selected.trim().length < 20) return toast.info("Selecione um trecho do texto (pelo menos uma frase) para usar a IA.");
    setAiBusy(op);
    try {
      const res = await ai<{ text: string }>({ action: "text", op, text: selected, context: `Trecho do artigo "${draft.title}" do blog da V3X. Mantenha Markdown.` });
      setSuggestion({ text: res.text, start, end, kind: "selection" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiBusy(null);
    }
  };

  const sectionRange = (heading: string) => {
    const lines = draft.content_md.split("\n");
    const idx = lines.findIndex((l) => /^#{2,3}\s+/.test(l) && l.replace(/^#{2,3}\s+/, "").trim() === heading);
    if (idx < 0) return null;
    const level = lines[idx]!.match(/^(#+)/)![1]!.length;
    let endIdx = lines.length;
    for (let i = idx + 1; i < lines.length; i++) {
      const m = lines[i]!.match(/^(#{2,3})\s+/);
      if (m && m[1]!.length <= level) {
        endIdx = i;
        break;
      }
    }
    const start = lines.slice(0, idx).join("\n").length + (idx > 0 ? 1 : 0);
    const end = lines.slice(0, endIdx).join("\n").length;
    return { start, end };
  };

  const regenerateSection = async () => {
    const range = sectionRange(section);
    if (!range) return toast.info("Escolha uma seção.");
    setAiBusy("section");
    try {
      const res = await ai<{ text: string }>({ action: "blog.section", articleTitle: draft.title, section: draft.content_md.slice(range.start, range.end), instruction, keyword: draft.primary_keyword ?? undefined });
      setSuggestion({ text: res.text, ...range, kind: "section" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiBusy(null);
    }
  };

  const applySuggestion = (mode: "replace" | "below") => {
    if (!suggestion) return;
    const c = draft.content_md;
    set("content_md", mode === "replace" ? c.slice(0, suggestion.start) + suggestion.text + c.slice(suggestion.end) : c.slice(0, suggestion.end) + "\n\n" + suggestion.text + c.slice(suggestion.end));
    setSuggestion(null);
  };

  const metaFromText = async () => {
    setAiBusy("meta");
    try {
      const res = await ai<{ text: string }>({ action: "text", op: "summarize", text: draft.content_md.slice(0, 6000), context: `Escreva UMA meta descrição para buscadores, entre 140 e 155 caracteres, sem aspas, incluindo a palavra-chave "${draft.primary_keyword ?? ""}" se fizer sentido.` });
      set("meta_description", res.text.replace(/^["']|["']$/g, "").trim().slice(0, 170));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiBusy(null);
    }
  };

  const listEditor = (key: "internal_links" | "external_sources", title: string, hint: string) => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="cx-label">{title}</span>
        <Btn size="sm" variant="ghost" icon={<Plus className="size-3.5" />} onClick={() => set(key, [...draft[key], { label: "", url: key === "internal_links" ? "/" : "https://" }])}>Adicionar</Btn>
      </div>
      <p className="cx-hint mb-2">{hint}</p>
      <div className="space-y-2">
        {draft[key].map((l, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={l.label} placeholder="Texto do link" onChange={(e) => set(key, draft[key].map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <TextInput value={l.url} placeholder="URL" onChange={(e) => set(key, draft[key].map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
            <button className="cx-icon-btn shrink-0" aria-label="Remover" onClick={() => set(key, draft[key].filter((_, j) => j !== i))}><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const words = wordCount(draft.content_md);
  const publicUrl = `/blog/${row.slug}`;

  return (
    <Page className="max-w-[1500px]">
      <ModeBanner session={session} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/control/blog" className="inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white"><ArrowLeft className="size-4" /> Blog</Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#a0a0a0]">{dirty ? (row.status === "published" ? "Alterações não salvas · artigo publicado: salvar atualiza o site em até 5 min" : "Alterações não salvas") : `Salvo ${relative(row.updated_at)}`}</span>
          <Btn icon={<Save className="size-4" />} onClick={save} loading={saving} disabled={!dirty || readonly}>Salvar</Btn>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone={ARTICLE_STATUS_TONE[row.status]} dot>{label(ARTICLE_STATUS_LABEL, row.status)}</Badge>
            {row.ai_generated && <Badge tone="violet">Criado com IA{row.ai_model ? ` · ${row.ai_model}` : ""}</Badge>}
            <span className="text-xs text-[#a0a0a0]">{words} palavras</span>
          </div>
          <h1 className="sr-only">Editar artigo: {draft.title || "sem título"}</h1>
          <TextArea value={draft.title} onChange={(e) => set("title", e.target.value.replace(/\s*\n\s*/g, " "))} rows={2} aria-label="Título do artigo" className="!min-h-0 resize-none !border-transparent !bg-transparent !px-0 text-2xl font-semibold leading-tight tracking-tight md:text-3xl" invalid={!!fieldErrors.title} />
          {fieldErrors.title && <p className="cx-field-error">{fieldErrors.title}</p>}

          <div className="mt-4">
            <Tabs<Tab> value={tab} onChange={setTab} items={[{ value: "content", label: "Conteúdo" }, { value: "preview", label: "Pré-visualização" }, { value: "seo", label: "SEO e metadados" }, { value: "review", label: "Revisão" }]} />
          </div>

          {tab === "content" && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/8 bg-white/[0.015] p-2">
                <span className="px-1 text-xs text-[#a0a0a0]">IA no trecho selecionado:</span>
                {(["improve", "rewrite", "expand", "summarize"] as const).map((op) => (
                  <AIBtn key={op} session={session} size="sm" loading={aiBusy === op} onClick={() => textAction(op)}>{{ improve: "Melhorar", rewrite: "Reescrever", expand: "Expandir", summarize: "Resumir" }[op]}</AIBtn>
                ))}
              </div>
              {suggestion && (
                <div className="rounded-xl border border-[rgb(136_86_207/40%)] bg-[rgb(136_86_207/7%)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#dccbfa]"><Sparkles className="size-3.5" /> Sugestão da IA para {suggestion.kind === "section" ? "a seção" : "o trecho"}: revise antes de aplicar</p>
                  <div className="cx-prose max-h-72 overflow-y-auto text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(suggestion.text) }} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Btn size="sm" variant="primary" onClick={() => applySuggestion("replace")}>Substituir</Btn>
                    <Btn size="sm" onClick={() => applySuggestion("below")}>Inserir abaixo</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setSuggestion(null)}>Descartar</Btn>
                  </div>
                </div>
              )}
              <Field label="Conteúdo (Markdown)" hint="Use ## para seções e ### para subseções. O título acima já é o H1. Ctrl+S salva.">
                <TextArea ref={editorRef} value={draft.content_md} onChange={(e) => set("content_md", e.target.value)} className="min-h-[60vh] font-mono text-[13.5px] leading-relaxed" spellCheck />
              </Field>
              <Card title="Regenerar uma seção">
                <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
                  <Field label="Seção"><Select value={section} onChange={(e) => setSection(e.target.value)} options={headings.map((h) => ({ value: h, label: h }))} placeholder="Escolha" /></Field>
                  <Field label="Instrução"><TextInput value={instruction} onChange={(e) => setInstruction(e.target.value)} /></Field>
                  <AIBtn session={session} loading={aiBusy === "section"} onClick={regenerateSection} disabled={!section}>Regenerar</AIBtn>
                </div>
              </Card>
            </div>
          )}

          {tab === "preview" && (
            <article className="mt-4 rounded-2xl border border-white/8 bg-[#090a0f] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7fb2ff]">{draft.category || "Artigo"}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">{draft.title}</h1>
              {draft.excerpt && <p className="mt-4 text-lg text-[#a0a0a0]">{draft.excerpt}</p>}
              <div className="cx-prose mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(draft.content_md || "_Sem conteúdo ainda._") }} />
              {draft.faq.length > 0 && (
                <section className="mt-10 border-t border-white/8 pt-6">
                  <h2 className="text-xl font-semibold">Perguntas frequentes</h2>
                  {draft.faq.map((f) => (
                    <div key={f.q} className="mt-4"><p className="font-medium">{f.q}</p><p className="mt-1 text-sm text-[#a0a0a0]">{f.a}</p></div>
                  ))}
                </section>
              )}
              {draft.cta && <p className="mt-10 rounded-xl border border-[rgb(56_130_246/30%)] bg-[rgb(56_130_246/8%)] p-4 text-sm">{draft.cta}</p>}
            </article>
          )}

          {tab === "seo" && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Título SEO" hint={`${(draft.seo_title ?? "").length}/60 caracteres`} error={fieldErrors.seo_title}><TextInput value={draft.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} /></Field>
              <Field label="Slug (URL)" error={fieldErrors.slug ?? (taken.includes(draft.slug) ? "Slug já usado por outro artigo." : undefined)} hint={<>/blog/{draft.slug} · <button type="button" className="text-[#9cc2ff] hover:underline" onClick={() => set("slug", slugify(draft.title))}>gerar do título</button>{row.status === "published" && " · mudar o slug muda a URL publicada"}</>}>
                <TextInput value={draft.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} invalid={!!fieldErrors.slug || taken.includes(draft.slug)} />
              </Field>
              <Field label="Meta descrição" className="md:col-span-2" error={fieldErrors.meta_description} hint={<span className="flex items-center gap-3">{(draft.meta_description ?? "").length}/160 caracteres (ideal 120 a 160)<AIBtn session={session} size="sm" loading={aiBusy === "meta"} onClick={metaFromText}>Gerar do texto</AIBtn></span>}>
                <TextArea value={draft.meta_description ?? ""} onChange={(e) => set("meta_description", e.target.value)} className="!min-h-[4.5rem]" />
              </Field>
              <Field label="Resumo (aparece na listagem do blog)" className="md:col-span-2"><TextArea value={draft.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} className="!min-h-[4rem]" /></Field>
              <Field label="Palavra-chave principal" hint="Informe a validada em ferramenta de pesquisa, se houver."><TextInput value={draft.primary_keyword ?? ""} onChange={(e) => set("primary_keyword", e.target.value)} /></Field>
              <Field label="Palavras-chave secundárias" hint="Separe por vírgulas."><TextInput value={draft.secondary_keywords.join(", ")} onChange={(e) => set("secondary_keywords", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
              <Field label="Intenção de busca"><Select value={draft.search_intent ?? ""} onChange={(e) => set("search_intent", (e.target.value || null) as Article["search_intent"])} options={optionsOf(INTENT_LABEL)} placeholder="Não definida" /></Field>
              <Field label="Estágio de consciência"><Select value={draft.awareness_stage ?? ""} onChange={(e) => set("awareness_stage", (e.target.value || null) as Article["awareness_stage"])} options={optionsOf(AWARENESS_LABEL)} placeholder="Não definido" /></Field>
              <Field label="Público-alvo"><TextInput value={draft.audience ?? ""} onChange={(e) => set("audience", e.target.value)} /></Field>
              <Field label="Serviço relacionado"><TextInput value={draft.related_service ?? ""} onChange={(e) => set("related_service", e.target.value)} /></Field>
              <Field label="Categoria"><TextInput value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} /></Field>
              <Field label="Tags" hint="Separe por vírgulas."><TextInput value={draft.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
              <Field label="Imagem de capa (URL)" error={fieldErrors.cover_url} hint="Opcional. Use uma imagem própria ou licenciada."><TextInput type="url" value={draft.cover_url ?? ""} onChange={(e) => set("cover_url", e.target.value || null)} placeholder="https://" /></Field>
              <Field label="Texto alternativo da capa"><TextInput value={draft.cover_alt ?? ""} onChange={(e) => set("cover_alt", e.target.value)} /></Field>
              <Field label="Sugestão de capa (da IA)" className="md:col-span-2"><TextArea value={draft.cover_suggestion ?? ""} onChange={(e) => set("cover_suggestion", e.target.value)} className="!min-h-[3.5rem]" /></Field>
              <Field label="Chamada para ação (CTA)" className="md:col-span-2"><TextArea value={draft.cta ?? ""} onChange={(e) => set("cta", e.target.value)} className="!min-h-[3.5rem]" /></Field>
              <div className="md:col-span-2">{listEditor("internal_links", "Links internos", "Páginas do próprio site relacionadas ao tema (ex.: /servicos/software).")}</div>
              <div className="md:col-span-2">{listEditor("external_sources", "Fontes externas", "Somente fontes verificadas por você. A IA não inclui fontes externas.")}</div>
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="cx-label">Perguntas frequentes (FAQ)</span>
                  <Btn size="sm" variant="ghost" icon={<Plus className="size-3.5" />} onClick={() => set("faq", [...draft.faq, { q: "", a: "" }])}>Adicionar</Btn>
                </div>
                <div className="space-y-3">
                  {draft.faq.map((f, i) => (
                    <div key={i} className="rounded-xl border border-white/8 p-3">
                      <div className="flex gap-2">
                        <TextInput value={f.q} placeholder="Pergunta" onChange={(e) => set("faq", draft.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
                        <button className="cx-icon-btn shrink-0" aria-label="Remover pergunta" onClick={() => set("faq", draft.faq.filter((_, j) => j !== i))}><Trash2 className="size-4" /></button>
                      </div>
                      <TextArea value={f.a} placeholder="Resposta" className="mt-2 !min-h-[3.5rem]" onChange={(e) => set("faq", draft.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "review" && (
            <div className="mt-4 space-y-4">
              <Field label="Notas de revisão" hint="A IA lista aqui afirmações que precisam de verificação. Marque [VERIFICAR] no texto bloqueia a publicação."><TextArea value={draft.review_notes ?? ""} onChange={(e) => set("review_notes", e.target.value)} className="min-h-[14rem]" /></Field>
            </div>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <Card title="Publicação">
            <ol className="mb-4 space-y-1.5 text-xs">
              {(["draft", "review", "approved", "published"] as const).map((s) => {
                const order = ["draft", "review", "approved", "published"];
                const done = order.indexOf(row.status) >= order.indexOf(s) && row.status !== "archived";
                return (
                  <li key={s} className={cn("flex items-center gap-2", done ? "text-white" : "text-[#6e6e76]")}>
                    {done ? <CheckCircle2 className="size-4 text-[#7fb2ff]" /> : <Circle className="size-4" />} {ARTICLE_STATUS_LABEL[s]}
                  </li>
                );
              })}
            </ol>
            <div className="flex flex-col gap-2">
              {row.status === "draft" && <Btn variant="primary" icon={<Send className="size-4" />} loading={acting} onClick={() => run("review")} disabled={readonly}>Enviar para revisão</Btn>}
              {row.status === "review" && (
                <>
                  <Btn variant="primary" icon={<CheckCircle2 className="size-4" />} loading={acting} onClick={() => run("approve")} disabled={readonly}>Aprovar</Btn>
                  <Btn variant="ghost" icon={<Undo2 className="size-4" />} onClick={() => run("restore")} disabled={readonly}>Voltar para rascunho</Btn>
                </>
              )}
              {row.status === "approved" && (
                <>
                  <Btn variant="primary" icon={<Globe className="size-4" />} onClick={() => setConfirm("publish")} disabled={readonly || !ready}>Publicar no site</Btn>
                  {!ready && <p className="text-xs text-[#f3cf8b]">Resolva os itens obrigatórios do checklist para publicar.</p>}
                  <Btn variant="ghost" icon={<Undo2 className="size-4" />} onClick={() => run("restore")} disabled={readonly}>Voltar para rascunho</Btn>
                </>
              )}
              {row.status === "published" && (
                <>
                  <a href={publicUrl} target="_blank" rel="noreferrer" className="cx-btn cx-btn-secondary"><Eye className="size-4" /> Ver no site <ExternalLink className="size-3.5" /></a>
                  <Btn variant="primary" icon={<Globe className="size-4" />} onClick={() => setConfirm("publish")} disabled={readonly || !ready}>Salvar e atualizar no site</Btn>
                  <Btn variant="ghost" icon={<XCircle className="size-4" />} onClick={() => setConfirm("unpublish")} disabled={readonly}>Despublicar</Btn>
                </>
              )}
              {row.status !== "archived" && row.status !== "published" && <Btn variant="ghost" icon={<Archive className="size-4" />} onClick={() => run("archive")} disabled={readonly}>Arquivar</Btn>}
              {row.status === "archived" && <Btn icon={<RotateCcw className="size-4" />} onClick={() => run("restore")} disabled={readonly}>Restaurar como rascunho</Btn>}
              {row.status !== "published" && <Btn variant="danger" icon={<Trash2 className="size-4" />} onClick={() => setConfirm("delete")} disabled={readonly}>Excluir</Btn>}
            </div>
            {row.published_at && <p className="mt-3 text-xs text-[#a0a0a0]">Publicado em {fmtDate(row.published_at)}</p>}
          </Card>

          <Card title="Checklist de SEO" action={<span className="text-xs text-[#a0a0a0]">{checks.filter((c) => c.ok).length}/{checks.length}</span>}>
            <ul className="space-y-2">
              {checks.map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-xs">
                  {c.ok ? <CheckCircle2 className="mt-px size-4 shrink-0 text-[#7fb2ff]" /> : c.level === "required" ? <XCircle className="mt-px size-4 shrink-0 text-[#f6a3af]" /> : <Circle className="mt-px size-4 shrink-0 text-[#6e6e76]" />}
                  <span>
                    <span className={c.ok ? "text-[#d6d6da]" : c.level === "required" ? "text-white" : "text-[#a0a0a0]"}>{c.label}</span>
                    {c.level === "required" && !c.ok && <span className="ml-1 text-[#f6a3af]">(obrigatório)</span>}
                    {c.hint && <span className="block text-[#6e6e76]">{c.hint}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Como aparece no Google">
            <div className="rounded-xl bg-white p-4 text-left">
              <p className="truncate text-xs text-[#202124]">grupov3x.com.br › blog › {draft.slug}</p>
              <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{draft.seo_title || draft.title}</p>
              <p className="mt-1 line-clamp-2 text-[13px] text-[#4d5156]">{draft.meta_description || "Sem meta descrição: o Google escolherá um trecho do texto."}</p>
            </div>
            <p className="mt-2 text-[11px] text-[#6e6e76]">Prévia aproximada. O Google pode reescrever título e descrição.</p>
          </Card>
        </aside>
      </div>

      <Confirm
        open={confirm === "publish"}
        title={row.status === "published" ? "Atualizar o artigo publicado?" : "Publicar no site da V3X?"}
        text={row.status === "published" ? "As alterações salvas ficam visíveis em grupov3x.com.br/blog em instantes." : `O artigo ficará público em grupov3x.com.br/blog/${draft.slug} e entrará no sitemap. Confirme que o texto foi revisado por uma pessoa.`}
        confirmLabel={row.status === "published" ? "Atualizar no site" : "Publicar"}
        loading={acting}
        onClose={() => setConfirm(null)}
        onConfirm={() => run("publish")}
      />
      <Confirm open={confirm === "unpublish"} title="Retirar do site?" text="O artigo deixa de aparecer no blog e no sitemap e volta para Aprovado. Links antigos passam a mostrar página não encontrada." confirmLabel="Despublicar" tone="danger" loading={acting} onClose={() => setConfirm(null)} onConfirm={() => run("unpublish")} />
      <Confirm
        open={confirm === "delete"}
        title="Excluir este artigo?"
        text="O rascunho e os metadados serão removidos definitivamente. Para guardar, prefira Arquivar."
        confirmLabel="Excluir"
        tone="danger"
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          try {
            await api(`/api/control/data/articles/${id}`, { method: "DELETE" });
            router.push("/control/blog");
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />
    </Page>
  );
}
