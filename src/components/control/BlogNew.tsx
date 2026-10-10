"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, Info, Lightbulb, Zap } from "lucide-react";
import { AIBtn, Badge, Btn, Card, ErrorBox, Field, ModeBanner, Page, PageHeader, Select, TextArea, TextInput, optionsOf } from "./ui";
import { ai, api, ApiError, useSession } from "./lib/client";
import { AWARENESS_LABEL, INTENT_LABEL, label } from "./lib/labels";
import { slugify } from "@/lib/control/schema";
import { cn } from "@/lib/utils";

type Topic = {
  title: string;
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: keyof typeof INTENT_LABEL;
  audience: string;
  awareness_stage: keyof typeof AWARENESS_LABEL;
  related_service: string;
  angle: string;
  questions: string[];
  internal_links: { label: string; url: string }[];
};

type Generated = {
  title: string;
  seo_title: string;
  slug: string;
  meta_description: string;
  excerpt: string;
  content_md: string;
  faq: { q: string; a: string }[];
  internal_links: { label: string; url: string }[];
  tags: string[];
  category: string;
  cover_suggestion: string;
  cover_alt: string;
  cta: string;
  review_flags: string[];
};

const SERVICES = ["Web Design e Desenvolvimento", "Motion Design", "Software e Sistemas", "Produtos Digitais", "Automação de processos", "IA aplicada a empresas"];
const STEPS = ["Tema", "Pauta", "Ajustes", "Geração"];

export function BlogNew() {
  const session = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"suggest" | "quick">("suggest");
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("");
  const [service, setService] = useState("");
  const [audience, setAudience] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [chosen, setChosen] = useState<Topic | null>(null);
  const [length, setLength] = useState<"short" | "standard" | "long">("standard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    api<{ data: { title: string }[] }>("/api/control/site-posts").then((r) => setExisting(r.data.map((p) => p.title))).catch(() => undefined);
  }, []);

  const suggest = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await ai<{ topics: Topic[] }>({ action: "blog.topics", theme: theme || undefined, service: service || undefined, audience: audience || undefined, count: 6, existingTitles: existing });
      setTopics(res.topics);
      setStep(1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const quickStart = () => {
    if (theme.trim().length < 5) return setError("Escreva o tema ou título do artigo (pelo menos 5 caracteres).");
    setError(null);
    setChosen({ title: theme.trim(), primary_keyword: "", secondary_keywords: [], search_intent: "informational", audience: audience || "Gestores e donos de pequenas e médias empresas", awareness_stage: "problem", related_service: service, angle: "", questions: [], internal_links: [] });
    setStep(2);
  };

  const generate = async () => {
    if (!chosen) return;
    setBusy(true);
    setError(null);
    setStep(3);
    try {
      const res = await ai<{ article: Generated; model: string }>({
        action: "blog.article",
        title: chosen.title,
        primary_keyword: chosen.primary_keyword || undefined,
        secondary_keywords: chosen.secondary_keywords.length ? chosen.secondary_keywords : undefined,
        search_intent: chosen.search_intent,
        audience: chosen.audience || undefined,
        awareness_stage: chosen.awareness_stage,
        related_service: chosen.related_service || undefined,
        angle: chosen.angle || undefined,
        questions: chosen.questions.length ? chosen.questions : undefined,
        length,
      });
      const g = res.article;
      const base = slugify(g.slug || g.title) || slugify(chosen.title);
      const payload = {
        title: g.title,
        seo_title: g.seo_title.slice(0, 70),
        meta_description: g.meta_description.slice(0, 170),
        excerpt: g.excerpt.slice(0, 400),
        content_md: g.content_md,
        status: "draft",
        category: g.category.slice(0, 60),
        tags: g.tags.slice(0, 12),
        primary_keyword: chosen.primary_keyword || null,
        secondary_keywords: chosen.secondary_keywords,
        search_intent: chosen.search_intent,
        audience: chosen.audience,
        awareness_stage: chosen.awareness_stage,
        related_service: chosen.related_service || null,
        internal_links: g.internal_links,
        faq: g.faq,
        cover_suggestion: g.cover_suggestion,
        cover_alt: g.cover_alt,
        cta: g.cta,
        review_notes: g.review_flags.length ? `Pontos para verificar antes de publicar:\n- ${g.review_flags.join("\n- ")}` : null,
        ai_generated: true,
        ai_model: res.model,
      };
      let created: { data: { id: string } } | null = null;
      for (const candidate of [base, `${base}-${Date.now().toString(36).slice(-4)}`]) {
        try {
          created = await api<{ data: { id: string } }>("/api/control/data/articles", { method: "POST", body: JSON.stringify({ ...payload, slug: candidate }) });
          break;
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 409)) throw e;
        }
      }
      if (!created) throw new Error("Não foi possível salvar o rascunho.");
      toast.success("Rascunho criado", { description: "Revise o texto e o checklist de SEO antes de enviar para revisão." });
      router.push(`/control/blog/${created.data.id}`);
    } catch (e) {
      setError((e as Error).message);
      setStep(2);
    } finally {
      setBusy(false);
    }
  };

  const edit = (patch: Partial<Topic>) => setChosen((c) => (c ? { ...c, ...patch } : c));

  return (
    <Page className="max-w-[1100px]">
      <ModeBanner session={session} />
      <Link href="/control/blog" className="mb-4 inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white">
        <ArrowLeft className="size-4" /> Blog
      </Link>
      <PageHeader eyebrow="Blog" title="Criar artigo com IA" description="Escolha um tema, revise a pauta e as palavras-chave, e a IA escreve um rascunho completo para você editar." />

      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Etapas">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium", i === step ? "border-[rgb(56_130_246/50%)] bg-[rgb(56_130_246/12%)] text-white" : i < step ? "border-white/10 text-[#9cc2ff]" : "border-white/8 text-[#6e6e76]")}>
            {i < step ? <Check className="size-3.5" /> : <span>{i + 1}</span>} {s}
          </li>
        ))}
      </ol>

      {session && !session.ai.configured && (
        <div className="cx-banner cx-banner-warning mb-6">
          <strong>IA não configurada.</strong> Defina <code>GEMINI_API_KEY</code> no servidor para gerar pautas e artigos. Enquanto isso, use <Link href="/control/blog">Artigo em branco</Link>.
        </div>
      )}
      {error && <div className="mb-5"><ErrorBox message={error} /></div>}

      {step === 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <button onClick={() => setMode("suggest")} className={cn("cx-card text-left", mode === "suggest" && "!border-[rgb(56_130_246/55%)]")}>
            <Lightbulb className="size-5 text-[#9cc2ff]" />
            <p className="mt-3 font-semibold">Sugerir pautas</p>
            <p className="mt-1 text-sm text-[#a0a0a0]">A IA propõe temas ligados aos serviços da V3X, com palavra-chave, intenção de busca e perguntas do leitor.</p>
          </button>
          <button onClick={() => setMode("quick")} className={cn("cx-card text-left", mode === "quick" && "!border-[rgb(56_130_246/55%)]")}>
            <Zap className="size-5 text-[#c9b2f3]" />
            <p className="mt-3 font-semibold">Geração rápida</p>
            <p className="mt-1 text-sm text-[#a0a0a0]">Você já sabe o tema: informe o título e siga direto para os ajustes.</p>
          </button>
          <Card className="md:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label={mode === "quick" ? "Tema ou título do artigo *" : "Tema (opcional)"} className="md:col-span-3">
                <TextInput value={theme} onChange={(e) => setTheme(e.target.value)} placeholder={mode === "quick" ? "Ex.: quanto custa manter um site institucional" : "Ex.: automação de atendimento para clínicas"} />
              </Field>
              <Field label="Serviço relacionado">
                <Select value={service} onChange={(e) => setService(e.target.value)} options={SERVICES.map((s) => ({ value: s, label: s }))} placeholder="Qualquer serviço" />
              </Field>
              <Field label="Público-alvo" className="md:col-span-2">
                <TextInput value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex.: donos de pequenas empresas de serviços" />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              {mode === "suggest" ? <AIBtn session={session} loading={busy} onClick={suggest}>Sugerir pautas</AIBtn> : <Btn variant="primary" onClick={quickStart}>Continuar</Btn>}
            </div>
          </Card>
        </div>
      )}

      {step === 1 && (
        <>
          <p className="mb-4 flex items-start gap-2 text-sm text-[#a0a0a0]">
            <Info className="mt-0.5 size-4 shrink-0" /> Pautas sugeridas pela IA, sem validação de volume de busca ou concorrência. Use uma ferramenta de pesquisa (ex.: Search Console) para confirmar as palavras-chave mais importantes.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((t) => (
              <button key={t.title} className="cx-card text-left" onClick={() => { setChosen(t); setStep(2); }}>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="blue">{label(INTENT_LABEL, t.search_intent)}</Badge>
                  <Badge tone="neutral">{label(AWARENESS_LABEL, t.awareness_stage)}</Badge>
                  <Badge tone="violet">{t.related_service}</Badge>
                </div>
                <p className="mt-3 font-semibold leading-snug">{t.title}</p>
                <p className="mt-2 text-sm text-[#a0a0a0]">{t.angle}</p>
                <p className="mt-3 text-xs"><span className="text-[#6e6e76]">Palavra-chave:</span> <span className="text-[#d6d6da]">{t.primary_keyword}</span></p>
                {t.secondary_keywords.length > 0 && <p className="mt-1 text-xs text-[#a0a0a0]">{t.secondary_keywords.join(" · ")}</p>}
                <p className="mt-3 text-xs text-[#6e6e76]">Público: {t.audience}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Btn variant="ghost" onClick={() => setStep(0)}>Voltar</Btn>
            <AIBtn session={session} loading={busy} onClick={suggest}>Sugerir outras</AIBtn>
          </div>
        </>
      )}

      {step >= 2 && chosen && (
        <Card title="Ajuste a pauta antes de gerar" action={<SourceNote />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título da pauta" className="md:col-span-2"><TextInput value={chosen.title} onChange={(e) => edit({ title: e.target.value })} disabled={busy} /></Field>
            <Field label="Palavra-chave principal" hint="Informe manualmente se já tiver pesquisado."><TextInput value={chosen.primary_keyword} onChange={(e) => edit({ primary_keyword: e.target.value })} disabled={busy} /></Field>
            <Field label="Palavras-chave secundárias" hint="Separe por vírgulas."><TextInput value={chosen.secondary_keywords.join(", ")} onChange={(e) => edit({ secondary_keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} disabled={busy} /></Field>
            <Field label="Intenção de busca"><Select value={chosen.search_intent} onChange={(e) => edit({ search_intent: e.target.value as Topic["search_intent"] })} options={optionsOf(INTENT_LABEL)} disabled={busy} /></Field>
            <Field label="Estágio de consciência do leitor"><Select value={chosen.awareness_stage} onChange={(e) => edit({ awareness_stage: e.target.value as Topic["awareness_stage"] })} options={optionsOf(AWARENESS_LABEL)} disabled={busy} /></Field>
            <Field label="Público-alvo"><TextInput value={chosen.audience} onChange={(e) => edit({ audience: e.target.value })} disabled={busy} /></Field>
            <Field label="Serviço da V3X relacionado"><Select value={chosen.related_service} onChange={(e) => edit({ related_service: e.target.value })} options={[...new Set([...SERVICES, chosen.related_service].filter(Boolean))].map((s) => ({ value: s, label: s }))} placeholder="A IA escolhe" disabled={busy} /></Field>
            <Field label="Ângulo e abordagem" className="md:col-span-2"><TextArea value={chosen.angle} onChange={(e) => edit({ angle: e.target.value })} placeholder="O que o artigo precisa resolver para o leitor" disabled={busy} className="!min-h-[4rem]" /></Field>
            <Field label="Perguntas frequentes do leitor" hint="Uma por linha." className="md:col-span-2"><TextArea value={chosen.questions.join("\n")} onChange={(e) => edit({ questions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} disabled={busy} className="!min-h-[4rem]" /></Field>
            <Field label="Tamanho"><Select value={length} onChange={(e) => setLength(e.target.value as typeof length)} options={[{ value: "short", label: "Curto (800 a 1.000 palavras)" }, { value: "standard", label: "Padrão (1.200 a 1.600)" }, { value: "long", label: "Aprofundado (1.800 a 2.300)" }]} disabled={busy} /></Field>
            {chosen.internal_links.length > 0 && (
              <div className="md:col-span-2">
                <span className="cx-label">Links internos sugeridos</span>
                <div className="mt-2 flex flex-wrap gap-2">{chosen.internal_links.map((l) => <Badge key={l.url} tone="neutral">{l.label} · {l.url}</Badge>)}</div>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#a0a0a0]">{busy ? "Escrevendo o rascunho. Isso pode levar até um minuto." : `Slug provável: /blog/${slugify(chosen.title)}`}</p>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setStep(topics.length ? 1 : 0)} disabled={busy}>Voltar</Btn>
              <AIBtn session={session} loading={busy} onClick={generate}>Gerar artigo</AIBtn>
            </div>
          </div>
        </Card>
      )}
    </Page>
  );
}

function SourceNote() {
  return <Badge tone="violet">Sugestão da IA · revise</Badge>;
}
