"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/contexts/CartContext";

const BG_SUMMARY = "#F9F6F1";
const FOREST = "#24352d";

function formatMoney(n) {
  return n.toFixed(2);
}

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 font-home-body text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300/40";

function SectionTitle({ children, aside }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-home-heading text-lg text-[#1a3021] sm:text-xl">{children}</h2>
      {aside}
    </div>
  );
}

function ExpressCheckoutRow() {
  return (
    <div className="space-y-4">
      <p className="text-center font-home-body text-xs italic text-neutral-500">Express checkout</p>

      {/* Mobile: Shop Pay full width, then 3 buttons */}
      <div className="flex flex-col gap-3 lg:hidden">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-md bg-[#5A31F4] px-4 font-semibold text-white shadow-sm transition hover:bg-[#4d29cf]"
        >
          shop<span className="font-semibold">Pay</span>
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded-md bg-[#ffc439] text-[11px] font-bold uppercase text-neutral-900 shadow-sm transition hover:bg-[#f5bd30]"
          >
            PayPal
          </button>
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            Pay
          </button>
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            G Pay
          </button>
        </div>
      </div>

      {/* Desktop / large tablet: four buttons */}
      <div className="hidden gap-2 sm:gap-3 lg:grid lg:grid-cols-4">
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-md bg-[#ffc439] px-3 text-xs font-bold uppercase text-neutral-900 shadow-sm transition hover:bg-[#f5bd30]"
        >
          PayPal
        </button>
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-md bg-[#5A31F4] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4d29cf]"
        >
          shop<span className="font-semibold">Pay</span>
        </button>
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        >
          Apple&nbsp;Pay
        </button>
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        >
          Google&nbsp;Pay
        </button>
      </div>

      <div className="flex items-center gap-4 py-1">
        <div className="h-px flex-1 bg-neutral-300/90" />
        <span className="font-home-body text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          or
        </span>
        <div className="h-px flex-1 bg-neutral-300/90" />
      </div>
    </div>
  );
}

function OrderSummaryInner({
  items,
  subtotal,
  shippingCost,
  discountApplied,
  taxAmount,
  discountInput,
  onDiscountChange,
  onApplyDiscount,
}) {
  const totalBeforeDiscount = subtotal + shippingCost + taxAmount;

  return (
    <>
      <ul className="divide-y divide-[#e8e4dc]">
        {items.map((line) => (
          <li key={line.lineId} className="flex gap-4 py-5 first:pt-0">
            <div className="relative size-[76px] shrink-0 overflow-hidden rounded-[4px] bg-[#ece7de] sm:size-[88px]">
              <Image
                src={line.image}
                alt={line.name}
                fill
                className="object-contain p-1.5"
                sizes="88px"
              />
              <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-[#e8e4dc] text-[10px] font-semibold text-neutral-700">
                {line.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-home-heading text-[15px] leading-snug text-[#1a3021]">{line.name}</p>
              {line.variantLabel ? (
                <p className="mt-1 font-home-body text-xs text-neutral-600">{line.variantLabel}</p>
              ) : null}
              <p className="mt-2 font-home-body text-sm font-semibold tabular-nums text-neutral-900">
                ${formatMoney(line.price * line.qty)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Discount code"
          value={discountInput}
          onChange={(e) => onDiscountChange(e.target.value)}
          className={cn(inputClass, "flex-1 py-2")}
        />
        <button
          type="button"
          onClick={onApplyDiscount}
          className="font-home-sub shrink-0 rounded-md px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-95"
          style={{ backgroundColor: FOREST }}
        >
          Apply
        </button>
      </div>

      <div className="mt-8 space-y-3 border-t border-[#e8e4dc] pt-6 font-home-body text-sm">
        <div className="flex justify-between gap-4 text-neutral-700">
          <span>
            Subtotal ({items.reduce((s, l) => s + l.qty, 0)} items)
          </span>
          <span className="tabular-nums">${formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-700">Shipping</span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: shippingCost === 0 ? "#2d6a45" : undefined }}
          >
            {shippingCost === 0 ? "FREE" : `$${formatMoney(shippingCost)}`}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-neutral-700">
          <span>Discount</span>
          <span className="tabular-nums">${formatMoney(discountApplied)}</span>
        </div>
        <div className="flex justify-between gap-4 text-neutral-700">
          <span>Taxes</span>
          <span className="tabular-nums">${formatMoney(taxAmount)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#e8e4dc] pt-4 font-home-heading text-lg text-[#1a3021]">
          <span>Total</span>
          <span className="tabular-nums">${formatMoney(Math.max(0, totalBeforeDiscount - discountApplied))}</span>
        </div>
      </div>
    </>
  );
}

export default function CheckoutView() {
  const { items, subtotal, totalQty } = useCart();
  const [mounted, setMounted] = React.useState(false);

  const [deliveryMethod, setDeliveryMethod] = React.useState("ship");
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [billingSame, setBillingSame] = React.useState(true);

  const [discountInput, setDiscountInput] = React.useState("");
  const [discountApplied, setDiscountApplied] = React.useState(0);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? 12 : 0;
  const taxAmount = 0;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const grandTotal = Math.max(0, subtotal + shippingCost + taxAmount - discountApplied);

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    if (code === "SAVE10") setDiscountApplied(10);
    else if (code === "SAVE5") setDiscountApplied(5);
    else setDiscountApplied(0);
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-white px-4 py-16">
        <div className="mx-auto max-w-xl animate-pulse space-y-4">
          <div className="h-8 rounded bg-neutral-200" />
          <div className="h-40 rounded bg-neutral-100" />
          <div className="h-32 rounded bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center lg:py-24">
        <Icon icon="mingcute:shopping-bag-3-line" className="mx-auto size-14 text-neutral-400" aria-hidden />
        <h1 className="font-home-heading mt-6 text-2xl text-[#1a3021]">Your cart is empty</h1>
        <p className="mt-3 font-home-body text-sm leading-relaxed text-neutral-600">
          Add items before checkout, or continue browsing the shop.
        </p>
        <Link
          href="/shop-all"
          className="font-home-sub mt-8 inline-flex h-12 items-center justify-center rounded-md px-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-95"
          style={{ backgroundColor: FOREST }}
        >
          Shop products
        </Link>
      </main>
    );
  }

  return (
    <div className="bg-white pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start lg:gap-12 lg:px-8 xl:gap-16">
        {/* Mobile: collapsible order summary */}
        <details className="group mb-6 overflow-hidden rounded-lg border border-[#e8e4dc] bg-[#faf9f6] lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-home-body text-sm [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2 font-medium text-[#1a3021]">
              Show order summary
              <Icon
                icon="mingcute:down-line"
                className="size-4 shrink-0 transition group-open:rotate-180"
                aria-hidden
              />
            </span>
            <span className="font-semibold tabular-nums text-[#1a3021]">${formatMoney(grandTotal)}</span>
          </summary>
          <div className="border-t border-[#e8e4dc] px-4 pb-6 pt-2">
            <OrderSummaryInner
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              discountApplied={discountApplied}
              taxAmount={taxAmount}
              discountInput={discountInput}
              onDiscountChange={setDiscountInput}
              onApplyDiscount={handleApplyDiscount}
            />
          </div>
        </details>

        {/* Left column — form */}
        <main className="min-w-0 lg:border-r-0 lg:pb-12 xl:pr-4">
          <ExpressCheckoutRow />

          {/* Contact */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <SectionTitle aside={<Link href="/login" className="font-home-body text-sm text-neutral-600 underline underline-offset-2 hover:text-[#1a3021]">Sign in</Link>}>
              Contact
            </SectionTitle>
            <label className="block">
              <span className="sr-only">Email</span>
              <input type="email" autoComplete="email" placeholder="Email" className={inputClass} />
            </label>
            <label className="mt-4 flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
              <input type="checkbox" className="mt-1 size-4 rounded border-neutral-300 accent-[#24352d]" defaultChecked />
              <span>Sign up for exclusive offers, expert tips and daily inspiration.</span>
            </label>
          </section>

          {/* Delivery methods */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <SectionTitle>Delivery methods</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeliveryMethod("ship")}
                className={cn(
                  "flex items-start gap-3 rounded-md border px-4 py-4 text-left transition",
                  deliveryMethod === "ship"
                    ? "border-[#1a3021] bg-[#faf9f6] shadow-sm"
                    : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 rounded-full border-2",
                    deliveryMethod === "ship" ? "border-[#1a3021]" : "border-neutral-300"
                  )}
                >
                  {deliveryMethod === "ship" ? (
                    <span className="m-auto block size-2 rounded-full bg-[#1a3021]" />
                  ) : null}
                </span>
                <span className="flex flex-1 items-start justify-between gap-3">
                  <span className="font-home-heading text-base text-[#1a3021]">Ship</span>
                  <Icon icon="mingcute:truck-line" className="size-6 shrink-0 text-neutral-600" aria-hidden />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("pickup")}
                className={cn(
                  "flex items-start gap-3 rounded-md border px-4 py-4 text-left transition",
                  deliveryMethod === "pickup"
                    ? "border-[#1a3021] bg-[#faf9f6] shadow-sm"
                    : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 rounded-full border-2",
                    deliveryMethod === "pickup" ? "border-[#1a3021]" : "border-neutral-300"
                  )}
                >
                  {deliveryMethod === "pickup" ? (
                    <span className="m-auto block size-2 rounded-full bg-[#1a3021]" />
                  ) : null}
                </span>
                <span className="flex flex-1 items-start justify-between gap-3">
                  <span className="font-home-heading text-base text-[#1a3021]">Pick up</span>
                  <Icon icon="mingcute:store-2-line" className="size-6 shrink-0 text-neutral-600" aria-hidden />
                </span>
              </button>
            </div>
          </section>

          {/* Delivery address */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <SectionTitle>Delivery</SectionTitle>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                  Country / Region
                </span>
                <select className={cn(inputClass, "appearance-none")} defaultValue="US">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">First name</span>
                  <input type="text" autoComplete="given-name" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Last name</span>
                  <input type="text" autoComplete="family-name" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Address</span>
                <span className="relative block">
                  <Icon
                    icon="mingcute:search-line"
                    className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
                    aria-hidden
                  />
                  <input type="text" autoComplete="street-address" className={cn(inputClass, "pl-11")} placeholder="Street address" />
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                  Apartment, suite, etc. (optional)
                </span>
                <input type="text" className={inputClass} />
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block sm:col-span-1">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">City</span>
                  <input type="text" autoComplete="address-level2" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">State</span>
                  <select className={inputClass} defaultValue="CA">
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">ZIP code</span>
                  <input type="text" autoComplete="postal-code" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 font-home-body text-xs font-medium text-neutral-600">
                  Phone
                  <Icon icon="mingcute:question-line" className="size-4 text-neutral-400" aria-label="More info" />
                </span>
                <input type="tel" autoComplete="tel" className={inputClass} />
              </label>
              <label className="flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
                <input type="checkbox" className="mt-1 size-4 rounded border-neutral-300 accent-[#24352d]" />
                <span>Get exclusive offers, wellness tips straight to your WhatsApp!</span>
              </label>
            </div>
          </section>

          {/* Shipping method placeholder */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <SectionTitle>Shipping method</SectionTitle>
            <div className="rounded-md border border-dashed border-neutral-300 bg-[#faf9f6] px-4 py-10 text-center font-home-body text-sm text-neutral-500">
              Enter your shipping address to view available shipping methods.
            </div>
          </section>

          {/* Payment */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <div className="mb-6">
              <h2 className="font-home-heading text-lg text-[#1a3021] sm:text-xl">Payment</h2>
              <p className="mt-1 font-home-body text-sm text-neutral-600">
                All transactions are secured and encrypted.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex w-full flex-col rounded-md border px-4 py-4 text-left transition",
                  paymentMethod === "card" ? "border-[#1a3021] bg-[#faf9f6]" : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 rounded-full border-2",
                        paymentMethod === "card" ? "border-[#1a3021]" : "border-neutral-300"
                      )}
                    >
                      {paymentMethod === "card" ? (
                        <span className="m-auto block size-2 rounded-full bg-[#1a3021]" />
                      ) : null}
                    </span>
                    <span className="font-home-heading text-[#1a3021]">Credit or debit card</span>
                  </span>
                  <span className="flex gap-1">
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#1a1f71] shadow-sm">VISA</span>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#eb001b] shadow-sm">MC</span>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#006fcf] shadow-sm">AMEX</span>
                  </span>
                </span>
                {paymentMethod === "card" ? (
                  <div className="mt-4 space-y-4 border-t border-[#e8e4dc] pt-4 pl-7">
                    <label className="block">
                      <span className="mb-1.5 flex items-center gap-2 font-home-body text-xs font-medium text-neutral-600">
                        Card number
                        <Icon icon="mingcute:lock-fill" className="size-3.5 text-neutral-400" aria-hidden />
                      </span>
                      <input type="text" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className={inputClass} />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Expiration (MM / YY)</span>
                        <input type="text" autoComplete="cc-exp" placeholder="MM / YY" className={inputClass} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Security code</span>
                        <input type="text" autoComplete="cc-csc" placeholder="CVV" className={inputClass} />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Name on card</span>
                      <input type="text" autoComplete="cc-name" className={inputClass} />
                    </label>
                  </div>
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition",
                  paymentMethod === "paypal" ? "border-[#1a3021] bg-[#faf9f6]" : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 rounded-full border-2",
                    paymentMethod === "paypal" ? "border-[#1a3021]" : "border-neutral-300"
                  )}
                >
                  {paymentMethod === "paypal" ? <span className="m-auto block size-2 rounded-full bg-[#1a3021]" /> : null}
                </span>
                <span className="font-home-heading text-[#1a3021]">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("apple")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition",
                  paymentMethod === "apple" ? "border-[#1a3021] bg-[#faf9f6]" : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 rounded-full border-2",
                    paymentMethod === "apple" ? "border-[#1a3021]" : "border-neutral-300"
                  )}
                >
                  {paymentMethod === "apple" ? <span className="m-auto block size-2 rounded-full bg-[#1a3021]" /> : null}
                </span>
                <span className="font-home-heading text-[#1a3021]">Apple Pay</span>
              </button>
            </div>
          </section>

          {/* Billing */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <SectionTitle>Billing address</SectionTitle>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3 font-home-body text-sm">
                <input
                  type="radio"
                  name="billing"
                  checked={billingSame}
                  onChange={() => setBillingSame(true)}
                  className="size-4 accent-[#24352d]"
                />
                Same as shipping address
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3 font-home-body text-sm">
                <input
                  type="radio"
                  name="billing"
                  checked={!billingSame}
                  onChange={() => setBillingSame(false)}
                  className="size-4 accent-[#24352d]"
                />
                Use a different billing address
              </label>
            </div>
          </section>

          {/* Remember */}
          <section className="mt-8 rounded-md border border-[#e8e4dc] bg-[#faf9f6] px-4 py-4">
            <label className="flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
              <input type="checkbox" className="mt-1 size-4 rounded border-neutral-300 accent-[#24352d]" />
              <span className="flex flex-1 flex-wrap items-center gap-2">
                Save my information for a faster checkout
                <span className="rounded bg-[#5A31F4]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5A31F4]">
                  shopPay
                </span>
              </span>
            </label>
          </section>

          {/* Primary CTA — left column on large screens (matches desktop checkout mock) */}
          <div className="mt-10 border-t border-[#eceae5] pt-10">
            <CheckoutFooterActions grandTotal={grandTotal} totalQty={totalQty} />
          </div>

          <footer className="mt-10 hidden border-t border-[#eceae5] pt-8 lg:block">
            <PolicyLinks />
          </footer>
        </main>

        {/* Right column — desktop summary */}
        <aside
          className="relative hidden min-h-0 border-l border-[#e8e4dc] lg:block lg:bg-[#F9F6F1] lg:pl-10 xl:pl-12"
          style={{ backgroundColor: BG_SUMMARY }}
        >
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-10 pt-6 lg:top-[5.5rem]">
            <div className="px-2 sm:px-4">
              <OrderSummaryInner
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discountApplied={discountApplied}
                taxAmount={taxAmount}
                discountInput={discountInput}
                onDiscountChange={setDiscountInput}
                onApplyDiscount={handleApplyDiscount}
              />
            </div>
          </div>
        </aside>

        {/* Mobile footer links */}
        <footer className="mt-8 border-t border-[#eceae5] pt-8 lg:hidden">
          <PolicyLinks />
        </footer>
      </div>
    </div>
  );
}

function CheckoutFooterActions({ grandTotal, totalQty, className }) {
  return (
    <div className={cn("space-y-4", className)}>
      <button
        type="button"
        className="font-home-sub flex h-14 w-full items-center justify-center rounded-md text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-95"
        style={{ backgroundColor: FOREST }}
      >
        Place order
      </button>
      <p className="text-center font-home-body text-[11px] text-neutral-500 lg:hidden">
        {totalQty} {totalQty === 1 ? "item" : "items"} · Estimated total ${formatMoney(grandTotal)}
      </p>
    </div>
  );
}

function PolicyLinks() {
  return (
    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-home-body text-[11px] text-neutral-500">
      <Link href="#" className="underline underline-offset-2 hover:text-neutral-800">
        Return policy
      </Link>
      <Link href="#" className="underline underline-offset-2 hover:text-neutral-800">
        Privacy policy
      </Link>
      <Link href="#" className="underline underline-offset-2 hover:text-neutral-800">
        Terms of service
      </Link>
    </nav>
  );
}
