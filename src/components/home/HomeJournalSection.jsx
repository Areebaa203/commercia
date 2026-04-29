"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { JOURNAL_POSTS } from "@/components/home/homeJournalData";

const GREEN = "#2F3E33";
const GAP_PX = 18;

function scrollStepForContainer(el) {
  const first = el?.querySelector("li");
  if (!first) return el?.clientWidth * 0.35 ?? 0;
  const style = window.getComputedStyle(el);
  const gap = parseFloat(style.gap) || GAP_PX;
  return first.getBoundingClientRect().width + gap;
}

function ArticleCard({ post }) {
  return (
    <article className="group flex h-full w-full flex-col bg-[#FAF9F6]">
      <Link href={post.href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#e8e4de]">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, 290px"
          />
        </div>
      </Link>
      <div className="flex flex-col px-0.5 pb-5 pt-4 sm:px-0 sm:pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-home-sub text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 sm:text-[11px]">
          <span className="uppercase">{post.category}</span>
          <span className="flex items-center gap-1 text-neutral-500 normal-case tracking-normal">
            <Icon icon="mingcute:time-line" className="size-3.5" aria-hidden />
            {post.readMinutes} min read
          </span>
        </div>
        <Link href={post.href} className="block text-left">
          <h3 className="font-home-heading mt-2 text-base leading-snug text-[#24352D] transition group-hover:opacity-80 sm:text-lg md:text-xl">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-3 text-left text-sm leading-relaxed text-neutral-700">{post.excerpt}</p>
        <Link
          href={post.href}
          className="font-home-sub mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-neutral-300 bg-[#f7f3ec] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1f231f] transition hover:bg-[#ece7de] sm:mt-5 sm:w-fit"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}

export default function HomeJournalSection() {
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = scrollStepForContainer(el);
    if (step <= 0) return;
    const max = JOURNAL_POSTS.length - 1;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIdx(Math.min(max, Math.max(0, idx)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateActiveFromScroll();
    el.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    const ro = new ResizeObserver(updateActiveFromScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateActiveFromScroll);
      ro.disconnect();
    };
  }, [updateActiveFromScroll]);

  const scrollToCard = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = scrollStepForContainer(el);
    el.scrollTo({ left: i * step, behavior: "smooth" });
  };

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollStepForContainer(el) * dir, behavior: "smooth" });
  };

  return (
    <section className="border-t border-[#e8e4dc] bg-[#FAF9F6] py-7 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="text-left">
            <h2
              className="font-home-heading text-[1.75rem] leading-tight tracking-tight sm:text-3xl md:text-[2.25rem]"
              style={{ color: GREEN }}
            >
              From our journal
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-800 sm:text-base">
              Tips, inspiration, and expert advice for creating a home you love.
            </p>
          </div>
          <Link
            href="#"
            className="font-home-sub flex h-11 w-full shrink-0 items-center justify-center rounded-[4px] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:h-10 sm:w-auto sm:text-xs"
            style={{ backgroundColor: GREEN }}
          >
            View all articles
          </Link>
        </div>

        <div className="relative mt-6 sm:mt-10">
          <ul
            ref={scrollerRef}
            className="no-scrollbar flex list-none gap-[18px] overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
          >
            {JOURNAL_POSTS.map((post) => (
              <li
                key={post.id}
                className="w-[min(85vw,320px)] shrink-0 snap-start sm:w-[280px] lg:w-[290px]"
              >
                <ArticleCard post={post} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
          <div className="flex min-w-0 flex-1 items-center justify-start gap-2 sm:gap-2.5" role="tablist" aria-label="Journal articles">
            {JOURNAL_POSTS.map((post, i) => (
              <button
                key={post.id}
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Article ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className={cn(
                  "shrink-0 rounded-full transition-all duration-300",
                  i === activeIdx ? "h-[3px] w-9 bg-[#2F3E33] sm:w-10" : "h-[2px] w-6 bg-[#d8d2c7] hover:bg-[#c4beb3] sm:w-7"
                )}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Previous articles"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de] sm:h-10 sm:w-10"
            >
              <Icon icon="mingcute:left-line" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Next articles"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de] sm:h-10 sm:w-10"
            >
              <Icon icon="mingcute:right-line" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
