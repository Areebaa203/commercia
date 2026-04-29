"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import AnnouncementBar from "./AnnouncementBar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/cart/CartDrawer";

const nav = [
  { label: "Shop all", href: "/shop-all" },
  { label: "Journal", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

/** Matches hero / sections — keep gutters identical so hero copy lines up under the logo */
export const SITE_HEADER_GUTTERS = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      {/* Mobile: hamburger | logo | search + cart */}
      <div className="border-b border-[#e8e9df] bg-white lg:border-[#D5D6C3] lg:bg-[#FFFDF4]">
        <div
          className={`${SITE_HEADER_GUTTERS} relative flex h-[3.75rem] items-center justify-between lg:hidden`}
        >
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg p-2.5 text-[#1a3021] transition hover:bg-black/[0.04]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon icon={menuOpen ? "mingcute:close-line" : "mingcute:menu-line"} className="size-6" />
          </button>

          <Link
            href="/"
            className="absolute left-1/2 flex h-[26px] w-[94px] -translate-x-1/2 shrink-0 items-center"
          >
            <Image src="/furniqo-logo.svg" alt="Furniqo" width={115} height={32} priority className="h-[26px] w-auto" />
          </Link>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              className="rounded-full p-2.5 text-[#1a3021] transition hover:bg-black/[0.04]"
              aria-label="Search"
            >
              <Icon icon="mingcute:search-line" className="size-[1.375rem]" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="rounded-full p-2.5 text-[#1a3021] transition hover:bg-black/[0.04]"
              aria-label="Cart"
            >
              <Icon icon="mingcute:shopping-bag-3-line" className="size-[1.375rem]" />
            </button>
          </div>
        </div>

        {/* Desktop header */}
        <div
          className={`${SITE_HEADER_GUTTERS} hidden h-[72px] items-center gap-3 py-4 sm:gap-4 lg:flex lg:gap-6`}
        >
          <Link href="/" className="flex h-[24px] w-[87px] shrink-0 items-center">
            <Image src="/furniqo-logo.svg" alt="Furniqo Logo" width={115} height={32} priority />
          </Link>

          <nav className="font-home-sub min-w-0 flex-1" aria-label="Main">
            <div className="mx-auto flex max-w-[min(26rem,100%)] flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#3d4a42] lg:max-w-[28rem] lg:gap-x-10 lg:text-xs">
              {nav.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative whitespace-nowrap transition-colors hover:text-[#1a3d2e]",
                      isActive ? "text-[#1a3d2e] font-semibold" : "text-[#3d4a42]"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#1a3d2e]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Search"
            >
              <Icon icon="mingcute:search-line" className="size-5 sm:size-6" />
            </button>
            <Link
              href="/login"
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Account"
            >
              <Icon icon="mingcute:user-3-line" className="size-5 sm:size-6" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
              aria-label="Cart"
            >
              <Icon icon="mingcute:shopping-bag-3-line" className="size-5 sm:size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-[visibility,opacity] duration-300",
          menuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-[#0c1a14]/55 backdrop-blur-[2px]"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(20rem,calc(100vw-3rem))] max-w-full flex-col bg-[#fffdf7] shadow-2xl transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Mobile main"
        >
          <div className="flex items-center justify-between border-b border-[#e8e9df] px-4 py-4">
            <span className="font-home-sub text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a3021]">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-[#1a3021] hover:bg-black/[0.04]"
              aria-label="Close menu"
            >
              <Icon icon="mingcute:close-line" className="size-6" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col gap-0 overflow-y-auto py-2">
            {nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "font-home-body block px-5 py-3.5 text-[15px] font-medium transition",
                      isActive ? "bg-[#f0ede6] text-[#1a3021]" : "text-[#1a3021] hover:bg-[#f0ede6]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-auto border-t border-[#e8e9df] pt-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="font-home-body flex items-center gap-3 px-5 py-3.5 text-[15px] font-medium text-[#3d5346] transition hover:bg-[#f0ede6]"
              >
                <Icon icon="mingcute:user-3-line" className="size-5" />
                Account
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
