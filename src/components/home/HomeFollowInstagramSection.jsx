"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS } from "@/components/home/homeInstagramData";

const GAP_PX = 18;
const GREEN = "#2D3E33";
const SECTION_BG = "#FDFBF7";

function scrollStepEl(el) {
  const first = el?.querySelector("li");
  if (!first) return el?.clientWidth * 0.35 ?? 0;
  const style = window.getComputedStyle(el);
  const gap = parseFloat(style.columnGap || style.gap) || GAP_PX;
  return first.getBoundingClientRect().width + gap;
}

/** Map scroll position to one of three zones (matches three dash UI). */
function zoneFromScroll(scrollLeft, maxScroll) {
  if (maxScroll <= 0) return 0;
  const t = scrollLeft / maxScroll;
  if (t < 0.34) return 0;
  if (t < 0.67) return 1;
  return 2;
}

export default function HomeFollowInstagramSection() {
  const scrollerRef = useRef(null);
  const [zone, setZone] = useState(0);

  const syncZone = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setZone(zoneFromScroll(el.scrollLeft, max));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncZone();
    el.addEventListener("scroll", syncZone, { passive: true });
    const ro = new ResizeObserver(syncZone);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncZone);
      ro.disconnect();
    };
  }, [syncZone]);

  const scrollToZone = (z) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = z === 0 ? 0 : z === 1 ? max / 2 : max;
    el.scrollTo({ left, behavior: "smooth" });
  };

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollStepEl(el) * dir, behavior: "smooth" });
  };

  return (
    <section className="border-t border-[#e8e4dc] py-6 sm:py-10 md:py-14 lg:py-16" style={{ backgroundColor: SECTION_BG }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="font-home-heading text-[1.625rem] leading-tight tracking-tight sm:text-3xl md:text-[2.25rem]"
          style={{ color: GREEN }}
        >
          Follow us on Instagram
        </h2>
        <p className="mt-1.5 font-home-body text-sm text-[#363d3b] sm:mt-2 sm:text-base">
          <a
            href="https://www.instagram.com/haven_furniture/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#2D3E33] underline-offset-2 hover:underline"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </p>

        <div className="relative mt-5 sm:mt-8">
          <ul
            ref={scrollerRef}
            className="no-scrollbar flex list-none gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] sm:gap-[18px]"
          >
            {INSTAGRAM_POSTS.map((item) => (
              <li
                key={item.id}
                className="w-[min(72vw,240px)] shrink-0 snap-start sm:w-[200px] md:w-[220px] lg:w-[240px]"
              >
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-sm bg-[#e8e4de]"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="240px"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/35"
                    aria-hidden
                  />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Icon icon="mdi:instagram" className="size-10 text-white drop-shadow-md" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
          <div className="flex min-w-0 flex-1 items-center justify-start gap-2 sm:gap-2.5" role="tablist" aria-label="Instagram gallery">
            {[0, 1, 2].map((z) => (
              <button
                key={z}
                type="button"
                role="tab"
                aria-selected={zone === z}
                aria-label={`Gallery page ${z + 1}`}
                onClick={() => scrollToZone(z)}
                className={cn(
                  "shrink-0 rounded-full transition-all duration-300",
                  zone === z ? "h-[3px] w-9 bg-[#2F3E33] sm:w-10" : "h-[2px] w-6 bg-[#d8d2c7] hover:bg-[#c4beb3] sm:w-7"
                )}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Previous photos"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de] sm:h-10 sm:w-10"
            >
              <Icon icon="mingcute:left-line" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Next photos"
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
