"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import AnnouncementBar from "./AnnouncementBar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/cart/CartDrawer";
import SiteSearchPanel from "@/components/home/SiteSearchPanel";
import { useCart } from "@/contexts/CartContext";
import { DesktopMegaMenuPanel } from "@/components/home/DesktopMegaMenuPanel";
import { useStorefrontSession } from "@/hooks/useStorefrontSession";
import { prepareCartForSignOut } from "@/lib/cart/prepareCartForSignOut";

const navSecondary = [
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_GREEN = "#2D3B2D";

/** Matches hero / sections — keep gutters identical so hero copy lines up under the logo */
export const SITE_HEADER_GUTTERS = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useStorefrontSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileAccordionId, setMobileAccordionId] = useState("bedroom");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPanelKey, setSearchPanelKey] = useState(0);
  const { setCartOpen, totalQty } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openSearch = () => {
    setMegaOpen(false);
    setSearchPanelKey((k) => k + 1);
    setSearchOpen(true);
  };

  /** Shop all + mega: hover opens menu; click "Shop all" goes to product listing (`/products`). */
  const isShopPage = pathname === "/shop-all" || pathname === "/products";
  const shopActive = isShopPage && !megaOpen;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const closeDrawer = () => {
    setMenuOpen(false);
    setMobileShopOpen(false);
  };

  const toggleMobileMenu = () => {
    setMenuOpen((wasOpen) => {
      const next = !wasOpen;
      if (wasOpen) setMobileShopOpen(false);
      return next;
    });
  };

  const accountHref = user ? "/account/orders" : "/login";
  const accountActive = pathname?.startsWith("/account");

  const handleSignOut = async () => {
    await prepareCartForSignOut();
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
    closeDrawer();
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      {/* Mobile top bar */}
      <div className="border-b border-[#e8e9df] bg-white lg:border-[#D5D6C3] lg:bg-[#FFFDF4]">
        <div
          className={`${SITE_HEADER_GUTTERS} relative flex h-[3.75rem] items-center justify-between lg:hidden`}
        >
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={toggleMobileMenu}
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
              onClick={() => {
                openSearch();
                closeDrawer();
              }}
              className="rounded-full p-2.5 text-[#1a3021] transition hover:bg-black/[0.04]"
              aria-label="Search"
            >
              <Icon icon="mingcute:search-line" className="size-[1.375rem]" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2.5 text-[#1a3021] transition hover:bg-black/[0.04]"
              aria-label={mounted && totalQty > 0 ? `Cart, ${totalQty} items` : "Cart"}
            >
              <Icon icon="mingcute:shopping-bag-3-line" className="size-[1.375rem]" />
              {mounted && totalQty > 0 ? (
                <span className="absolute right-1 top-1 flex min-w-[1rem] items-center justify-center rounded-full bg-[#24352d] px-1 text-[9px] font-bold tabular-nums text-white">
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Desktop header + mega menu hover zone */}
        <div
          className="relative hidden lg:block"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className={`${SITE_HEADER_GUTTERS} flex h-[72px] items-center gap-3 py-4 sm:gap-4 lg:gap-6`}>
            <Link
              href="/"
              className="flex h-[24px] w-[87px] shrink-0 items-center"
              onMouseEnter={() => setMegaOpen(false)}
              onClick={() => setMegaOpen(false)}
            >
              <Image src="/furniqo-logo.svg" alt="Furniqo Logo" width={115} height={32} priority />
            </Link>

            <nav className="font-home-sub flex min-w-0 flex-1 justify-center" aria-label="Main">
              <div className="flex max-w-[min(28rem,100%)] flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-medium uppercase tracking-[0.14em] lg:gap-x-10 lg:text-xs">
                <div
                  onMouseEnter={() => setMegaOpen(true)}
                  className="relative"
                >
                  <Link
                    href="/products"
                    onClick={() => setMegaOpen(false)}
                    className={cn(
                      "relative whitespace-nowrap transition-colors hover:text-[#1a3d2e]",
                      shopActive ? "font-semibold text-[#1a3d2e]" : "text-[#3d4a42]"
                    )}
                  >
                    Shop all
                    {shopActive ? <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#1a3d2e]" /> : null}
                  </Link>
                </div>

                {navSecondary.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "#" && item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => setMegaOpen(false)}
                      onClick={() => setMegaOpen(false)}
                      className={cn(
                        "relative whitespace-nowrap transition-colors hover:text-[#1a3d2e]",
                        isActive ? "font-semibold text-[#1a3d2e]" : "text-[#3d4a42]"
                      )}
                    >
                      {item.label}
                      {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#1a3d2e]" />}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-3 sm:gap-5" onMouseEnter={() => setMegaOpen(false)}>
              <button
                type="button"
                onClick={openSearch}
                className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
                aria-label="Search"
              >
                <Icon icon="mingcute:search-line" className="size-5 sm:size-6" />
              </button>
              <Link
                href={accountHref}
                className={cn(
                  "relative rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]",
                  accountActive && "text-[#1a3d2e]"
                )}
                aria-label={user ? "My account" : "Sign in"}
              >
                <Icon icon="mingcute:user-3-line" className="size-5 sm:size-6" />
                {accountActive ? (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#1a3d2e]" aria-hidden />
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/5 hover:text-[#1a3d2e]"
                aria-label={mounted && totalQty > 0 ? `Cart, ${totalQty} items` : "Cart"}
              >
                <Icon icon="mingcute:shopping-bag-3-line" className="size-5 sm:size-6" />
                {mounted && totalQty > 0 ? (
                  <span className="absolute right-0 top-0 flex size-[18px] items-center justify-center rounded-full bg-[#24352d] text-[10px] font-bold tabular-nums text-white sm:size-5 sm:text-[11px]">
                    {totalQty > 99 ? "99+" : totalQty}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {megaOpen ? (
            <div className="relative -mt-px pt-px">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[45] h-3 -translate-y-2" aria-hidden />
              <div onMouseEnter={() => setMegaOpen(true)}>
                <DesktopMegaMenuPanel
                  guttersClassName={SITE_HEADER_GUTTERS}
                  onItemClick={() => setMegaOpen(false)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <SiteSearchPanel key={searchPanelKey} open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer: root list vs shop drill-down */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          "fixed inset-0 z-[60] transition-[visibility,opacity] duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-[#0c1a14]/55 backdrop-blur-[2px]"
          aria-label="Close menu"
          onClick={closeDrawer}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(100%,24rem)] max-w-full flex-col bg-[#F9F8F3] shadow-2xl transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#e8e9df] bg-white px-4 py-3.5">
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-lg p-2 text-[#333333] hover:bg-black/[0.04]"
              aria-label="Close menu"
            >
              <Icon icon="mingcute:close-line" className="size-6" />
            </button>
            <Link href="/" className="absolute left-1/2 flex h-[26px] -translate-x-1/2" onClick={closeDrawer}>
              <Image src="/furniqo-logo.svg" alt="Furniqo" width={115} height={32} className="h-[26px] w-auto" />
            </Link>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  openSearch();
                }}
                className="rounded-full p-2.5 text-[#333333]"
                aria-label="Search"
              >
                <Icon icon="mingcute:search-line" className="size-[1.35rem]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(true);
                  closeDrawer();
                }}
                className="relative rounded-full p-2.5 text-[#333333]"
                aria-label={mounted && totalQty > 0 ? `Cart, ${totalQty} items` : "Cart"}
              >
                <Icon icon="mingcute:shopping-bag-3-line" className="size-[1.35rem]" />
                {mounted && totalQty > 0 ? (
                  <span className="absolute right-0.5 top-0.5 flex min-w-[1rem] justify-center rounded-full bg-[#24352d] px-1 text-[9px] font-bold text-white">
                    {totalQty > 99 ? "99+" : totalQty}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {!mobileShopOpen ? (
              <>
                <nav className="flex-1 px-0 pt-2" aria-label="Mobile main">
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="font-home-sub flex w-full items-center justify-between px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#333333] transition hover:bg-black/[0.03]"
                  >
                    Shop all
                    <Icon icon="mingcute:arrow-right-line" className="size-5 shrink-0 text-[#333333]" aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen(true)}
                    className="font-home-sub flex w-full items-center justify-between border-t border-[#e8e9df] px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#333333] transition hover:bg-black/[0.03]"
                  >
                    Browse categories
                    <Icon icon="mingcute:right-line" className="size-5 shrink-0 text-[#333333]" aria-hidden />
                  </button>
                  {navSecondary.map((item) => {
                    const isActive =
                      pathname === item.href || (item.href !== "#" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={closeDrawer}
                        className={cn(
                          "font-home-sub block px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black/[0.03]",
                          isActive ? "text-[#1a3021]" : "text-[#333333]"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-[#e8e9df] bg-[#F9F8F3] px-5 pb-8 pt-6">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/account/orders"
                        onClick={closeDrawer}
                        className="font-home-sub flex h-12 w-full items-center justify-center rounded-lg text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
                        style={{ backgroundColor: MOBILE_GREEN }}
                      >
                        My account
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="font-home-sub flex h-12 w-full items-center justify-center rounded-lg border border-[#c9c4bb] bg-[#FDFCF8] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#333333] transition hover:bg-[#f5f2eb]"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeDrawer}
                        className="font-home-sub flex h-12 w-full items-center justify-center rounded-lg text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
                        style={{ backgroundColor: MOBILE_GREEN }}
                      >
                        Sign in
                      </Link>
                      <p className="mt-4 text-center font-home-body text-[13px] text-[#6b6b6b]">
                        Don&apos;t have an account?
                      </p>
                      <Link
                        href="/register"
                        onClick={closeDrawer}
                        className="font-home-sub mt-3 flex h-12 w-full items-center justify-center rounded-lg border border-[#c9c4bb] bg-[#FDFCF8] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#333333] transition hover:bg-[#f5f2eb]"
                      >
                        Create an account
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="shrink-0 px-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen(false)}
                    className="font-home-sub inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:text-[#333333]"
                  >
                    <Icon icon="mingcute:arrow-left-line" className="size-4" aria-hidden />
                    Back
                  </button>
                </div>

                <nav className="flex-1 px-0 pb-4" aria-label="Shop categories">
                  {MEGA_MENU_MOBILE_GROUPS.map((group) => {
                    const isExpanded = mobileAccordionId === group.id;
                    return (
                      <div key={group.id} className="border-b border-[#e8e9df]">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setMobileAccordionId(isExpanded ? "" : group.id)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                          <span
                            className={cn(
                              "font-home-body text-[15px] capitalize text-[#1a3021]",
                              isExpanded ? "font-semibold" : "font-medium"
                            )}
                          >
                            {group.title}
                          </span>
                          <Icon
                            icon="mingcute:minimize-line"
                            className="size-5 shrink-0 text-[#333333]"
                            aria-hidden
                          />
                        </button>
                        {isExpanded ? (
                          <ul className="space-y-2.5 px-5 pb-5 pl-8">
                            {group.links.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={closeDrawer}
                                  className="font-home-body text-[15px] text-[#333333] hover:underline"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href={group.showAllHref}
                                onClick={closeDrawer}
                                className="font-home-body text-[15px] font-medium text-[#1a3021] underline underline-offset-4"
                              >
                                Show all
                              </Link>
                            </li>
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-[#e8e9df] bg-[#F9F8F3] px-5 pb-8 pt-5">
                  <Link href={MEGA_MENU_PROMO.href} onClick={closeDrawer} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-[#e8e4dc]">
                      <Image
                        src={MEGA_MENU_PROMO.src}
                        alt={MEGA_MENU_PROMO.alt}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    </div>
                    <p className="mt-3 inline-flex items-center gap-1 font-home-body text-sm font-medium text-[#1a3021] underline underline-offset-4">
                      {MEGA_MENU_PROMO.title}
                      <Icon icon="mingcute:arrow-right-line" className="size-4" aria-hidden />
                    </p>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}
