"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { ALL_SHOP_PRODUCTS } from "@/components/shop-all/shopAllData";
import JournalArticleShareFooter from "@/components/journal/JournalArticleShareFooter";

function formatPrice(n) {
  return n.toFixed(2);
}

/**
 * Horizontal product strip (PDP “You may also like” + journal “Related products”).
 * @param {{
 *   excludeSlug?: string | null;
 *   heading?: string;
 *   viewAllHref?: string;
 *   showViewAll?: boolean;
 *   showTopShare?: boolean;
 *   priceStyle?: "sale" | "editorial";
 *   sectionClassName?: string;
 * }} props
 */
export default function RelatedProductsCarousel({
  excludeSlug = null,
  heading = "You may also like",
  viewAllHref = "/products",
  showViewAll = false,
  showTopShare = false,
  priceStyle = "sale",
  sectionClassName = "",
}) {
  const { addItem } = useCart();
  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const items = useMemo(() => {
    const list = excludeSlug
      ? ALL_SHOP_PRODUCTS.filter((p) => p.slug !== excludeSlug)
      : [...ALL_SHOP_PRODUCTS];
    return list.slice(0, 12);
  }, [excludeSlug]);

  const updateProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    const ro = new ResizeObserver(updateProgress);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      ro.disconnect();
    };
  }, [updateProgress, items.length]);

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.75 * dir, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className={cn("py-12 sm:py-16", sectionClassName)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showTopShare ? (
          <div className="mb-10 flex justify-center sm:mb-12">
            <JournalArticleShareFooter centered className="max-w-md" />
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
            showViewAll && "lg:items-end"
          )}
        >
          <h2 className="font-home-heading text-2xl tracking-tight text-[#1f2a22] sm:text-3xl md:text-[2.25rem]">
            {heading}
          </h2>
          {showViewAll ? (
            <Link
              href={viewAllHref}
              className="font-home-sub inline-flex h-11 w-full shrink-0 items-center justify-center rounded-md bg-[#24352d] px-8 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1a3021] sm:w-auto sm:px-10"
            >
              View all
            </Link>
          ) : null}
        </div>

        <ul
          ref={scrollerRef}
          className="no-scrollbar mt-8 flex list-none gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory md:gap-5"
        >
          {items.map((p) => (
            <li
              key={p.slug}
              className="w-[min(76vw,240px)] shrink-0 snap-start sm:w-[220px] md:w-[240px]"
            >
              <article className="flex h-full flex-col rounded-sm border border-[#e8e3d9] bg-[#f4f1ea] p-3 text-center sm:p-4">
                <Link href={`/products/${p.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-[2px] bg-[#ece7de]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-2.5 sm:p-3.5"
                      sizes="(max-width: 640px) 76vw, 240px"
                    />
                    <span className="absolute right-2 top-2 bg-[#B22222] px-2 py-0.5 text-[10px] font-semibold text-white">
                      -{p.discount}%
                    </span>
                  </div>
                  <h3 className="font-home-heading mt-3 line-clamp-2 text-sm text-[#1a3021] sm:text-base">{p.name}</h3>
                  <div className="mt-1 flex justify-center gap-0.5 text-amber-600" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} icon="mingcute:star-fill" className="size-3 sm:size-3.5" />
                    ))}
                    <span className="ml-1 text-[11px] text-neutral-600 sm:text-xs">({p.reviews} reviews)</span>
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-1.5">
                    {priceStyle === "editorial" ? (
                      <>
                        <span className="text-sm font-semibold text-[#1a3021] sm:text-base">
                          ${formatPrice(p.price)}
                        </span>
                        <span className="text-xs font-medium text-[#B22222] line-through sm:text-sm">
                          ${formatPrice(p.compareAt)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-[#B22222] sm:text-base">
                          ${formatPrice(p.price)}
                        </span>
                        <span className="text-xs text-neutral-800 line-through sm:text-sm">
                          ${formatPrice(p.compareAt)}
                        </span>
                      </>
                    )}
                  </p>
                </Link>
                <button
                  type="button"
                  className="font-home-sub mt-auto w-full border border-neutral-300/90 bg-[#f7f3ec] py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800 transition hover:bg-[#ece7de]"
                  onClick={() =>
                    addItem({
                      slug: p.slug,
                      name: p.name,
                      image: p.image,
                      price: p.price,
                      compareAt: p.compareAt,
                      variantLabel: null,
                      qty: 1,
                    })
                  }
                >
                  Add to cart
                </button>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="h-px min-w-[6rem] max-w-[160px] flex-1 bg-[#d8d2c7]">
            <div
              className="h-px bg-[#24352d] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Previous products"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de]"
            >
              <Icon icon="mingcute:left-line" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Next products"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de]"
            >
              <Icon icon="mingcute:right-line" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
