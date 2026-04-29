"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CATEGORIES, PRODUCTS } from "@/components/home/popularPicksData";

const BG = "#F9F7F0";
const FOREST = "#2D3E33";
const CREAM_PILL = "#e8e4dc";
const MUTED = "#6d7268";
const DISCOUNT_BG = "#B22222";

function formatPrice(n) {
  return n.toFixed(2);
}

function ProductCard({ product }) {
  const href = `/products/${product.slug}`;
  return (
    <article className="flex h-full flex-col text-left">
      <Link href={href} className="group flex min-w-0 flex-1 flex-col">
        <div
          className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#ebe8e0]"
          style={{ borderRadius: "2px" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2.5 transition group-hover:opacity-95 sm:p-3"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <span
            className="font-home-sub absolute right-2 top-2 px-1.5 py-px text-[9px] font-semibold tabular-nums text-white sm:right-2.5 sm:px-2 sm:py-0.5 sm:text-[10px]"
            style={{ backgroundColor: DISCOUNT_BG }}
          >
            -{product.discount}%
          </span>
        </div>

        <h3
          className="font-home-heading mt-2.5 text-[0.95rem] leading-snug sm:mt-3 sm:text-lg"
          style={{ color: FOREST }}
        >
          {product.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} icon="mingcute:star-fill" className="size-3 sm:size-3.5" aria-hidden />
          ))}
          <span className="ml-0.5 font-home-body text-[10px] font-normal text-neutral-500 sm:text-xs">
            ({product.reviews} reviews)
          </span>
        </div>

        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold text-neutral-900">${formatPrice(product.price)}</span>
          <span
            className="font-home-body text-sm tabular-nums line-through"
            style={{ color: DISCOUNT_BG }}
          >
            ${formatPrice(product.compareAt)}
          </span>
        </p>
      </Link>

      <button
        type="button"
        className="font-home-sub mt-3 w-full border border-[#d4cfc3] bg-[#f4f0ea] py-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition hover:bg-[#ebe5da] sm:mt-3.5 sm:py-2.5 sm:text-[10px]"
        style={{ color: FOREST, borderRadius: "2px" }}
      >
        Add to cart
      </button>
    </article>
  );
}

export default function PopularPicksSection() {
  const [activeCategory, setActiveCategory] = useState("living");

  const visible = useMemo(() => {
    const filtered = PRODUCTS.filter((p) => p.category === activeCategory);
    if (filtered.length > 0) return filtered;
    return PRODUCTS.filter((p) => p.category === "living");
  }, [activeCategory]);

  return (
    <section className="py-6 sm:py-10" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title + Show all */}
        <div className="flex items-start justify-between gap-3">
          <h2
            className="font-home-heading max-w-[70%] text-[1.75rem] leading-[1.1] tracking-tight sm:max-w-none sm:text-3xl md:text-4xl lg:text-[2.75rem]"
            style={{ color: FOREST }}
          >
            Popular picks
          </h2>
          <Link
            href="/shop-all"
            className="font-home-sub mt-0.5 inline-flex shrink-0 items-center justify-center px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 sm:mt-1 sm:px-5 sm:py-2.5 sm:text-[10px]"
            style={{ backgroundColor: FOREST, borderRadius: "2px" }}
          >
            Show all
          </Link>
        </div>

        {/* Category chips — horizontal scroll on narrow screens */}
        <div
          className="no-scrollbar mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-6 sm:flex-wrap sm:px-0"
          role="tablist"
          aria-label="Category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className="font-home-body shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium capitalize transition sm:px-4"
                style={{
                  backgroundColor: isActive ? CREAM_PILL : "transparent",
                  color: isActive ? FOREST : MUTED,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-neutral-500">No products in this category yet.</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {visible.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
