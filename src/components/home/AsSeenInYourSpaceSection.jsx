"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const BG = "#FDFBF4";
const FOREST = "#24352D";

const REVIEWS = [
  {
    id: "adam",
    image: "/Review-img1.jpg",
    title: "My new favorite spot",
    name: "Adam G.",
  },
  {
    id: "kelly",
    image: "/Review-img-2.jpg",
    title: "Best purchase this year",
    name: "Kelly W.",
  },
  {
    id: "olivia",
    image: "/Review-img-3.jpg",
    title: "Perfect accent piece",
    name: "Olivia T.",
  },
];

function ReviewCard({ item, variant = "grid" }) {
  const carousel = variant === "carousel";
  return (
    <article
      className={cn(
        "text-left",
        carousel && "w-[min(78vw,18rem)] shrink-0 sm:w-[min(240px,40vw)]"
      )}
    >
      <Link
        href="/shop-all"
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#e5e0d8] lg:aspect-[4/5] lg:rounded-sm"
      >
        <Image
          src={item.image}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 78vw, 280px"
        />
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/15"
          aria-hidden
        />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-white/10 backdrop-blur-[1px] sm:h-14 sm:w-14">
          <Icon
            icon="mingcute:play-fill"
            className="ml-0.5 size-6 text-white drop-shadow sm:size-7"
            aria-hidden
          />
        </span>
        <span className="sr-only">Play video: {item.title}</span>
      </Link>
      <h3 className="font-home-body mt-3 text-[0.95rem] font-bold leading-snug text-[#1f2a24] lg:font-home-heading lg:font-semibold">
        {item.title}
      </h3>
      <p className="font-home-body mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 sm:text-xs">
        {item.name.toUpperCase()}
      </p>
    </article>
  );
}

export default function AsSeenInYourSpaceSection() {
  const stripRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)));
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    const ro = new ResizeObserver(updateProgress);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      ro.disconnect();
    };
  }, [updateProgress]);

  const scrollByDir = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.75, 260),
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile-first: stacked intro */}
        <div className="max-w-lg md:max-w-md lg:max-w-xl">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[#24352D]">
            <span className="flex text-amber-500" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} icon="mingcute:star-fill" className="size-4" />
              ))}
            </span>
            <span className="font-home-body text-xs font-normal tracking-wide text-[#363d3b] sm:text-sm">
              1M+ satisfied customers
            </span>
          </div>

          <h2
            className="font-home-heading text-[1.875rem] font-normal leading-[1.08] tracking-tight sm:text-3xl md:text-[2.25rem]"
            style={{ color: FOREST }}
          >
            As seen in your space
          </h2>
          <p className="mt-3 font-home-body text-sm leading-relaxed text-[#363d3b] sm:text-base md:leading-relaxed">
            See how our customers bring Furniqo pieces into their homes
          </p>
          <Link
            href="/shop-all"
            className="font-home-sub mt-5 inline-flex w-full max-w-sm items-center justify-center rounded-[6px] bg-[#24352D] px-7 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#1a2822] sm:mt-6 sm:w-auto sm:text-[11px]"
          >
            Shop best sellers
          </Link>
        </div>

        {/* Carousel */}
        <div className="mt-10 md:hidden">
          <ul
            ref={stripRef}
            className="no-scrollbar flex list-none gap-4 overflow-x-auto scroll-smooth pb-2 scroll-pl-1 scroll-pr-4 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
          >
            {REVIEWS.map((item) => (
              <li key={item.id} className="snap-start">
                <ReviewCard item={item} variant="carousel" />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative h-[2px] min-w-0 flex-1 rounded-full bg-neutral-300/70">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#24352D] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollByDir(-1)}
                aria-label="Previous story"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d9d5cd] bg-[#faf7f3] text-[#3d4540] transition hover:bg-[#f0eae3]"
              >
                <Icon icon="mingcute:left-line" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDir(1)}
                aria-label="Next story"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d9d5cd] bg-[#faf7f3] text-[#3d4540] transition hover:bg-[#f0eae3]"
              >
                <Icon icon="mingcute:right-line" className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* md+: grid */}
        <ul className="mt-12 hidden list-none gap-8 md:grid md:grid-cols-3 md:gap-6 md:gap-y-10 lg:mt-14 lg:gap-x-8">
            {REVIEWS.map((item) => (
              <li key={`${item.id}-grid`} className="min-w-0">
                <ReviewCard item={item} variant="grid" />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
