"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const RED = "#B22222";

const SLIDES = [
  {
    id: "1",
    author: "James C.",
    quote:
      "I needed a simple side table that wouldn't take up too much room. This one is solid, well-made, and the minimalist design goes with everything. Super happy with it.",
    lifestyleImage: "/coffee-tables-img.jpg",
    product: {
      name: "Oak Side Table",
      thumb: "/pick-2.png",
      price: 14.0,
      compareAt: 25.0,
      href: "/products/oak-side-table",
    },
  },
  {
    id: "2",
    author: "Nina R.",
    quote:
      "The quality exceeded my expectations. Delivery was quick and the piece looks even better in person than online.",
    lifestyleImage: "/coffee-tables-img.jpg",
    product: {
      name: "Oak Side Table",
      thumb: "/pick-2.png",
      price: 14.0,
      compareAt: 25.0,
      href: "/products/oak-side-table",
    },
  },
  {
    id: "3",
    author: "Marcus T.",
    quote:
      "Minimal assembly, sturdy build, and it fits perfectly in our reading nook. Haven has become our go-to for furniture.",
    lifestyleImage: "/coffee-tables-img.jpg",
    product: {
      name: "Oak Side Table",
      thumb: "/pick-2.png",
      price: 14.0,
      compareAt: 25.0,
      href: "/products/oak-side-table",
    },
  },
];

function formatPrice(n) {
  return n.toFixed(2);
}

export default function HomeTestimonialSpotlightSection() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[index];

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  return (
    <section className="bg-[#F9F7F0] py-7 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex min-h-0 flex-col gap-8 lg:min-h-[420px] lg:justify-between">
            <div>
              <div className="flex items-center justify-center gap-2 text-sm text-[#24352D] lg:justify-start">
                <span className="flex text-amber-500" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon="mingcute:star-fill" className="size-4" />
                  ))}
                </span>
                <span className="font-home-sub text-sm font-medium">{slide.author}</span>
              </div>
              <blockquote className="font-home-heading mt-5 text-center text-[1.125rem] leading-relaxed text-[#24352D] sm:mt-6 sm:text-xl md:text-2xl lg:text-left lg:text-[1.75rem]">
                &ldquo;{slide.quote}&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-2.5 lg:justify-start" role="tablist" aria-label="Testimonials">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "shrink-0 rounded-full transition-all duration-300",
                      i === index ? "h-[3px] w-9 bg-[#1a3d2e] sm:w-10" : "h-[2px] w-6 bg-[#d8d2c7] hover:bg-[#c4beb3] sm:w-7"
                    )}
                  />
                ))}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous review"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de]"
                >
                  <Icon icon="mingcute:left-line" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next review"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de]"
                >
                  <Icon icon="mingcute:right-line" className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-full min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#ebe4d8] sm:aspect-[5/4]">
              <Image
                key={slide.lifestyleImage + index}
                src={slide.lifestyleImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute bottom-3 left-3 z-10 max-w-[min(100%,19rem)] rounded-sm border border-neutral-200/90 bg-white p-3 shadow-md sm:bottom-4 sm:left-4 sm:max-w-[20rem] sm:p-4 lg:bottom-4 lg:left-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-[#f2efe8] sm:h-16 sm:w-16">
                  <Image
                    src={slide.product.thumb}
                    alt={slide.product.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-home-heading text-[0.9375rem] leading-tight text-[#24352D] sm:text-base">
                    {slide.product.name}
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="font-home-body text-sm font-semibold tabular-nums text-neutral-900 sm:text-base">
                      ${formatPrice(slide.product.price)}
                    </span>
                    <span className="font-home-body text-sm font-semibold tabular-nums line-through" style={{ color: RED }}>
                      ${formatPrice(slide.product.compareAt)}
                    </span>
                  </p>
                  <Link
                    href={slide.product.href}
                    className="font-home-sub mt-2 inline-block text-[11px] font-semibold uppercase tracking-wide text-[#24352D] underline underline-offset-[3px] hover:opacity-80 sm:text-xs"
                  >
                    Shop product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
