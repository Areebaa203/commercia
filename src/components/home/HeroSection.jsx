"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { SITE_HEADER_GUTTERS } from "@/components/home/SiteHeader";

const SLIDES = [
  {
    id: "1",
    src: "/background-img.jpg",
    position: "46% 82%",
    alt: "Modern living room with statement sofa and warm, natural light",
    badge: "Spring collection",
    title: "Create a space you'll never want to leave.",
    sub: "Furniture you'll actually want to come home to.",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80",
    position: "50% 52%",
    alt: "Warm minimalist interior with natural wood tones",
    badge: "New arrivals",
    title: "Pieces that feel like home from day one",
    sub: "Thoughtfully crafted styles for every room.",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=80",
    position: "50% 50%",
    alt: "Elegant living space with soft seating",
    badge: "Editor's picks",
    title: "Design-forward comfort, built to last",
    sub: "Elevate everyday living with lasting quality.",
  },
];

const AUTO_MS = 8000;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[index];

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const t = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(t);
  }, [go]);

  return (
    <section className="relative min-h-[min(88dvh,680px)] w-full overflow-hidden bg-neutral-900 sm:min-h-[min(100vh,900px)]">
      {SLIDES.map((s, i) => (
        <Image
          key={s.id}
          src={s.src}
          alt={s.alt}
          fill
          className={cn(
            "absolute inset-0 object-cover ease-out",
            i !== 0 && "transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{ objectPosition: s.position }}
          priority={i === 0}
          sizes="100vw"
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-[#0c1a14]/35 to-[#08140f]/85 sm:bg-gradient-to-r sm:from-[#0c1a14]/82 sm:via-[#0f241c]/42 sm:to-transparent md:via-[#0f241c]/28"
        aria-hidden
      />

      <div
        className={`${SITE_HEADER_GUTTERS} relative z-10 flex min-h-[min(88dvh,680px)] flex-col justify-end pb-20 pt-12 sm:min-h-[min(100vh,900px)] sm:pb-32 sm:pt-28 md:min-h-[min(92vh,820px)] md:pb-36 md:pt-32 lg:min-h-[min(100vh,900px)] lg:pb-32 lg:pt-20`}
      >
        <div className="max-w-[min(100%,24rem)] text-left sm:max-w-xl md:max-w-[min(100%,28rem)] lg:max-w-2xl">
          <div className="mb-3 inline-block rounded-md bg-[#c45c3a] px-3 py-2 font-home-sub text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm sm:mb-4 sm:px-4 sm:text-[11px] sm:tracking-[0.22em]">
            {slide.badge}
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-white sm:mb-6 sm:gap-2.5">
            <span className="flex shrink-0 text-white" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} icon="mingcute:star-fill" className="size-4 sm:size-[1.125rem]" />
              ))}
            </span>
            <span className="font-home-body text-[11px] font-light tracking-wide text-white/95 sm:text-sm">
              1M+ satisfied customers
            </span>
          </div>

          <h1 className="font-home-heading text-[1.625rem] font-normal leading-[1.15] tracking-[-0.02em] text-white sm:text-[2.5rem] sm:leading-[1.12] md:text-[2.75rem] md:leading-[1.1] lg:text-[3.35rem]">
            {slide.title}
          </h1>

          <p className="mt-4 max-w-md font-home-body text-[13px] font-light leading-relaxed text-white/95 sm:mt-5 sm:text-base lg:text-[1.0625rem]">
            {slide.sub}
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/shop-all"
              className="font-home-sub flex h-12 w-full items-center justify-center rounded-full bg-[#f7f6f2] px-6 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#142018] shadow-sm transition hover:bg-[#fefcf7] sm:h-[3rem] sm:min-w-[11.5rem] sm:w-auto sm:px-7 sm:text-[11px]"
            >
              Explore collection
            </Link>
            <Link
              href="/shop-all"
              className="font-home-sub flex h-12 w-full items-center justify-center rounded-full border border-white/25 bg-[#1a3021] px-6 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f7f6f2] shadow-sm transition hover:bg-[#142418] sm:h-[3rem] sm:min-w-[11.5rem] sm:w-auto sm:border-white/30 sm:bg-[#152e24]/65 sm:px-7 sm:text-[11px] sm:backdrop-blur-md sm:hover:bg-[#152e24]/80"
            >
              Shop furniture
            </Link>
          </div>
        </div>
      </div>

      {/* Three segment pagination (all breakpoints) */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 px-4 sm:bottom-6">
        <div
          className="pointer-events-auto flex items-end justify-center gap-2.5 sm:gap-3"
          role="tablist"
          aria-label="Hero slides"
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "shrink-0 rounded-full transition-all duration-300",
                i === index
                  ? "h-[3px] w-10 bg-white sm:w-12 md:w-16"
                  : "h-[2px] w-6 bg-white/35 hover:bg-white/55 sm:w-8"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
