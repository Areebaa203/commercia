"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { DEAL_PROMO } from "@/components/home/dealsOfTheWeekData";
import {
  ALL_SHOP_PRODUCTS,
  COLOR_OPTIONS,
  PRICE_MAX,
  PRICE_MIN,
  PRODUCT_TYPE_OPTIONS,
  ROOM_OPTIONS,
  SORT_OPTIONS,
} from "@/components/shop-all/shopAllData";

const MEDIA_LG_MIN = "(min-width: 1024px)";

function subscribeMq(query, onChange) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useMediaMinLg() {
  return useSyncExternalStore(
    (onChange) => subscribeMq(MEDIA_LG_MIN, onChange),
    () => window.matchMedia(MEDIA_LG_MIN).matches,
    () => false
  );
}

function formatPrice(n) {
  return n.toFixed(2);
}

function ProductCard({ product }) {
  return (
    <article className="flex h-full flex-col rounded-sm border border-[#e8e3d9] bg-[#f4f1ea] p-3 text-center sm:p-4">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[2px] bg-[#ece7de]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2.5 sm:p-3.5"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <span className="absolute right-2 top-2 bg-[#B22222] px-2 py-0.5 text-[10px] font-semibold text-white">
            -{product.discount}%
          </span>
        </div>

        <h3 className="font-home-heading mt-3 text-sm text-[#1a3021] sm:text-base">{product.name}</h3>
        <div className="mt-1 flex justify-center gap-0.5 text-amber-600" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} icon="mingcute:star-fill" className="size-3 sm:size-3.5" />
          ))}
          <span className="ml-1 text-[11px] text-neutral-600 sm:text-xs">({product.reviews} reviews)</span>
        </div>
        <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-1.5">
          <span className="text-sm font-semibold text-[#B22222] sm:text-base">${formatPrice(product.price)}</span>
          <span className="text-xs text-neutral-800 line-through sm:text-sm">${formatPrice(product.compareAt)}</span>
        </p>
      </Link>

      <button
        type="button"
        className="font-home-sub mt-auto w-full border border-neutral-300/90 bg-[#f7f3ec] py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800 transition hover:bg-[#ece7de]"
      >
        Add to cart
      </button>
    </article>
  );
}

function PromoCard() {
  return (
    <article className="relative min-h-[180px] overflow-hidden rounded-sm border border-[#e8e3d9] bg-[#ece7de] sm:min-h-[220px] xl:min-h-[260px]">
      <Image
        src={DEAL_PROMO.image}
        alt="Gift promotion"
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" aria-hidden />
      <div className="absolute inset-x-3 bottom-3 rounded-sm bg-[#1b1a17]/70 p-3 text-left text-white backdrop-blur-[1px] sm:inset-x-4 sm:bottom-4">
        <p className="font-home-heading text-base leading-snug sm:text-lg">Gift worth $29 yours free</p>
        <p className="mt-2 text-xs leading-relaxed text-white/90">
          Spend over $200 and get a premium throw pillow on us. Limited time only.
        </p>
      </div>
    </article>
  );
}

function ToggleRow({ open, onToggle, title, children }) {
  return (
    <div className="border-b border-[#e0dcd3] py-1 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="font-home-sub flex w-full items-center justify-between py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a3021]"
      >
        {title}
        <Icon icon={open ? "mingcute:up-line" : "mingcute:down-line"} className="size-4 shrink-0 text-neutral-500" />
      </button>
      {open ? <div className="pb-3 pt-0.5">{children}</div> : null}
    </div>
  );
}

function CheckboxList({ options, expanded, selected, onToggle, toggleExpand, extraCount = 5 }) {
  const visible = expanded ? options : options.slice(0, extraCount);
  const hasMore = options.length > extraCount;
  return (
    <ul className="space-y-2">
      {visible.map((opt) => (
        <li key={opt.id}>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#24352D]">
            <input
              type="checkbox"
              checked={selected.has(opt.id)}
              onChange={() => onToggle(opt.id)}
              className="size-3.5 shrink-0 rounded border-[#b8b3a8] text-[#1a3021] accent-[#1a3021]"
            />
            <span>{opt.label}</span>
          </label>
        </li>
      ))}
      {hasMore ? (
        <li>
          <button
            type="button"
            onClick={toggleExpand}
            className="text-left text-xs font-medium text-[#1a3021] underline underline-offset-2 decoration-[#b8b3a8]"
          >
            {expanded ? "Show less" : `Show ${options.length - extraCount} more`}
          </button>
        </li>
      ) : null}
    </ul>
  );
}

function ColorList({ expanded, selected, onToggle, toggleExpand, extraCount = 5 }) {
  const opts = COLOR_OPTIONS;
  const visible = expanded ? opts : opts.slice(0, extraCount);
  const hasMore = opts.length > extraCount;
  return (
    <ul className="space-y-2">
      {visible.map((opt) => (
        <li key={opt.id}>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#24352D]">
            <input
              type="checkbox"
              checked={selected.has(opt.id)}
              onChange={() => onToggle(opt.id)}
              className="sr-only"
            />
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-[#f7f4ef]",
                selected.has(opt.id) ? "ring-[#1a3021]" : "ring-transparent"
              )}
            >
              <span className="size-6 rounded-full border border-neutral-400/40" style={{ backgroundColor: opt.swatch }} />
            </span>
            <span>{opt.label}</span>
          </label>
        </li>
      ))}
      {hasMore ? (
        <li>
          <button
            type="button"
            onClick={toggleExpand}
            className="text-left text-xs font-medium text-[#1a3021] underline underline-offset-2 decoration-[#b8b3a8]"
          >
            {expanded ? "Show less" : `Show ${opts.length - extraCount} more`}
          </button>
        </li>
      ) : null}
    </ul>
  );
}

const REVIEW_OPTIONS = [
  { id: "4", label: "4 and up", fill: 4 },
  { id: "3", label: "3 and up", fill: 3 },
  { id: "2", label: "2 and up", fill: 2 },
  { id: "1", label: "1 and up", fill: 1 },
  { id: "none", label: "Not yet rated", fill: 0 },
];

function ReviewStarsRow({ filled, total = 5 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <Icon key={i} icon={i < filled ? "mingcute:star-fill" : "mingcute:star-line"} className="size-3.5" />
      ))}
    </span>
  );
}

export default function ShopAllView() {
  const isLgUp = useMediaMinLg();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());
  const [selectedColors, setSelectedColors] = useState(() => new Set());
  const [sortId, setSortId] = useState("best");
  const [minReview, setMinReview] = useState("any");
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);

  const [roomOpen, setRoomOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const [roomExpanded, setRoomExpanded] = useState(false);
  const [typeExpanded, setTypeExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);

  useEffect(() => {
    if (filtersOpen && !isLgUp) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [filtersOpen, isLgUp]);

  const toggleRoom = useCallback((id) => {
    setSelectedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleType = useCallback((id) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleColor = useCallback((id) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = selectedRooms.size + selectedTypes.size + selectedColors.size;
    if (minReview !== "any") n += 1;
    if (priceMin > PRICE_MIN || priceMax < PRICE_MAX) n += 1;
    return n;
  }, [selectedRooms, selectedTypes, selectedColors, minReview, priceMin, priceMax]);

  const resetAll = useCallback(() => {
    setSelectedRooms(new Set());
    setSelectedTypes(new Set());
    setSelectedColors(new Set());
    setMinReview("any");
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  }, []);

  const filteredSorted = useMemo(() => {
    let list = ALL_SHOP_PRODUCTS.filter((p) => {
      if (selectedRooms.size && !selectedRooms.has(p.room)) return false;
      if (selectedTypes.size && !selectedTypes.has(p.productType)) return false;
      if (selectedColors.size && !selectedColors.has(p.color)) return false;
      if (minReview !== "any") {
        if (minReview === "none") {
          if (p.reviews > 0) return false;
        } else {
          const threshold = Number(minReview);
          if ((p.ratingAvg ?? 0) < threshold) return false;
        }
      }
      if (p.price < priceMin || p.price > priceMax) return false;
      return true;
    });

    list = [...list];
    if (sortId === "best") {
      list.sort((a, b) => b.reviews * (b.ratingAvg || 1) - a.reviews * (a.ratingAvg || 1));
    } else if (sortId === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortId === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortId === "reviews") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [selectedRooms, selectedTypes, selectedColors, minReview, priceMin, priceMax, sortId]);

  const gridItems = useMemo(() => {
    const list = filteredSorted;
    if (list.length === 0) return [];
    if (list.length <= 3) return [...list.map((p) => ({ kind: "product", product: p })), { kind: "promo", id: "promo" }];
    const out = [];
    out.push(...list.slice(0, 3).map((p) => ({ kind: "product", product: p })));
    out.push({ kind: "promo", id: "promo" });
    out.push(...list.slice(3).map((p) => ({ kind: "product", product: p })));
    return out;
  }, [filteredSorted]);

  const renderFiltersPanel = (drawer) => (
    <>
      {drawer ? (
        <div className="flex items-center justify-between gap-3 border-b border-[#e0dcd3] px-4 pb-3 pt-4">
          <span className="font-home-heading text-lg text-[#1a3021]">Filters</span>
          <button
            type="button"
            className="rounded-full p-2 text-neutral-600 hover:bg-black/5"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          >
            <Icon icon="mingcute:close-line" className="size-6" />
          </button>
        </div>
      ) : null}

      <div
        className={
          drawer
            ? "sticky top-0 z-[1] flex items-center justify-between gap-3 border-b border-[#e0dcd3] bg-[#f7f4ef] px-4 py-3"
            : "border-b border-[#e0dcd3] pb-3 pt-1"
        }
      >
        <button
          type="button"
          onClick={() => resetAll()}
          className="text-xs font-semibold uppercase tracking-wide text-[#1a3021] underline underline-offset-2"
        >
          Reset all
        </button>
      </div>

      <div className={drawer ? "flex-1 space-y-0 overflow-y-auto px-4 pb-28 pt-3" : "space-y-0 pt-2"}>
        <ToggleRow open={roomOpen} onToggle={() => setRoomOpen((v) => !v)} title="Room">
          <CheckboxList
            options={ROOM_OPTIONS}
            expanded={roomExpanded}
            selected={selectedRooms}
            onToggle={toggleRoom}
            toggleExpand={() => setRoomExpanded((e) => !e)}
          />
        </ToggleRow>
        <ToggleRow open={typeOpen} onToggle={() => setTypeOpen((v) => !v)} title="Product type">
          <CheckboxList
            options={PRODUCT_TYPE_OPTIONS}
            expanded={typeExpanded}
            selected={selectedTypes}
            onToggle={toggleType}
            toggleExpand={() => setTypeExpanded((e) => !e)}
          />
        </ToggleRow>
        <ToggleRow open={colorOpen} onToggle={() => setColorOpen((v) => !v)} title="Color">
          <ColorList
            expanded={colorExpanded}
            selected={selectedColors}
            onToggle={toggleColor}
            toggleExpand={() => setColorExpanded((e) => !e)}
          />
        </ToggleRow>
        <ToggleRow open={reviewsOpen} onToggle={() => setReviewsOpen((v) => !v)} title="Reviews">
          <ul className="space-y-2">
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#24352D]">
                <input
                  type="radio"
                  name="shop-min-review"
                  checked={minReview === "any"}
                  onChange={() => setMinReview("any")}
                  className="size-3.5 accent-[#1a3021]"
                />
                <span>Any rating</span>
              </label>
            </li>
            {REVIEW_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#24352D]">
                  <input
                    type="radio"
                    name="shop-min-review"
                    checked={minReview === opt.id}
                    onChange={() => setMinReview(opt.id)}
                    className="size-3.5 accent-[#1a3021]"
                  />
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {opt.label}
                    {opt.id !== "none" ? <ReviewStarsRow filled={opt.fill} /> : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </ToggleRow>
        <ToggleRow open={priceOpen} onToggle={() => setPriceOpen((v) => !v)} title="Price">
          <div className="px-0.5 pt-1">
            <div className="relative h-9">
              <input
                type="range"
                min={PRICE_MIN}
                max={Math.min(priceMax - 1, PRICE_MAX - 1)}
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceMin(Math.min(v, priceMax - 1));
                }}
                className="absolute z-10 w-full cursor-pointer accent-[#1a3021]"
              />
              <input
                type="range"
                min={Math.max(priceMin + 1, PRICE_MIN + 1)}
                max={PRICE_MAX}
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceMax(Math.max(v, priceMin + 1));
                }}
                className="absolute z-20 w-full cursor-pointer accent-[#1a3021]"
              />
            </div>
            <div className="mt-2 flex justify-between font-home-sub text-xs tabular-nums text-[#566157]">
              <span>${priceMin}</span>
              <span>${priceMax}</span>
            </div>
          </div>
        </ToggleRow>
      </div>

      {drawer ? (
        <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#e0dcd3] bg-[#f7f4ef] p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="font-home-sub w-full rounded-sm bg-[#1a3021] py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Show {filteredSorted.length} results
          </button>
        </div>
      ) : null}
    </>
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <p className="font-home-sub text-[11px] uppercase tracking-[0.14em] text-[#6b7368]">Home / Shop all</p>
        <h1 className="font-home-heading mt-1 text-4xl leading-none text-[#1a3021] sm:text-5xl">Shop all</h1>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="font-home-sub inline-flex items-center gap-2 rounded-sm border border-[#d6d0c5] bg-[#f2efe8] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1a3021] transition hover:bg-[#e8e2d8]"
          >
            <Icon icon="mingcute:equalizer-fill" className="size-4 rotate-90" />
            {filtersOpen ? "HIDE FILTER" : "SHOW FILTER"} ({activeFilterCount})
          </button>
          {filtersOpen ? (
            <button type="button" onClick={resetAll} className="hidden text-xs font-semibold uppercase tracking-wide text-[#1a3021] underline underline-offset-2 sm:inline lg:hidden">
              Reset all
            </button>
          ) : null}
          <span className="text-sm text-[#566157]">{filteredSorted.length} results</span>
        </div>

        <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[200px]">
          <label htmlFor="shop-sort" className="text-[10px] font-medium uppercase tracking-wide text-[#6b7368]">
            Sort by
          </label>
          <div className="relative">
            <select
              id="shop-sort"
              value={sortId}
              onChange={(e) => setSortId(e.target.value)}
              className="font-home-sub w-full appearance-none rounded-sm border border-[#d6d0c5] bg-white py-2.5 pl-3 pr-9 text-xs font-semibold text-[#1a3021]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <Icon
              icon="mingcute:down-line"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex gap-8 lg:gap-10",
          filtersOpen ? "lg:grid lg:grid-cols-[260px,minmax(0,1fr)]" : ""
        )}
      >
        {filtersOpen && isLgUp ? (
          <aside className="w-[260px] shrink-0">{renderFiltersPanel(false)}</aside>
        ) : null}

        {filtersOpen && !isLgUp ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/35"
              aria-label="Close filters overlay"
              onClick={() => setFiltersOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,380px)] flex-col bg-[#f7f4ef] shadow-2xl">
              {renderFiltersPanel(true)}
            </aside>
          </>
        ) : null}

        <section className={cn("min-w-0 flex-1", filtersOpen ? "lg:max-w-none" : "w-full")}>
          {filteredSorted.length === 0 ? (
            <p className="rounded-sm border border-dashed border-[#d6d0c5] bg-[#f4f1ea]/80 px-6 py-16 text-center text-sm text-neutral-600">
              No products match these filters.&nbsp;
              <button type="button" className="font-semibold text-[#1a3021] underline" onClick={resetAll}>
                Reset all
              </button>
            </p>
          ) : (
            <ul
              className={cn(
                "grid list-none gap-3 sm:grid-cols-2 sm:gap-4",
                filtersOpen ? "lg:grid-cols-3 lg:gap-5" : "lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
              )}
            >
              {gridItems.map((item) =>
                item.kind === "promo" ? (
                  <li key="promo" className="min-w-0">
                    <PromoCard />
                  </li>
                ) : (
                  <li key={item.product.id} className="min-w-0">
                    <ProductCard product={item.product} />
                  </li>
                )
              )}
            </ul>
          )}

          {filteredSorted.length > 0 ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="font-home-sub inline-flex items-center justify-center rounded-sm border border-[#d6d0c5] bg-[#f8f4ec] px-8 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a3021] hover:bg-[#efe8dc]"
              >
                Show more
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
