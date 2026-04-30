"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_HEADER_GUTTERS } from "@/components/home/SiteHeader";
import { JOURNAL_HERO_SLIDES } from "@/components/journal/journalHeroData";

const AUTO_MS = 9000;

export default function JournalHero() {
  const [index, setIndex] = useState(0);
  const total = JOURNAL_HERO_SLIDES.length;
  const slide = JOURNAL_HERO_SLIDES[index];

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
    <section
      className="relative isolate min-h-[min(82dvh,640px)] w-full overflow-hidden bg-neutral-900 sm:min-h-[min(88dvh,720px)] lg:min-h-[min(92vh,880px)]"
      aria-roledescription="carousel"
      aria-label="Featured journal articles"
    >
      {JOURNAL_HERO_SLIDES.map((s, i) => (
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

      {/* Readability: stronger gradient on small screens; left emphasis on large */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15 sm:bg-gradient-to-br sm:from-black/70 sm:via-black/25 sm:to-transparent lg:bg-gradient-to-r lg:from-black/65 lg:via-black/35 lg:to-black/10"
        aria-hidden
      />

      <div
        className={`${SITE_HEADER_GUTTERS} relative z-10 mx-auto flex min-h-[min(82dvh,640px)] max-w-7xl flex-col justify-end pb-24 pt-16 sm:min-h-[min(88dvh,720px)] sm:justify-center sm:pb-28 sm:pt-20 md:pb-32 lg:min-h-[min(92vh,880px)] lg:justify-center lg:pb-36 lg:pt-24`}
      >
        <div className="mx-auto w-full max-w-xl text-left md:mx-auto lg:mx-0 lg:max-w-[min(100%,26rem)] xl:max-w-2xl">
          <p className="font-home-sub text-[10px] font-semibold uppercase tracking-[0.28em] text-white sm:text-[11px]">
            {slide.eyebrow}
          </p>

          <h1 className="font-home-heading mt-3 text-[1.875rem] leading-[1.15] tracking-tight text-white sm:mt-4 sm:text-[2.25rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.25rem]">
            {slide.title}
          </h1>

          <p className="font-home-body mt-4 max-w-[22rem] text-sm leading-relaxed text-white sm:mt-5 sm:max-w-none sm:text-[15px] md:text-base">
            {slide.description}
          </p>

          <Link
            href={slide.href}
            className="font-home-sub mt-6 inline-flex h-12 min-h-[3rem] max-w-full items-center justify-center self-start rounded-md bg-[#faf9f5] px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a3021] shadow-sm transition hover:bg-white sm:mt-8 sm:h-[3.25rem] sm:text-[11px]"
          >
            Read article
          </Link>
        </div>
      </div>

      {/* Carousel indicators */}
      <div
        className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 px-4 sm:bottom-6"
      >
        <div
          className="pointer-events-auto flex items-end justify-center gap-2.5 sm:gap-3"
          role="tablist"
          aria-label="Choose slide"
        >
          {JOURNAL_HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              className={cn(
                "shrink-0 rounded-full transition-all duration-300",
                i === index
                  ? "h-[3px] w-10 bg-white sm:w-12 md:w-16"
                  : "h-[2px] w-6 bg-white/35 hover:bg-white/55 sm:w-8"
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Edge tap zones — optional affordance on larger screens */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-16 bg-gradient-to-r from-black/25 to-transparent lg:block" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-16 bg-gradient-to-l from-black/20 to-transparent lg:block" aria-hidden />
    </section>
  );
}
