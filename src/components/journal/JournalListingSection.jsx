"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  JOURNAL_FILTER_CATEGORIES,
  JOURNAL_LISTING_POSTS,
  JOURNAL_POSTS_PER_PAGE,
} from "@/components/journal/journalListingData";

function getPaginationItems(totalPages, currentPage) {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

function ListingCard({ post }) {
  const href = `/journal/${post.slug}`;
  return (
    <article className="flex flex-col">
      <Link href={href} className="group block overflow-hidden rounded-sm bg-[#e8e4de]">
        <div className="relative aspect-[16/10] w-full sm:aspect-[5/3]">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex flex-col pt-4 sm:pt-5">
        <div className="flex items-center justify-between gap-3 font-home-sub text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 sm:text-[11px]">
          <span>{post.categoryLabel}</span>
          <span className="flex shrink-0 items-center gap-1 normal-case tracking-normal text-neutral-500">
            <Icon icon="mingcute:time-line" className="size-3.5" aria-hidden />
            {post.readMinutes} min read
          </span>
        </div>
        <Link href={href} className="mt-2 block text-left">
          <h2 className="font-home-heading text-lg leading-snug text-[#1a3021] transition hover:opacity-85 sm:text-xl lg:text-[1.35rem] lg:leading-snug">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-3 text-left text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {post.excerpt}
        </p>
        <Link
          href={href}
          className="font-home-sub mx-auto mt-5 inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-md bg-[#f2eee8] px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a3021] transition hover:bg-[#e8e4dc] sm:mx-0 sm:mt-6 sm:h-11 sm:w-fit sm:max-w-none sm:px-8"
        >
          READ ARTICLE
        </Link>
      </div>
    </article>
  );
}

export default function JournalListingSection() {
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOURNAL_LISTING_POSTS.filter((post) => {
      const catOk = categoryId === "all" || post.categoryId === categoryId;
      if (!catOk) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [categoryId, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOURNAL_POSTS_PER_PAGE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * JOURNAL_POSTS_PER_PAGE;
    return filtered.slice(start, start + JOURNAL_POSTS_PER_PAGE);
  }, [filtered, safePage]);

  const paginationItems = useMemo(() => getPaginationItems(totalPages, safePage), [totalPages, safePage]);

  const setCategory = (id) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <section className="border-t border-[#e8e4dc] bg-[#faf9f6] pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Toolbar: categories + search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0 lg:flex-1">
            <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:gap-x-2 sm:gap-y-2 sm:overflow-visible sm:pb-0">
              {JOURNAL_FILTER_CATEGORIES.map((cat) => {
                const active = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-home-body text-[13px] font-medium transition sm:px-4 sm:text-sm",
                      active
                        ? "bg-[#e8e4dc] text-[#1a3021]"
                        : "text-neutral-600 hover:bg-black/[0.03] hover:text-[#1a3021]"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="relative block shrink-0 lg:w-[min(100%,220px)]">
            <span className="sr-only">Search articles</span>
            <Icon
              icon="mingcute:search-line"
              className="pointer-events-none absolute bottom-2 left-0 size-5 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              className="font-home-body w-full border-0 border-b border-neutral-400 bg-transparent py-2 pl-8 text-sm text-[#1a3021] outline-none placeholder:text-neutral-400 focus:border-[#1a3021]"
            />
          </label>
        </div>

        {/* Grid */}
        {pageSlice.length === 0 ? (
          <p className="mt-14 text-center font-home-body text-sm text-neutral-600">
            No articles match your filters. Try another category or search term.
          </p>
        ) : (
          <ul className="mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16 lg:mt-14 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
            {pageSlice.map((post) => (
              <li key={post.slug}>
                <ListingCard post={post} />
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 ? (
          <nav
            className="mt-16 flex flex-wrap items-center justify-center gap-2 sm:mt-20 sm:gap-4"
            aria-label="Pagination"
          >
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="group inline-flex size-10 items-center justify-center text-[#1a3021] transition hover:opacity-70 disabled:pointer-events-none disabled:opacity-25"
            >
              <Icon icon="mingcute:left-line" className="size-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {paginationItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-1 font-home-body text-sm text-neutral-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    aria-current={item === safePage ? "page" : undefined}
                    className={cn(
                      "flex size-10 items-center justify-center font-home-body text-[13px] tabular-nums transition sm:text-sm",
                      item === safePage
                        ? "rounded-xl border border-[#dcdad2] bg-[#f7f4ef] font-bold text-[#1a3021] shadow-sm"
                        : "text-neutral-500 hover:text-[#1a3021]"
                    )}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="group inline-flex size-10 items-center justify-center text-[#1a3021] transition hover:opacity-70 disabled:pointer-events-none disabled:opacity-25"
            >
              <Icon icon="mingcute:right-line" className="size-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
