"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";
import AnnouncementBar from "./AnnouncementBar";
import Image from "next/image";

const nav = [
  { label: "Show all", href: "/dashboard/products" },
  { label: "Journal", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export default function SiteHeader() {
  const [accountHref, setAccountHref] = useState("/login");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAccountHref(user ? "/dashboard" : "/login");
    });
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div className="border-b border-[#D5D6C3] bg-[#FFFDF4]">
        <div className="mx-auto flex max-w-7xl h-[72px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center w-[87px] h-[24px]">
            <Image
              src="/logo.svg"
              alt="Haven Logo"
              width={87}
              height={24}
              priority
            />
          </Link>

          <nav
            className="font-home-sub hidden flex-1 justify-center gap-8 text-[11px] font-medium uppercase text-[#3d4a42] md:flex lg:gap-8 lg:text-xs"
            aria-label="Main"
          >
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-[#1a3d2e]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Search"
            >
              <Icon icon="mingcute:search-line" className="size-5 sm:size-6" />
            </button>
            <Link
              href={accountHref}
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Account"
            >
              <Icon icon="mingcute:user-3-line" className="size-5 sm:size-6" />
            </Link>
            <Link
              href="/dashboard/orders"
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Cart"
            >
              <Icon icon="mingcute:shopping-bag-3-line" className="size-5 sm:size-6" />
            </Link>
          </div>
        </div>

        <nav
          className="font-home-sub flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 py-3 text-[10px] font-medium uppercase text-[#09281C] md:hidden"
          aria-label="Main mobile"
        >
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-[#1a3d2e]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
