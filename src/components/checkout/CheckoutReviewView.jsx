"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { format, addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/contexts/CartContext";
import { createClient } from "@/utils/supabase/client";
import { shouldUseStripeHostedCheckout } from "@/lib/checkout/stripeHostedCheckout";
import { resolveSupabaseBrowserUser, resolveSupabaseUserId } from "@/utils/supabase/resolveUserId";

const BG_PAGE = "#F9F7F2";
const FOREST = "#2D3E33";
function formatMoney(n) {
  return n.toFixed(2);
}

const inputClass =
  "w-full rounded-md border border-neutral-300/90 bg-white px-3 py-2.5 font-home-body text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#2D3E33] focus:ring-2 focus:ring-[#2D3E33]/15";

const errorClass = "mt-1 block font-home-body text-xs text-red-600";

const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  address1: z.string().min(1, { message: "Address is required" }),
  address2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  region: z.string().min(1, { message: "Province / State is required" }),
  zip: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

function OrderSummaryPanel({ items, subtotal, shippingCost, discountAmount, total }) {
  const itemCount = items.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
      <h2 className="font-home-heading text-lg text-[#1a3021]">Order summary</h2>
      <ul className="mt-4 divide-y divide-[#e8e4dc]">
        {items.map((line) => (
          <li key={line.lineId} className="flex gap-4 py-4 first:pt-0">
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
              <p className="mt-2 font-home-body text-sm font-semibold tabular-nums text-neutral-900">
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
          <span className="tabular-nums">${formatMoney(discountAmount)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#e8e4dc] pt-4 font-home-heading text-lg text-[#1a3021]">
          <span>Total</span>
          <span className="tabular-nums">${formatMoney(total)}</span>
        </div>
      </div>
    </div>
  );
}

const CHECKOUT_FORM_DEFAULTS = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  zip: "",
  country: "Canada",
};

/** Normalize DB / modal country strings to checkout select values */
function mapStoredCountryToCheckout(stored) {
  const s = String(stored ?? "").trim();
  if (!s) return CHECKOUT_FORM_DEFAULTS.country;
  const u = s.toUpperCase();
  if (u === "US" || u === "USA" || u === "UNITED STATES") return "United States";
  if (u === "CA" || u === "CAN") return "Canada";
  if (s === "United States" || s === "Canada") return s;
  return CHECKOUT_FORM_DEFAULTS.country;
}

function PolicyLinks() {
  return (
    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-home-body text-[11px] text-neutral-500">
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

export default function CheckoutReviewView() {
  const router = useRouter();
  const { items, subtotal, totalQty, clearCart } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: CHECKOUT_FORM_DEFAULTS,
  });

  React.useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const fetchOpts = { credentials: "same-origin" };

    async function applyPrefill(user) {
      try {
        const [profileRes, addrRes] = await Promise.all([
          fetch("/api/settings/profile", fetchOpts),
          fetch("/api/account/addresses", fetchOpts),
        ]);
        const profileJson = await profileRes.json().catch(() => ({}));
        const addrJson = await addrRes.json().catch(() => ({}));

        const next = {
          ...CHECKOUT_FORM_DEFAULTS,
          email: user.email?.trim() || "",
          phone: "",
          firstName: "",
          lastName: "",
          address1: "",
          address2: "",
          city: "",
          region: "",
          zip: "",
          country: CHECKOUT_FORM_DEFAULTS.country,
        };

        if (profileJson.success && profileJson.data) {
          const p = profileJson.data;
          const rawName = (p.full_name || "").trim();
          const parts = rawName ? rawName.split(/\s+/) : [];
          next.firstName = parts[0] || "";
          next.lastName = parts.slice(1).join(" ") || "";
          next.phone = (p.phone || "").trim();
          if (!next.email && p.email) next.email = String(p.email).trim();
        }

        const addrs = addrJson.success && Array.isArray(addrJson.data) ? addrJson.data : [];
        if (addrs.length > 0) {
          const def = addrs.find((a) => a.is_default) || addrs[0];
          next.firstName = (def.first_name || "").trim() || next.firstName;
          next.lastName = (def.last_name || "").trim() || next.lastName;
          next.address1 = (def.address || "").trim() || next.address1;
          next.address2 = (def.apartment || "").trim() || next.address2;
          next.city = (def.city || "").trim() || next.city;
          next.region = (def.state || "").trim() || next.region;
          next.zip = (def.zip_code || "").trim() || next.zip;
          next.country = mapStoredCountryToCheckout(def.country);
          next.phone = (def.phone || "").trim() || next.phone;
        }

        reset(next);
      } catch (e) {
        console.error("[CheckoutReviewView] profile prefill", e);
        reset({
          ...CHECKOUT_FORM_DEFAULTS,
          email: user.email?.trim() || "",
        });
      }
    }

    (async () => {
      const user = await resolveSupabaseBrowserUser(supabase);
      if (cancelled) return;
      if (user) await applyPrefill(user);
      if (!cancelled) setMounted(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const u = session?.user ?? null;
      if (u) void applyPrefill(u);
      else reset(CHECKOUT_FORM_DEFAULTS);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [reset]);

  const shippingCost = React.useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12.99;
  }, [items.length, subtotal]);

  const discountAmount = 0;
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const onSubmit = async (data) => {
    setError("");

    const supabase = createClient();
    const uid = await resolveSupabaseUserId(supabase);

    setSubmitting(true);
    try {
      const shippingName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "—";
      const shippingLines = [
        shippingName,
        data.address1,
        data.address2,
        [data.city, data.region, data.zip].filter(Boolean).join(", "),
        data.country,
      ].filter((x) => x && String(x).trim());

      const billingLines = [...shippingLines];

      const expected = addDays(new Date(), 10);
      const tracking =
        typeof crypto !== "undefined" && crypto.getRandomValues
          ? Array.from(crypto.getRandomValues(new Uint8Array(8)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
          : `${Date.now()}`.slice(-12);

      const payload = {
        lines: items.map((line) => ({
          slug: line.slug,
          name: line.name,
          image: line.image,
          price: line.price,
          compareAt: line.compareAt,
          variantLabel: line.variantLabel,
          qty: line.qty,
        })),
        total: grandTotal,
        itemsCount: totalQty,
        shippingCost,
        discountAmount,
        checkoutDetails: {
          contactEmail: data.email.trim(),
          contactPhone: data.phone.trim() || "—",
          shippingName,
          shippingLines,
          billingLines,
          billingSame: true,
          shippingMethod: "FedEx Ground",
          paymentDisplay: "Pending Stripe Payment",
          expectedDeliveryLabel: format(expected, "MMM d"),
          trackingNumber: tracking,
          confirmedHeadline: `Confirmed ${format(new Date(), "MMM d, yyyy")}`,
          timelineDetail: `Updated ${format(new Date(), "MMM d")}`,
          statusMessage: "We've accepted your order, and we're getting it ready.",
        },
      };

      const orderEndpoint = uid ? "/api/account/orders" : "/api/storefront/guest-orders";
      const orderRes = await fetch(orderEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.success || !orderJson.data?.id) {
        throw new Error(orderJson.message || "Could not save your order");
      }
      const order = orderJson.data;

      /** Explicit opt-out only: normal checkout, including live production, goes through Stripe before confirmation. */
      if (!shouldUseStripeHostedCheckout() && uid) {
        clearCart();
        router.push(`/checkout/confirmation?orderId=${encodeURIComponent(order.id)}`);
        return;
      }

      // Call API to create Stripe Checkout Session
      const res = await fetch("/api/checkout/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: data.email.trim(),
          orderId: order.id
        }),
      });
      const { url, error: apiError } = await res.json();

      if (apiError || !url) {
        throw new Error(apiError || "Failed to initialize payment");
      }

      clearCart();
      // Redirect to Stripe Hosted Checkout
      window.location.href = url;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] px-4 py-16" style={{ backgroundColor: BG_PAGE }}>
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-10 rounded bg-neutral-200" />
          <div className="h-64 rounded bg-neutral-100" />
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
    <div className="pb-16 lg:pb-24" style={{ backgroundColor: BG_PAGE }}>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-home-heading text-[2rem] font-normal leading-[1.1] tracking-[-0.02em] text-[#1a3021] sm:text-[2.25rem] md:text-[2.5rem]">
          Checkout
        </h1>
        <p className="mt-2 max-w-2xl font-home-body text-sm text-neutral-600">
          Review your cart and delivery details. When you&apos;re ready, confirm your order.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          {/* Main column */}
          <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 space-y-6 lg:col-span-7">
            <details className="group overflow-hidden rounded-lg border border-[#ded8cc] bg-white/90 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-home-body text-sm [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-[#1a3021]">Order summary</span>
                <span className="flex items-center gap-2 tabular-nums font-semibold text-[#1a3021]">
                  ${formatMoney(grandTotal)}
                  <Icon
                    icon="mingcute:down-line"
                    className="size-4 shrink-0 transition group-open:rotate-180"
                    aria-hidden
                  />
                </span>
              </summary>
              <div className="border-t border-[#e8e4dc] px-4 pb-4 pt-2">
                <OrderSummaryPanel
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  discountAmount={discountAmount}
                  total={grandTotal}
                />
              </div>
            </details>

            <section className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
              <h2 className="font-home-heading text-lg text-[#1a3021]">Contact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={cn(inputClass, errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                    placeholder="you@example.com"
                  />
                  {errors.email && <span className={errorClass}>{errors.email.message}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Phone</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    {...register("phone")}
                    className={cn(inputClass, errors.phone && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <span className={errorClass}>{errors.phone.message}</span>}
                </label>
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
              <h2 className="font-home-heading text-lg text-[#1a3021]">Delivery</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">First name</span>
                  <input
                    type="text"
                    autoComplete="given-name"
                    {...register("firstName")}
                    className={cn(inputClass, errors.firstName && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.firstName && <span className={errorClass}>{errors.firstName.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Last name</span>
                  <input
                    type="text"
                    autoComplete="family-name"
                    {...register("lastName")}
                    className={cn(inputClass, errors.lastName && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.lastName && <span className={errorClass}>{errors.lastName.message}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Address</span>
                  <input
                    type="text"
                    autoComplete="street-address"
                    {...register("address1")}
                    className={cn(inputClass, errors.address1 && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.address1 && <span className={errorClass}>{errors.address1.message}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                    Apartment, suite (optional)
                  </span>
                  <input
                    type="text"
                    {...register("address2")}
                    className={cn(inputClass, errors.address2 && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.address2 && <span className={errorClass}>{errors.address2.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">City</span>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    {...register("city")}
                    className={cn(inputClass, errors.city && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.city && <span className={errorClass}>{errors.city.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                    Province / State
                  </span>
                  <input
                    type="text"
                    autoComplete="address-level1"
                    {...register("region")}
                    className={cn(inputClass, errors.region && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.region && <span className={errorClass}>{errors.region.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Postal code</span>
                  <input
                    type="text"
                    autoComplete="postal-code"
                    {...register("zip")}
                    className={cn(inputClass, errors.zip && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  />
                  {errors.zip && <span className={errorClass}>{errors.zip.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Country</span>
                  <select
                    {...register("country")}
                    className={cn(inputClass, "appearance-none", errors.country && "border-red-500 focus:border-red-500 focus:ring-red-500/15")}
                  >
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                  </select>
                  {errors.country && <span className={errorClass}>{errors.country.message}</span>}
                </label>
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8cc] bg-[#f2efea] p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-home-heading text-lg text-[#1a3021]">Shipping method</h2>
                  <p className="mt-1 font-home-body text-sm text-neutral-600">FedEx Ground · 3–5 business days</p>
                </div>
                <span className="font-home-body text-sm font-semibold text-[#2d6a45]">
                  {shippingCost === 0 ? "FREE" : `$${formatMoney(shippingCost)}`}
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8cc] bg-white p-4 sm:p-6">
              <h2 className="font-home-heading text-lg text-[#1a3021]">Payment</h2>
              <p className="mt-2 font-home-body text-sm text-neutral-600">
                You will be redirected to Stripe to securely complete your payment after confirming your order.
              </p>
            </section>

            {error ? (
              <p className="font-home-body text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/shop-all"
                className="font-home-body text-center text-sm text-neutral-600 underline underline-offset-2 hover:text-[#1a3021] sm:text-left"
              >
                Continue shopping
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="font-home-sub flex h-14 w-full items-center justify-center rounded-md px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs sm:shrink-0"
                style={{ backgroundColor: FOREST }}
              >
                {submitting ? "Confirming…" : "Confirm order"}
              </button>
            </div>
          </form>

          {/* Desktop summary */}
          <aside className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <OrderSummaryPanel
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discountAmount={discountAmount}
                total={grandTotal}
              />
            </div>
          </aside>
        </div>

        <footer className="mt-12 border-t border-[#eceae5] pt-8">
          <PolicyLinks />
        </footer>
      </div>
    </div>
  );
}
