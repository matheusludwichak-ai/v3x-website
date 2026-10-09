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
      <div className="relative flex flex-wrap gap-2 border-b border-neutral-200 pb-px">
        {categories.map((cat, i) => (
          <button
            key={cat}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`eyebrow relative px-4 py-3 transition-colors ${
              active === cat ? "text-ink" : "text-neutral-400 hover:text-neutral-800"
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
            background: "var(--gradient-signature)",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-neutral-600">Nenhum artigo nessa categoria ainda.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border-t border-neutral-200 pt-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="eyebrow text-neutral-600">{post.category}</p>
              <h2 className="mt-4 text-xl font-semibold leading-snug text-ink group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{post.excerpt}</p>
              <p className="numbering mt-5 flex items-center gap-2 text-neutral-400">
                {post.readingTime}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
