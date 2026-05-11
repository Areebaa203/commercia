"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";
import { resolveSupabaseUserId } from "@/utils/supabase/resolveUserId";
import { useCart } from "@/contexts/CartContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const BG_PAGE = "#F9F7F2";
const FOREST = "#2D3E33";

function formatMoney(n) {
  return n.toFixed(2);
}

/** Avoid showing stale "Pending Stripe Payment" when `payment_status` in DB is already paid. */
function paymentMethodLabel(order) {
  const raw = order?.checkoutDetails?.paymentDisplay;
  const paid = order?.paymentStatus === "paid";
  if (paid) {
    if (raw && !/pending/i.test(raw)) return raw;
    return `Paid — Card — $${formatMoney(Number(order?.total ?? 0))}`;
  }
  if (order?.paymentStatus === "failed") {
    return raw && !/pending/i.test(raw) ? raw : "Payment failed";
  }
  return raw ?? "Pending payment";
}

function PolicyLinks() {
  return (
    <nav className="mt-12 flex flex-col items-center gap-2 border-t border-[#ebe6df] pt-8 font-home-body text-[11px] text-neutral-500 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
      <Link href="/faq" className="underline underline-offset-2 hover:text-neutral-800">
        Return policy
      </Link>
      <Link href="/faq" className="underline underline-offset-2 hover:text-neutral-800">
        Shipping policy
      </Link>
      <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-800">
        Privacy policy
      </Link>
      <Link href="/terms" className="underline underline-offset-2 hover:text-neutral-800">
        Terms of service
      </Link>
    </nav>
  );
}

export default function CheckoutConfirmationView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const { addItem } = useCart();

  const [order, setOrder] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!orderId) {
        router.replace("/checkout");
        return;
      }
      const supabase = createClient();
      const uid = await resolveSupabaseUserId(supabase);
      if (cancelled) return;

      /**
       * Stripe's success_url includes `session_id`. The storefront confirmation route
       * verifies the session with Stripe and runs `fulfillCheckoutSessionCompleted`
       * (sets `payment_status` + `checkout_details.paymentDisplay`). That must run for
       * **every** buyer who lands here after pay — including logged-in users. Previously
       * we only called `/api/account/orders`, which reads the DB as-is and left
       * "Pending Stripe Payment" when the webhook had not fired yet.
       */
      if (sessionId?.trim()) {
        if (uid) setUserId(uid);
        const res = await fetch(
          `/api/storefront/orders/${encodeURIComponent(orderId)}/confirmation?session_id=${encodeURIComponent(sessionId.trim())}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.success && json.data) {
          setOrder(json.data);
          setLoading(false);
          return;
        }
        if (uid) {
          const res2 = await fetch(`/api/account/orders/${encodeURIComponent(orderId)}`, {
            cache: "no-store",
          });
          const json2 = await res2.json();
          if (cancelled) return;
          if (res2.ok && json2.success && json2.data) {
            setOrder(json2.data);
            setLoading(false);
            return;
          }
          router.replace("/account/orders");
          return;
        }
        if (!cancelled) {
          setLoadError(
            json.message || "We could not verify your order. Try again from checkout or contact support."
          );
          setLoading(false);
        }
        return;
      }

      if (uid) {
        setUserId(uid);
        const res = await fetch(`/api/account/orders/${encodeURIComponent(orderId)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.success || !json.data) {
          router.replace("/account/orders");
          return;
        }
        setOrder(json.data);
        setLoading(false);
        return;
      }

      if (!cancelled) {
        setLoadError(
          "This confirmation link is incomplete. Use the link from your payment receipt email, or sign in to view your orders."
        );
        setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [orderId, sessionId, router]);

  const d = order?.checkoutDetails ?? {};
  const itemCount = order?.itemsCount ?? order?.lines?.reduce((s, l) => s + (l.qty ?? 0), 0) ?? 0;

  const handleBuyAgain = () => {
    if (!order?.lines) return;
    for (const line of order.lines) {
      addItem({
        slug: line.slug,
        name: line.name,
        image: line.image,
        price: line.price,
        compareAt: line.compareAt ?? line.price,
        variantLabel: line.variantLabel ?? null,
        qty: line.qty,
      });
    }
    router.push("/checkout");
  };

  const handleCancelOrder = async () => {
    if (!userId || !order?.id) return;
    try {
      await fetch(`/api/account/orders/${encodeURIComponent(order.id)}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    router.push("/account/orders");
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] px-4 py-16 font-home-body text-sm text-neutral-500" style={{ backgroundColor: BG_PAGE }}>
        Loading order…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 font-home-body text-sm" style={{ backgroundColor: BG_PAGE }}>
        <h1 className="font-home-heading text-xl text-[#1a3021]">We couldn&apos;t load this order</h1>
        <p className="mt-3 leading-relaxed text-neutral-600">{loadError}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold text-white"
            style={{ backgroundColor: FOREST }}
          >
            Back to checkout
          </Link>
          <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-300 px-6 text-sm font-medium text-[#1a3021]">
            Sign in
          </Link>
        </div>
        <PolicyLinks />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="pb-16 lg:pb-24" style={{ backgroundColor: BG_PAGE }}>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-home-heading text-[2rem] font-normal leading-[1.1] tracking-[-0.02em] text-[#1a3021] sm:text-[2.25rem] md:text-[2.5rem]">
          {userId ? "My account" : "Thank you"}
        </h1>

        <div className="mt-8 flex flex-col gap-4 border-b border-[#ebe6df] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={userId ? "/account/orders" : "/shop-all"}
              className="inline-flex items-center gap-2 font-home-body text-sm font-medium text-[#1a3021] transition hover:opacity-80"
            >
              <Icon icon="mingcute:arrow-left-line" className="size-5" aria-hidden />
              Order #{order.orderNumber}
            </Link>
            <p className="mt-1 font-home-body text-sm text-neutral-500">
              {userId ? (d.confirmedHeadline ?? "Order placed") : "Your order is confirmed."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
            <button
              type="button"
              onClick={handleBuyAgain}
              className="font-home-sub flex h-12 w-full items-center justify-center rounded-md px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-95 sm:w-auto"
              style={{ backgroundColor: FOREST }}
            >
              Buy again
            </button>
            {userId ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="font-home-sub flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#c9c4bb] bg-[#f2efea] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1a3021] transition hover:bg-[#ebe6df] sm:w-auto"
                  >
                    Manage
                    <Icon icon="mingcute:down-line" className="size-4" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 p-2 font-home-body text-sm">
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    className="w-full rounded-md px-3 py-2 text-left text-red-700 transition hover:bg-red-50"
                  >
                    Cancel order
                  </button>
                  <p className="px-3 py-2 text-xs text-neutral-500">Demo only — removes this order locally.</p>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            <section className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
              <p className="font-home-heading text-lg text-[#1a3021]">
                Expected {d.expectedDeliveryLabel ?? "—"}
              </p>
              {d.trackingNumber ? (
                <button
                  type="button"
                  className="mt-2 font-home-body text-sm underline underline-offset-2 hover:text-[#1a3021]"
                >
                  Track number {d.trackingNumber}
                </button>
              ) : null}
              <div className="mt-4 flex items-start gap-2 border-t border-[#eceae5] pt-4">
                <Icon icon="mingcute:check-circle-fill" className="mt-0.5 size-5 shrink-0 text-[#2d6a45]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-home-body text-sm font-semibold text-[#1a3021]">Confirmed</span>
                    <button type="button" className="text-neutral-400 hover:text-neutral-700" aria-label="Toggle details">
                      <Icon icon="mingcute:down-line" className="size-4" aria-hidden />
                    </button>
                  </div>
                  <p className="mt-0.5 font-home-body text-xs text-neutral-500">{d.timelineDetail ?? ""}</p>
                  <p className="mt-3 font-home-body text-sm leading-relaxed text-neutral-700">
                    {d.statusMessage ?? "We've accepted your order, and we're getting it ready."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
              <h2 className="font-home-heading text-lg text-[#1a3021]">Order details</h2>
              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-home-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Contact information
                    </h3>
                    <p className="mt-2 font-home-body text-sm text-neutral-800">{d.contactEmail ?? "—"}</p>
                    <p className="mt-1 font-home-body text-sm text-neutral-800">{d.contactPhone ?? "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-home-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Shipping address
                    </h3>
                    <div className="mt-2 space-y-0.5 font-home-body text-sm text-neutral-800">
                      {(d.shippingLines ?? []).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-home-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Shipping method
                    </h3>
                    <p className="mt-2 font-home-body text-sm text-neutral-800">{d.shippingMethod ?? "FedEx Ground"}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-home-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Payment method
                    </h3>
                    <div className="mt-2 flex items-center gap-2 font-home-body text-sm text-neutral-800">
                      <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-[#1a1f71] shadow-sm ring-1 ring-neutral-200">
                        VISA
                      </span>
                      {paymentMethodLabel(order)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-home-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Billing address
                    </h3>
                    <div className="mt-2 space-y-0.5 font-home-body text-sm text-neutral-800">
                      {(d.billingLines ?? d.shippingLines ?? []).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:sticky sm:top-28 sm:p-6">
              <h2 className="font-home-heading text-lg text-[#1a3021]">Order summary</h2>
              <ul className="mt-4 divide-y divide-[#e8e4dc]">
                {order.lines.map((line, idx) => (
                  <li key={`${line.slug}-${idx}`} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative size-[72px] shrink-0 overflow-hidden rounded-[4px] bg-[#ece7de] sm:size-20">
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                      />
                      <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-[#2D3E33] text-[10px] font-semibold text-white shadow-sm">
                        {line.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-home-heading text-[15px] leading-snug text-[#1a3021]">{line.name}</p>
                      {line.variantLabel ? (
                        <p className="mt-1 font-home-body text-xs text-neutral-600">{line.variantLabel}</p>
                      ) : null}
                      <p className="mt-2 text-right font-home-body text-sm font-semibold tabular-nums text-neutral-900">
                        ${formatMoney(line.price * line.qty)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-3 border-t border-[#e8e4dc] pt-4 font-home-body text-sm">
                <div className="flex justify-between gap-4 text-neutral-700">
                  <span>
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="tabular-nums">
                    ${formatMoney(order.lines.reduce((s, l) => s + l.price * l.qty, 0))}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-700">Shipping</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      (order.shippingCost ?? 0) === 0 ? "text-[#2d6a45]" : ""
                    )}
                  >
                    {(order.shippingCost ?? 0) === 0 ? "FREE" : `$${formatMoney(order.shippingCost ?? 0)}`}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-neutral-700">
                  <span>Discount</span>
                  <span className="tabular-nums">${formatMoney(order.discountAmount ?? 0)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#e8e4dc] pt-4 font-home-heading text-lg text-[#1a3021]">
                  <span>Total</span>
                  <span className="tabular-nums">${formatMoney(order.total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <PolicyLinks />
      </div>
    </div>
  );
}
