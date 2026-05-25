"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Eye, Search } from "lucide-react";

// Number of (frequency-ordered) tags shown before the list collapses.
const VISIBLE_TAGS = 12;

export interface PostRow {
  title: string;
  href: string;
  isExternal: boolean;
  publishedAt: string;
  year: number;
  tags: string[];
  views: number | null;
  source: string | null;
}

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

const chip = (active: boolean): string =>
  [
    "rounded-md px-2.5 py-1 text-xs transition-colors",
    active
      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/70 dark:text-neutral-400 dark:hover:bg-neutral-700",
  ].join(" ");

export default function BlogArchive({
  posts,
  tags,
  initialTag,
}: {
  posts: PostRow[];
  tags: string[];
  initialTag?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);
  const [showAllTags, setShowAllTags] = useState(false);

  // Filter purely on the client for instant feedback. The address bar is kept in
  // sync without a server round-trip so a tag view stays shareable.
  const selectTag = (tag: string | null) => {
    setActiveTag(tag);
    if (typeof window !== "undefined") {
      const url = tag ? `/blog?tag=${encodeURIComponent(tag)}` : "/blog";
      window.history.replaceState(null, "", url);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  const byYear = useMemo(() => {
    const map = new Map<number, PostRow[]>();
    for (const post of filtered) {
      const bucket = map.get(post.year) ?? [];
      bucket.push(post);
      map.set(post.year, bucket);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  // Collapse the (frequency-ordered) tag list, but never hide the active tag.
  const baseVisibleTags = showAllTags ? tags : tags.slice(0, VISIBLE_TAGS);
  const visibleTags =
    !showAllTags && activeTag && !baseVisibleTags.includes(activeTag)
      ? [...baseVisibleTags, activeTag]
      : baseVisibleTags;

  return (
    <section className="max-w-3xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">read my blog</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            {activeTag ? ` tagged #${activeTag}` : ""}
          </p>
        </div>

        <label className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-neutral-400"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="filter posts…"
            aria-label="Filter posts"
            className="w-full rounded-lg border border-neutral-200 bg-transparent py-1.5 pl-8 pr-3 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:text-neutral-200 dark:focus:border-neutral-600 sm:w-60"
          />
        </label>
      </header>

      <div className="mb-8 flex flex-wrap gap-1.5">
        <button onClick={() => selectTag(null)} className={chip(!activeTag)}>
          all
        </button>
        {visibleTags.map((tag) => (
          <button
            key={tag}
            onClick={() => selectTag(activeTag === tag ? null : tag)}
            className={chip(activeTag === tag)}
          >
            {tag}
          </button>
        ))}
        {tags.length > VISIBLE_TAGS && (
          <button
            onClick={() => setShowAllTags((value) => !value)}
            aria-expanded={showAllTags}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200"
          >
            {showAllTags ? "show less" : `+${tags.length - VISIBLE_TAGS} more`}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                showAllTags ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>
        )}
      </div>

      {byYear.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">
          No posts match{" "}
          <span className="text-neutral-800 dark:text-neutral-200">
            “{query}”
          </span>
          .
        </p>
      ) : (
        <div className="space-y-10">
          {byYear.map(([year, yearPosts]) => (
            <div key={year}>
              <div className="sticky top-0 z-10 -mx-2 mb-1 bg-white/80 px-2 py-2 backdrop-blur dark:bg-[#111010]/80">
                <h2 className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  {year}
                  <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  <span className="tabular-nums">{yearPosts.length}</span>
                </h2>
              </div>

              <ul>
                {yearPosts.map((post) => (
                  <li key={post.href}>
                    <PostRowLink post={post} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PostRowLink({ post }: { post: PostRow }) {
  const content = (
    <div className="group relative flex items-baseline gap-4 rounded-lg py-3 pl-4 pr-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
      <span
        aria-hidden
        className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-[#47a3f3] transition-all duration-200 group-hover:h-6"
      />

      <time className="hidden w-16 shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500 sm:block">
        {formatDate(post.publishedAt)}
      </time>

      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-medium text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-neutral-100 dark:group-hover:text-white">
            {post.title}
          </span>
          {post.isExternal && (
            <ExternalLink
              className="h-3.5 w-3.5 shrink-0 text-neutral-400"
              aria-hidden
            />
          )}
        </span>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="tabular-nums sm:hidden">
            {formatDate(post.publishedAt)}
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-500 dark:bg-neutral-800/70 dark:text-neutral-400"
            >
              #{tag}
            </span>
          ))}
          {post.source && <span>{post.source}</span>}
        </div>
      </div>

      {!post.isExternal && (
        <span className="flex shrink-0 items-center gap-1 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
          <Eye className="h-3 w-3" aria-hidden />
          {(post.views ?? 0).toLocaleString()}
        </span>
      )}
    </div>
  );

  return post.isExternal ? (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {content}
    </a>
  ) : (
    <Link href={post.href} className="block">
      {content}
    </Link>
  );
}
