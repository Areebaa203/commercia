"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { DEAL_PRODUCTS, DEAL_PROMO } from "@/components/home/dealsOfTheWeekData";

const GREEN = "#1A3021";
const RED = "#B22222";
const SECTION_BG = "#FCF9F2";
const CARD_BG = "#f4f1ea";

function formatPrice(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DealProductCard({ product }) {
  return (
    <article className="flex h-full min-h-0 flex-col items-center rounded-[6px] border border-[#e4dfd4] p-3 text-center shadow-sm sm:p-4" style={{ backgroundColor: CARD_BG }}>
      <Link href={`/products/${product.id}`} className="group block w-full min-w-0">
        <div className="relative w-full">
          <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-[#ece7de]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2 transition group-hover:opacity-95 sm:p-3"
              sizes="(max-width: 768px) 45vw, 22vw"
            />
            <span
              className="font-home-sub absolute right-1.5 top-1.5 px-1.5 py-px text-[9px] font-semibold tabular-nums text-white sm:right-2 sm:top-2 sm:px-2 sm:py-0.5 sm:text-[10px]"
              style={{ backgroundColor: RED }}
            >
              -{product.discount}%
            </span>
          </div>
        </div>

        <h3 className="font-home-heading mt-3 text-[0.9375rem] leading-snug sm:mt-4 sm:text-[1.0625rem]" style={{ color: GREEN }}>
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-0.5 sm:mt-2">
          <span className="flex gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} icon="mingcute:star-fill" className="size-3 sm:size-3.5" aria-hidden />
            ))}
          </span>
          <span className="ml-1 font-home-body text-[10px] tabular-nums text-neutral-500 sm:text-[11px]">
            ({product.reviews} reviews)
          </span>
        </div>

        <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-2 sm:mt-2">
          <span className="font-home-body text-base font-semibold tabular-nums text-neutral-900">${formatPrice(product.price)}</span>
          <span className="font-home-body text-sm font-semibold tabular-nums line-through" style={{ color: RED }}>
            ${formatPrice(product.compareAt)}
          </span>
        </p>
      </Link>

      <button
        type="button"
        className="font-home-sub mt-3 w-full border border-[#cfccc3] bg-[#f7f3ec] py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a] transition hover:bg-[#ece7de] sm:mt-4 sm:py-2.5 sm:text-[10px]"
        style={{ borderRadius: "4px" }}
      >
        Add to cart
      </button>
    </article>
  );
}

function DealsPromoBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-[6px] border border-[#e4dfd4] shadow-sm">
      <div className="relative aspect-[16/11] w-full min-h-[11rem] sm:aspect-[16/9] sm:min-h-[14rem] md:min-h-[17rem]">
        <Image
          src={DEAL_PROMO.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
      </div>
      <div
        className="absolute left-2 top-2 max-w-[calc(100%-1rem)] p-2.5 shadow-md sm:left-3 sm:top-3 sm:max-w-[min(100%,24rem)] sm:p-3.5"
        style={{ backgroundColor: RED }}
      >
        <p className="font-home-sub text-[8px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-white sm:text-[10px] sm:tracking-[0.12em]">
          {DEAL_PROMO.datesLine}
        </p>
        <p className="font-home-body mt-2 text-[0.8125rem] font-medium leading-snug text-white sm:mt-3 sm:text-base md:text-lg">
          {DEAL_PROMO.headline}{" "}
          <span className="font-normal opacity-95">{DEAL_PROMO.subheadline}</span>
        </p>
      </div>
    </div>
  );
}

export default function DealsOfTheWeekSection() {
  const [topLeft, topRight, ...rest] = DEAL_PRODUCTS;

  return (
    <section className="py-7 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: SECTION_BG }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2
            className="font-home-heading text-[1.75rem] leading-tight tracking-tight sm:text-3xl md:text-[2.25rem]"
            style={{ color: GREEN }}
          >
            Deals of the week
          </h2>
          <p className="mt-2 max-w-2xl font-home-body text-sm leading-relaxed text-neutral-900 sm:text-base">
            Limited-time offers on customer favorites. New deals every Monday.
          </p>
        </div>

        {/* Mobile: 2-col grid, 2 cards → full-width promo → 2×2 cards; md+: 4-col row with promo spanning 2 */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 md:mt-10 md:grid-cols-4 md:gap-5 lg:gap-6">
          <div className="min-w-0">
            <DealProductCard product={topLeft} />
          </div>
          <div className="min-w-0">
            <DealProductCard product={topRight} />
          </div>
          <div className="col-span-2 min-h-0 md:col-span-2 md:min-h-full">
            <DealsPromoBanner />
          </div>
          {rest.map((product) => (
            <div key={product.id} className="min-w-0">
              <DealProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
