"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export function BlogTabs({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);
    return ["Todos", ...unique];
  }, [posts]);

  const [active, setActive] = useState("Todos");
  /* Progressive loading: 12 at a time (every article is also listed in the sitemap). */
  const [limit, setLimit] = useState(12);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const index = categories.indexOf(active);
    const el = tabRefs.current[index];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, categories]);

  const filtered = active === "Todos" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filtrar por categoria" className="relative flex flex-wrap gap-1 border-b border-border pb-px">
        {categories.map((cat, i) => (
          <button
            key={cat}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            onClick={() => {
              setActive(cat);
              setLimit(12);
            }}
            aria-pressed={active === cat}
            className={`relative px-4 py-3 text-sm transition-colors ${
              active === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
          style={{
            left: indicator.left,
            width: indicator.width,
            background: "var(--gradient-x)",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-muted-foreground">Nenhum artigo nessa categoria ainda.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, limit).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.02] p-7 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7fb2ff]">{post.category}</p>
              <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight">
                {post.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <p className="mt-auto flex items-center gap-2 pt-6 text-sm text-muted-foreground">
                {post.readingTime}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      )}
      {filtered.length > limit && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setLimit((l) => l + 12)} className="btn-outline">
            Carregar mais artigos ({filtered.length - limit})
          </button>
        </div>
      )}
    </div>
  );
}
