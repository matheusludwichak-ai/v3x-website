"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpRight, FileText, Globe, PenLine, Search, Sparkles } from "lucide-react";
import { Badge, Btn, Empty, ErrorBox, ModeBanner, Page, PageHeader, Skeleton, Tabs, TextInput, useDebounced } from "./ui";
import { api, fmtDate, relative, useCollection, useSession } from "./lib/client";
import { ARTICLE_STATUS_LABEL, ARTICLE_STATUS_TONE, label } from "./lib/labels";
import { slugify } from "@/lib/control/schema";

type Filter = "all" | "draft" | "review" | "published" | "archived" | "ai" | "recent";
type SitePost = { slug: string; title: string; date: string; category: string; source: "mdx" | "control" };

export function BlogList() {
  const session = useSession();
  const articles = useCollection("articles");
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [site, setSite] = useState<SitePost[]>([]);
  const [creating, setCreating] = useState(false);
  const q = useDebounced(query).trim().toLowerCase();

  useEffect(() => {
    api<{ data: SitePost[] }>("/api/control/site-posts").then((r) => setSite(r.data)).catch(() => setSite([]));
  }, []);

  const [weekAgo] = useState(() => Date.now() - 7 * 86400000);
  const counts = {
    all: articles.rows.length,
    draft: articles.rows.filter((a) => a.status === "draft").length,
    review: articles.rows.filter((a) => a.status === "review" || a.status === "approved").length,
    published: articles.rows.filter((a) => a.status === "published").length,
    archived: articles.rows.filter((a) => a.status === "archived").length,
    ai: articles.rows.filter((a) => a.ai_generated).length,
    recent: articles.rows.filter((a) => new Date(a.updated_at).getTime() > weekAgo).length,
  };

  const list = useMemo(
    () =>
      articles.rows
        .filter((a) => {
          if (filter === "draft") return a.status === "draft";
          if (filter === "review") return a.status === "review" || a.status === "approved";
          if (filter === "published") return a.status === "published";
          if (filter === "archived") return a.status === "archived";
          if (filter === "ai") return a.ai_generated;
          if (filter === "recent") return new Date(a.updated_at).getTime() > weekAgo;
          return a.status !== "archived";
        })
        .filter((a) => !q || `${a.title} ${a.primary_keyword ?? ""} ${a.slug}`.toLowerCase().includes(q))
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [articles.rows, filter, q, weekAgo],
  );

  const blank = async () => {
    setCreating(true);
    try {
      const stamp = Date.now().toString(36);
      const row = await articles.create({ title: "Novo artigo", slug: slugify(`novo-artigo-${stamp}`), status: "draft", content_md: "" });
      router.push(`/control/blog/${row.id}`);
    } catch (e) {
      toast.error((e as Error).message);
      setCreating(false);
    }
  };

  const mdxOnly = site.filter((p) => p.source === "mdx");

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Conteúdo"
        title="Blog"
        description="Pautas, rascunhos, revisão e publicação no blog da V3X. Nada gerado pela IA vai ao ar sem revisão humana e confirmação."
        actions={
          <>
            <Btn icon={<PenLine className="size-4" />} onClick={blank} loading={creating} disabled={articles.readonly}>
              Artigo em branco
            </Btn>
            <Link href="/control/blog/novo" className="cx-btn cx-btn-primary">
              <Sparkles className="size-4" /> Criar artigo com IA
            </Link>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "Todos", count: counts.all - counts.archived },
            { value: "draft", label: "Rascunhos", count: counts.draft },
            { value: "review", label: "Em revisão", count: counts.review },
            { value: "published", label: "Publicados", count: counts.published },
            { value: "archived", label: "Arquivados", count: counts.archived },
            { value: "ai", label: "Criados com IA", count: counts.ai },
            { value: "recent", label: "Atualizados recentemente", count: counts.recent },
          ]}
        />
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e76]" />
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar título ou palavra-chave" className="pl-9" aria-label="Buscar artigos" />
        </div>
      </div>

      {articles.error && <ErrorBox message={articles.error} onRetry={articles.reload} />}
      {articles.loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="cx-card"><Skeleton rows={4} /></div>)}</div>
      ) : list.length === 0 ? (
        <Empty
          icon={<FileText className="size-5" />}
          title={articles.rows.length ? "Nenhum artigo neste filtro" : "Comece pelo primeiro artigo"}
          text="A IA sugere pautas ligadas aos serviços da V3X, monta a estrutura de SEO e escreve um rascunho para você revisar."
          action={<Link href="/control/blog/novo" className="cx-btn cx-btn-ai"><Sparkles className="size-4" /> Criar artigo com IA</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => (
            <Link key={a.id} href={`/control/blog/${a.id}`} className="cx-card group flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={ARTICLE_STATUS_TONE[a.status]} dot>{label(ARTICLE_STATUS_LABEL, a.status)}</Badge>
                {a.ai_generated && <Badge tone="violet">IA</Badge>}
              </div>
              <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-snug">{a.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#a0a0a0]">{a.meta_description || a.excerpt || "Sem descrição ainda."}</p>
              <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-white/5 pt-3 text-xs">
                <div><dt className="text-[#6e6e76]">Palavra-chave</dt><dd className="mt-0.5 truncate text-[#d6d6da]">{a.primary_keyword || "—"}</dd></div>
                <div><dt className="text-[#6e6e76]">{a.status === "published" ? "Publicado" : "Atualizado"}</dt><dd className="mt-0.5 text-[#d6d6da]">{a.status === "published" ? fmtDate(a.published_at) : relative(a.updated_at)}</dd></div>
              </dl>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#9cc2ff] opacity-80 group-hover:opacity-100">Continuar editando <ArrowUpRight className="size-3.5" /></span>
            </Link>
          ))}
        </div>
      )}

      {mdxOnly.length > 0 && (filter === "all" || filter === "published") && (
        <section className="mt-10">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold"><Globe className="size-4 text-[#9cc2ff]" /> Já publicados no site (arquivos do repositório)</h2>
          <p className="mb-4 text-xs text-[#a0a0a0]">Estes {mdxOnly.length} artigos vivem em content/blog e são editados no código. Os slugs deles ficam reservados.</p>
          <div className="grid gap-2 md:grid-cols-2">
            {mdxOnly.map((p) => (
              <a key={p.slug} href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-white/6 px-4 py-3 text-sm transition-colors hover:border-white/15">
                <span className="truncate">{p.title}</span>
                <span className="shrink-0 text-xs text-[#a0a0a0]">{fmtDate(p.date)}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
