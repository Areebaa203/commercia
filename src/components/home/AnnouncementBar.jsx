"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function AnnouncementBar() {
  return (
    <Link
      href="/shop-all"
      className="group flex min-h-[2rem] items-center justify-center bg-[#1a3021] px-3 py-2 text-center transition hover:bg-[#142418] sm:min-h-[2.125rem]"
    >
      <p className="inline-flex items-center justify-center gap-1.5 font-home-body text-[11px] font-medium leading-snug tracking-wide text-white sm:text-xs">
        <span>Free shipping on orders over $100</span>
        <Icon
          icon="mingcute:arrow-right-line"
          className="size-3.5 shrink-0 opacity-90 transition-transform group-hover:translate-x-0.5 sm:size-4"
          aria-hidden
        />
      </p>
    </Link>
  );
}
