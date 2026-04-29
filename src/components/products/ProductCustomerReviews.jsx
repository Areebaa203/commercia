"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const PHOTO_BAR = [
  "/pick-1.png",
  "/pick-3.png",
  "/pick-2.png",
  "/coffee-tables-img.jpg",
  "/pick-4.png",
  "/arm-chair-img.jpg",
];

const SAMPLE_REVIEWS = [
  {
    id: "r1",
    rating: 5,
    author: "Sarah M.",
    location: "Austin, TX",
    time: "1 week ago",
    verified: true,
    title: "Perfect for my small apartment",
    body:
      "Absolutely love this piece—fits the room perfectly and feels more expensive than it is. Delivery was smooth and assembly took under an hour with two people.",
    recommend: true,
    photos: ["/pick-1.png"],
    helpfulYes: 24,
    helpfulNo: 1,
  },
  {
    id: "r2",
    rating: 5,
    author: "James C.",
    location: "Seattle, WA",
    time: "3 weeks ago",
    verified: true,
    title: "Great quality",
    body:
      "Solid frame and the fabric wears well so far with kids and a dog in the house. Would buy again.",
    recommend: true,
    photos: ["/pick-3.png", "/pick-2.png"],
    helpfulYes: 18,
    helpfulNo: 0,
  },
  {
    id: "r3",
    rating: 4,
    author: "Nina R.",
    location: "Denver, CO",
    time: "1 month ago",
    verified: true,
    title: "Lovely, minor delivery delay",
    body:
      "Beautiful finish and comfy seating. Carrier was a day late but support kept us informed throughout.",
    recommend: true,
    photos: ["/pick-1.png", "/pick-2.png", "/pick-3.png", "/pick-4.png"],
    helpfulYes: 9,
    helpfulNo: 2,
  },
];

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)));
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  return [progress, update];
}


/** Full-bleed horizontal strip aligned to section gutters; scroll-padding so the last thumb scrolls fully into view */
const bleedScrollUl =
  "no-scrollbar flex flex-nowrap snap-x snap-proximity list-none gap-3 overflow-x-auto scroll-smooth pb-1 scroll-pl-4 scroll-pr-4 px-4 sm:scroll-pl-6 sm:scroll-pr-6 sm:gap-4 sm:px-6 lg:scroll-pl-8 lg:scroll-pr-8 lg:px-8";

const bleedWrap = "relative mt-4 min-w-0 -mx-4 sm:-mx-6 lg:-mx-8";

function ReviewPhotoStrip({ photos }) {
  const ref = useRef(null);
  const [progress] = useScrollProgress(ref);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.55, 240), behavior: "smooth" });
  };

  if (!photos?.length) return null;

  const thumbClass =
    "relative aspect-square shrink-0 snap-start overflow-hidden rounded-sm bg-[#ece7de]";

  /* One row: thumbnails extend across the layout like the mock; short lists still get end padding via scroll-padding */
  if (photos.length <= 2) {
    return (
      <div className={bleedWrap}>
        <ul className={`${bleedScrollUl}`}>
          {photos.map((src) => (
            <li key={src} className={`${thumbClass} h-[7.25rem] w-[7.25rem] sm:h-32 sm:w-32`}>
              <Image src={src} alt="" fill className="object-cover" sizes="128px" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={bleedWrap}>
      <ul ref={ref} className={bleedScrollUl}>
        {photos.map((src) => (
          <li key={src} className={`${thumbClass} h-[7.5rem] w-[7.5rem] sm:h-32 sm:w-32`}>
            <Image src={src} alt="" fill className="object-cover" sizes="128px" />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="relative h-[2px] min-w-0 flex-1 rounded-full bg-[#d8d2c7]">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#1a3021] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Scroll review photos left"
            onClick={() => scrollBy(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#cfd5c9] bg-white text-[#3d5346] transition hover:bg-[#f0ede6]"
          >
            <Icon icon="mingcute:left-line" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll review photos right"
            onClick={() => scrollBy(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#cfd5c9] bg-white text-[#3d5346] transition hover:bg-[#f0ede6]"
          >
            <Icon icon="mingcute:right-line" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCustomerReviews({ averageRating = 5, reviewTotal = 120 }) {
  const galleryRef = useRef(null);
  const [galleryProgress] = useScrollProgress(galleryRef);
  const [sortBy, setSortBy] = useState("recent");
  const [showAll, setShowAll] = useState(false);

  const displayed = useMemo(
    () => (showAll ? SAMPLE_REVIEWS : SAMPLE_REVIEWS.slice(0, 2)),
    [showAll]
  );

  const scrollGallery = (dir) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.6, 240), behavior: "smooth" });
  };

  return (
    <section className="border-t border-[#e8e4dc] bg-[#f9f8f3] py-14 sm:py-16 md:py-[4.25rem]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="font-home-heading max-w-xl text-[1.75rem] leading-tight tracking-tight text-[#1a3021] sm:text-[2rem] md:text-[2.25rem]">
            Customer reviews
          </h2>
          <button
            type="button"
            className="font-home-sub shrink-0 self-start rounded-[2px] bg-[#1a3021] px-7 py-[0.72rem] text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#14241c] sm:self-auto"
          >
            Write a review
          </button>
        </div>

        {/* Customer photo strip — edge-to-edge row; last image scrolls clear to the inset edge */}
        <div className="relative mt-9 min-w-0 -mx-4 sm:-mx-6 lg:-mx-8">
          <ul
            ref={galleryRef}
            className={bleedScrollUl}
          >
            {PHOTO_BAR.map((src, i) => (
              <li
                key={i}
                className="relative aspect-square h-24 w-24 shrink-0 snap-start overflow-hidden rounded-sm bg-[#ece7de] sm:h-[7.25rem] sm:w-[7.25rem]"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="116px" />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="relative h-[2px] min-w-0 flex-1 rounded-full bg-[#d8d2c7]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#1a3021] transition-[width] duration-150 ease-out"
                style={{ width: `${galleryProgress}%` }}
              />
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Scroll photos left"
                onClick={() => scrollGallery(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#cfd5c9] bg-white text-[#3d5346] transition hover:bg-[#f0ede6]"
              >
                <Icon icon="mingcute:left-line" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll photos right"
                onClick={() => scrollGallery(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#cfd5c9] bg-white text-[#3d5346] transition hover:bg-[#f0ede6]"
              >
                <Icon icon="mingcute:right-line" className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary row — three columns */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[#dfd9cf] pt-10 md:grid-cols-3 md:items-start md:gap-8 lg:gap-10">
          <div className="md:max-w-none">
            <p className="font-home-heading text-[2.65rem] font-normal leading-none tracking-tight text-[#1a3021] sm:text-[3rem]">
              {averageRating.toFixed(1)}
            </p>
            <div className="mt-3 flex text-[#b8860b]" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} icon="mingcute:star-fill" className="size-[1.125rem]" />
              ))}
            </div>
            <p className="mt-4 font-home-body text-sm text-[#464d47]">
              Average rating ({reviewTotal.toLocaleString()} reviews)
            </p>
          </div>

          <div className="flex items-center md:justify-center">
            <p className="font-home-body max-w-[20rem] text-center text-sm leading-relaxed text-[#363c38] md:text-[0.9375rem]">
              <span className="font-semibold text-[#1a3021]">100%</span> of respondents would
              recommend this to a friend
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <label
              htmlFor="review-sort"
              className="font-home-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7368]"
            >
              Sort by
            </label>
            <div className="relative mt-2 w-full md:max-w-[13.75rem]">
              <select
                id="review-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-home-body h-11 w-full appearance-none rounded-sm border border-[#cfd5c9] bg-white py-2 pl-3 pr-10 text-[13px] font-medium text-[#1a3021] shadow-none outline-none ring-0 transition focus:border-[#1a3021]/40"
              >
                <option value="recent">Most recent</option>
                <option value="high">Highest rating</option>
                <option value="low">Lowest rating</option>
                <option value="helpful">Most helpful</option>
              </select>
              <Icon
                icon="mingcute:down-line"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7368]"
              />
            </div>
          </div>
        </div>

        {/* Review list */}
        <ul className="mt-10 divide-y divide-[#dfd9cf] border-t border-[#dfd9cf]">
          {displayed.map((rv) => (
            <li key={rv.id} className="py-10 first:border-t-0 first:pt-9">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">
                {/* Left: reviewer */}
                <div className="lg:col-span-3">
                  <div className="flex text-[#b8860b]" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        icon={i < rv.rating ? "mingcute:star-fill" : "mingcute:star-line"}
                        className={cn("size-4", i >= rv.rating && "text-[#c9cfc8]")}
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 font-home-body text-[15px] font-semibold text-[#1a3021]">
                    {rv.author}
                  </p>
                  <p className="mt-1 font-home-body text-sm text-[#5c645c]">{rv.location}</p>
                  <p className="mt-1 font-home-body text-xs text-[#7a827b]">{rv.time}</p>
                  {rv.verified ? (
                    <p className="mt-3.5 inline-flex items-center gap-1.5 rounded-sm border border-[#d4cec3] bg-white px-2.5 py-1 font-home-sub text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3d5346]">
                      <Icon icon="mingcute:check-fill" className="size-3.5 text-[#2d6a4f]" aria-hidden />
                      Verified buyer
                    </p>
                  ) : null}
                </div>

                {/* Center: copy + photos */}
                <div className="min-w-0 lg:col-span-6">
                  <p className="font-home-body text-base font-bold text-[#1a3021] sm:text-[1.05rem]">
                    {rv.title}
                  </p>
                  <p className="mt-3 font-home-body text-sm leading-[1.65] text-[#3d4340]">{rv.body}</p>
                  <ReviewPhotoStrip photos={rv.photos} />
                  {rv.recommend ? (
                    <p className="mt-5 flex items-start gap-2 font-home-body text-sm font-medium text-[#1a3021]">
                      <Icon
                        icon="mingcute:check-fill"
                        className="mt-0.5 size-4 shrink-0 text-[#2d6a4f]"
                        aria-hidden
                      />
                      Yes, I would recommend to a friend
                    </p>
                  ) : null}
                </div>

                {/* Right: helpful */}
                <div className="flex flex-row items-start justify-between gap-4 border-t border-[#ede9e0] pt-6 lg:col-span-3 lg:flex-col lg:border-none lg:pt-0 xl:items-end xl:text-right">
                  <span className="font-home-body text-[13px] font-medium text-[#5c645c]">
                    Is it helpful?
                  </span>
                  <div className="flex items-center gap-2 xl:justify-end">
                    <button
                      type="button"
                      aria-label={`Mark review helpful, ${rv.helpfulYes} others`}
                      className="inline-flex h-9 min-w-[2.75rem] items-center justify-center gap-1.5 rounded border border-[#1a3021]/25 bg-transparent px-2 font-home-body text-xs font-medium text-[#363c38] transition hover:border-[#1a3021]/45 hover:bg-white"
                    >
                      <Icon icon="mingcute:thumb-up-line" className="size-4 shrink-0" aria-hidden />{" "}
                      <span>{rv.helpfulYes}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Mark review not helpful, ${rv.helpfulNo} others`}
                      className="inline-flex h-9 min-w-[2.75rem] items-center justify-center gap-1.5 rounded border border-[#1a3021]/25 bg-transparent px-2 font-home-body text-xs font-medium text-[#363c38] transition hover:border-[#1a3021]/45 hover:bg-white"
                    >
                      <Icon icon="mingcute:thumb-down-line" className="size-4 shrink-0" aria-hidden />{" "}
                      <span>{rv.helpfulNo}</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-11 flex justify-center">
          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="font-home-sub w-full max-w-lg rounded-[2px] border border-[#1a3021] bg-transparent px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a3021] transition hover:bg-[#1a3021]/[0.06] sm:w-auto"
            >
              Show more reviews
            </button>
          ) : (
            <p className="font-home-body text-sm text-[#7a827b]">
              You&apos;ve reached the end of reviews shown for now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
