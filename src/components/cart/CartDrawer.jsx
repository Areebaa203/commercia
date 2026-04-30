"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/contexts/CartContext";
import { ALL_SHOP_PRODUCTS } from "@/components/shop-all/shopAllData";

const BG = "#FCFBF7";
const FOOTER_BG = "#f5f2eb";
const FOREST = "#24352d";
const TRACK = "#e5e0d6";
const GREEN = "#2d6a45";
const GREEN_BRIGHT = "#3d8c5a";

function formatMoney(n) {
  return n.toFixed(2);
}

export default function CartDrawer() {
  const {
    items,
    subtotal,
    totalQty,
    cartOpen,
    setCartOpen,
    updateQty,
    removeLine,
  } = useCart();

  const empty = items.length === 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingMet = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPct = shippingMet
    ? 100
    : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const cartSlugs = React.useMemo(() => new Set(items.map((i) => i.slug)), [items]);
  const recommendations = React.useMemo(() => {
    const pool = ALL_SHOP_PRODUCTS.filter((p) => !cartSlugs.has(p.slug));
    const pairs = pool[0];
    const also = pool.find((p) => p.slug !== pairs?.slug) ?? pool[1];
    return { pairs, also };
  }, [cartSlugs]);

  return (
    <DialogPrimitive.Root open={cartOpen} onOpenChange={setCartOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-300"
          )}
        />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          style={{ backgroundColor: BG }}
          className={cn(
            "fixed inset-y-0 right-0 z-[70] flex h-full w-full flex-col shadow-2xl outline-none",
            "max-w-full border-l border-[#e8e4dc]",
            "md:max-w-[min(520px,47vw)]",
            "lg:max-w-[min(560px,38vw)]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200"
          )}
        >
          {/* Header — fixed */}
          <div className="shrink-0 border-b border-[#e8e4dc] px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
            <div className="flex items-start justify-between gap-3">
              <DialogPrimitive.Title className="font-home-heading text-xl leading-tight tracking-tight text-[#1a3021] sm:text-2xl">
                {empty ? (
                  "Your bag"
                ) : (
                  <>
                    Your bag{" "}
                    <span className="font-normal text-neutral-500">|</span>{" "}
                    <span className="text-[0.92em] font-normal tabular-nums">{totalQty} items</span>
                  </>
                )}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/[0.04] hover:text-[#1a3021]"
                  aria-label="Close cart"
                >
                  <Icon icon="mingcute:close-line" className="size-6" />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Free shipping */}
            <div className="mt-4">
              {shippingMet ? (
                <>
                  <p className="flex items-center gap-2 font-home-body text-sm text-[#1a3021]">
                    <Icon icon="mingcute:check-circle-fill" className="size-5 shrink-0" style={{ color: GREEN }} />
                    <span>You&apos;re getting free shipping!</span>
                  </p>
                  <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: TRACK }}
                  >
                    <div className="h-full w-full rounded-full" style={{ backgroundColor: GREEN_BRIGHT }} />
                  </div>
                </>
              ) : (
                <>
                  <p className="font-home-body text-sm text-neutral-700">
                    You&apos;re{" "}
                    <span className="font-semibold tabular-nums">${formatMoney(remaining)}</span> away from free
                    shipping
                  </p>
                  <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: TRACK }}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: GREEN,
                        minWidth: progressPct > 0 ? "4px" : undefined,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {empty ? (
            <>
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-8">
                <p className="font-home-heading text-center text-lg text-neutral-600 sm:text-xl">
                  Your cart is empty
                </p>
              </div>
              <div className="shrink-0 px-4 pb-6 pt-2 sm:px-5 sm:pb-8" style={{ backgroundColor: FOOTER_BG }}>
                <Link
                  href="/shop-all"
                  onClick={() => setCartOpen(false)}
                  className="font-home-sub flex h-14 w-full items-center justify-center rounded-sm px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-95"
                  style={{ backgroundColor: FOREST }}
                >
                  Shop products
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 sm:px-5">
                <ul className="divide-y divide-[#e8e4dc]">
                  {items.map((line) => (
                    <li key={line.lineId} className="flex gap-3 py-5 first:pt-4">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="relative size-[88px] shrink-0 overflow-hidden rounded-[2px] bg-[#ece7de] sm:size-[100px]"
                      >
                        <Image src={line.image} alt={line.name} fill className="object-contain p-1.5" sizes="100px" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-home-heading text-[15px] leading-snug text-[#1a3021] sm:text-base">
                              {line.name}
                            </p>
                            {line.variantLabel ? (
                              <p className="mt-1 font-home-body text-xs text-neutral-600">{line.variantLabel}</p>
                            ) : null}
                            <p className="mt-2 flex flex-wrap items-baseline gap-2">
                              <span className="text-sm font-semibold tabular-nums text-neutral-900">
                                ${formatMoney(line.price)}
                              </span>
                              {line.compareAt > line.price ? (
                                <span className="text-sm tabular-nums text-neutral-400 line-through">
                                  ${formatMoney(line.compareAt)}
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded p-1.5 text-neutral-400 transition hover:bg-black/[0.04] hover:text-neutral-700"
                            aria-label={`Remove ${line.name}`}
                            onClick={() => removeLine(line.lineId)}
                          >
                            <Icon icon="mingcute:delete-2-line" className="size-5" />
                          </button>
                        </div>
                        <div className="mt-3 inline-flex items-center rounded-full border border-neutral-300/90 bg-white px-1">
                          <button
                            type="button"
                            className="rounded-full p-2 text-neutral-700 hover:bg-neutral-50"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.lineId, line.qty - 1)}
                          >
                            <Icon icon="mingcute:subtract-fill" className="size-4" />
                          </button>
                          <span className="min-w-[2rem] text-center font-home-body text-sm tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            className="rounded-full p-2 text-neutral-700 hover:bg-neutral-50"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.lineId, line.qty + 1)}
                          >
                            <Icon icon="mingcute:add-line" className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 border-t border-[#e8e4dc] pt-5">
                  <div className="flex justify-between gap-4 font-home-body text-sm">
                    <span className="text-neutral-700">
                      Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold tabular-nums text-neutral-900">${formatMoney(subtotal)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4 font-home-body text-sm">
                    <span className="text-neutral-700">Shipping</span>
                    <span
                      className={shippingMet ? "font-semibold" : "text-neutral-500"}
                      style={{ color: shippingMet ? GREEN : undefined }}
                    >
                      {shippingMet ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4 font-home-body text-sm">
                    <span className="text-neutral-700">Discount</span>
                    <span className="italic text-neutral-400">Apply at checkout</span>
                  </div>
                </div>

                {!empty && (recommendations.pairs || recommendations.also) ? (
                  <div className="mt-10 space-y-10 border-t border-[#e8e4dc] pt-8">
                    {recommendations.pairs ? (
                      <CrossSellBlock
                        title="Pairs perfectly with"
                        product={recommendations.pairs}
                        onClose={() => setCartOpen(false)}
                      />
                    ) : null}
                    {recommendations.also ? (
                      <CrossSellBlock
                        title="You may also like"
                        product={recommendations.also}
                        onClose={() => setCartOpen(false)}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 border-t border-[#e8e4dc] px-4 pb-6 pt-4 sm:px-5" style={{ backgroundColor: FOOTER_BG }}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-home-heading text-lg text-[#1a3021]">Estimated total</span>
                  <span className="font-home-body text-xl font-semibold tabular-nums text-neutral-900">
                    ${formatMoney(subtotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="font-home-sub mt-4 flex h-14 w-full items-center justify-center rounded-sm text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-95"
                  style={{ backgroundColor: FOREST }}
                >
                  Checkout
                </Link>
                <p className="mx-auto mt-4 max-w-[280px] text-center font-home-body text-[10px] leading-relaxed text-neutral-500 sm:max-w-none sm:text-[11px]">
                  By continuing, I confirm that I have read and accept the{" "}
                  <Link href="#" className="underline underline-offset-2 hover:text-neutral-700">
                    Terms of Service
                  </Link>{" "}
                  and the{" "}
                  <Link href="#" className="underline underline-offset-2 hover:text-neutral-700">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CrossSellBlock({ title, product, onClose }) {
  const { addItem } = useCart();
  return (
    <div>
      <p className="font-home-sub text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a3021] sm:text-[11px]">
        {title}
      </p>
      <div className="mt-4 flex gap-3 rounded-sm border border-[#e8e4dc] bg-[#faf8f4] p-3">
        <Link
          href={`/products/${product.slug}`}
          onClick={onClose}
          className="relative size-20 shrink-0 overflow-hidden rounded-[2px] bg-[#ece7de]"
        >
          <Image src={product.image} alt={product.name} fill className="object-contain p-1.5" sizes="80px" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/products/${product.slug}`} onClick={onClose} className="font-home-heading text-sm text-[#1a3021]">
            {product.name}
          </Link>
          <p className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold tabular-nums">${formatMoney(product.price)}</span>
            <span className="text-xs tabular-nums text-neutral-400 line-through">${formatMoney(product.compareAt)}</span>
          </p>
          <button
            type="button"
            className="font-home-sub mt-2 rounded-sm border border-neutral-300 bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a3021] transition hover:bg-neutral-50"
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                compareAt: product.compareAt,
                variantLabel: null,
                qty: 1,
              })
            }
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
