"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { resolveSupabaseUserId } from "@/utils/supabase/resolveUserId";

const BG_PAGE = "#F9F7F2";
const BG_SUMMARY = "#f0ebe3";
const FOREST = "#2D3E33";

const TOOLTIP_SURFACE = "border-0 bg-[#2D3E33] font-home-body text-white shadow-lg";

const PICKUP_LOCATIONS = [
  {
    id: "downtown",
    title: "Store Pickup - Downtown",
    address: "123 Main Street, Downtown City",
    ready: "Usually ready in 1 hour",
  },
  {
    id: "midtown",
    title: "Store Pickup - Midtown",
    address: "56 Center Avenue, Midtown City",
    ready: "Usually ready in 1 hour",
  },
  {
    id: "uptown",
    title: "Store Pickup - Uptown",
    address: "789 High Street, Uptown City",
    ready: "Usually ready in 2 hours",
  },
  {
    id: "eastside",
    title: "Store Pickup - Eastside",
    address: "1011 East Boulevard, Eastside City",
    ready: "Usually ready in 4 hours",
  },
];

function formatMoney(n) {
  return n.toFixed(2);
}

const inputClass =
  "w-full rounded-md border border-neutral-300/90 bg-white px-3 py-2.5 font-home-body text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#2D3E33] focus:ring-2 focus:ring-[#2D3E33]/15";

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

      {/* Small phones: Shop Pay full width, then PayPal / Apple / Google */}
      <div className="flex flex-col gap-3 md:hidden">
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
            className="flex h-11 items-center justify-center rounded-md bg-[#1b4332] text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#163529]"
          >
            G Pay
          </button>
        </div>
      </div>

      {/* Tablet: 2×2 · Desktop: one row of four */}
      <div className="hidden grid-cols-2 gap-2 sm:gap-3 md:grid lg:grid-cols-4 lg:gap-3">
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
          className="flex h-12 items-center justify-center rounded-md bg-[#1b4332] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#163529]"
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

function PickupAddressSection({ selectedId, onSelect }) {
  return (
    <section className="mt-10 border-t border-[#eceae5] pt-10">
      <SectionTitle>Pick up address</SectionTitle>
      <div className="space-y-3">
        {PICKUP_LOCATIONS.map((loc) => {
          const selected = selectedId === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-md border px-4 py-4 text-left transition",
                selected
                  ? "border-[#1a3021] bg-[#faf9f6] shadow-sm"
                  : "border-neutral-300 bg-white hover:border-neutral-400"
              )}
            >
              <span
                className={cn(
                  "mt-1 flex size-4 shrink-0 rounded-full border-2",
                  selected ? "border-[#1a3021]" : "border-neutral-300"
                )}
              >
                {selected ? <span className="m-auto block size-2 rounded-full bg-[#1a3021]" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-home-heading text-[15px] leading-snug text-[#1a3021]">{loc.title}</p>
                <p className="mt-0.5 font-home-body text-xs text-neutral-600">{loc.address}</p>
                <p className="mt-1 font-home-body text-xs text-neutral-500">{loc.ready}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="block font-home-body text-sm font-semibold text-[#2d6a45]">FREE</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function OrderSummaryInner({
  items,
  subtotal,
  shippingCost,
  discountAmount,
  appliedDiscountLabel,
  onRemoveDiscount,
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

      {appliedDiscountLabel && discountAmount > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ec] py-1 pl-3 pr-1 font-home-body text-xs font-medium text-[#1a4d2e]">
            {appliedDiscountLabel}
            <button
              type="button"
              onClick={onRemoveDiscount}
              className="rounded-full p-1 text-[#1a4d2e]/80 transition hover:bg-black/[0.06]"
              aria-label="Remove discount"
            >
              <Icon icon="mingcute:close-line" className="size-3.5" />
            </button>
          </span>
        </div>
      ) : null}

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
        {discountAmount > 0 ? (
          <div className="flex justify-between gap-4 text-[#1a4d2e]">
            <span>Discount</span>
            <span className="font-medium tabular-nums">−${formatMoney(discountAmount)}</span>
          </div>
        ) : null}
        {taxAmount > 0 ? (
          <div className="flex justify-between gap-4 text-neutral-700">
            <span>Taxes</span>
            <span className="tabular-nums">${formatMoney(taxAmount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-[#e8e4dc] pt-4 font-home-heading text-lg text-[#1a3021]">
          <span>Total</span>
          <span className="tabular-nums">
            ${formatMoney(Math.max(0, totalBeforeDiscount - discountAmount))}
          </span>
        </div>
      </div>
    </>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, totalQty, clearCart } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [placeError, setPlaceError] = React.useState("");

  const [deliveryMethod, setDeliveryMethod] = React.useState("ship");
  const [pickupLocationId, setPickupLocationId] = React.useState(PICKUP_LOCATIONS[0].id);
  const [shippingRate, setShippingRate] = React.useState("fedex");
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [billingSame, setBillingSame] = React.useState(true);

  const [discountInput, setDiscountInput] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState(null);

  const [saveShopAccount, setSaveShopAccount] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [formData, setFormData] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "CA",
    zipCode: "",
    phone: "",
    country: "US"
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const discountAmount = appliedDiscount?.amount ?? 0;
  const appliedDiscountLabel = appliedDiscount?.label ?? null;

  const shippingCost = React.useMemo(() => {
    if (items.length === 0) return 0;
    if (deliveryMethod === "pickup") return 0;
    return shippingRate === "usps" ? 10 : 0;
  }, [items.length, deliveryMethod, shippingRate]);

  const taxAmount = 0;

  React.useEffect(() => {
    setMounted(true);
    (async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        setFormData(prev => ({ ...prev, email: authUser.email }));
        
        try {
          // Fetch profile first for name/phone fallback
          const profileRes = await fetch("/api/settings/profile");
          const profileJson = await profileRes.json();
          if (profileJson.success && profileJson.data) {
            const p = profileJson.data;
            const names = (p.full_name || "").split(" ");
            setFormData(prev => ({
              ...prev,
              firstName: names[0] || "",
              lastName: names.slice(1).join(" ") || "",
              phone: p.phone || prev.phone
            }));
          }

          const res = await fetch("/api/account/addresses");
          const json = await res.json();
          if (json.success && json.data && json.data.length > 0) {
            const def = json.data.find(a => a.is_default) || json.data[0];
            setFormData({
              email: authUser.email,
              firstName: def.first_name || "",
              lastName: def.last_name || "",
              address: def.address || "",
              apartment: def.apartment || "",
              city: def.city || "",
              state: def.state || "CA",
              zipCode: def.zip_code || "",
              phone: def.phone || "",
              country: def.country || "US"
            });
          } else {
            // Fallback to profile data if no addresses are saved
            try {
              const profRes = await fetch("/api/settings/profile");
              const profJson = await profRes.json();
              if (profJson.success && profJson.data) {
                const fullName = profJson.data.full_name || "";
                const nameParts = fullName.split(" ");
                setFormData(prev => ({
                  ...prev,
                  firstName: nameParts[0] || "",
                  lastName: nameParts.slice(1).join(" ") || "",
                  phone: profJson.data.phone || ""
                }));
              }
            } catch (err) {
              console.error("Error fetching profile fallback:", err);
            }
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
        }
      }
    })();
  }, []);

  const grandTotal = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

  const handlePlaceOrder = async () => {
    setPlaceError("");
    const supabase = createClient();
    const uid = await resolveSupabaseUserId(supabase);
    if (!uid) {
      router.push("/login?next=/checkout");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/account/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Could not place order");
      }
      clearCart();
      router.push("/account/orders");
      router.refresh();
    } catch {
      setPlaceError("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleApplyDiscount = () => {
    const raw = discountInput.trim();
    const code = raw.toUpperCase();
    if (code === "WELCOME10") {
      setAppliedDiscount({ label: "Welcome10", amount: 10 });
    } else if (code === "SAVE10") {
      setAppliedDiscount({ label: "SAVE10", amount: 10 });
    } else if (code === "SAVE5") {
      setAppliedDiscount({ label: "SAVE5", amount: 5 });
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput("");
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] px-4 py-16" style={{ backgroundColor: BG_PAGE }}>
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
      <div className="pb-16 lg:pb-24" style={{ backgroundColor: BG_PAGE }}>
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start lg:gap-12 lg:px-8 xl:gap-16">
        {/* Mobile / tablet: collapsible order summary */}
        <details className="group mb-6 overflow-hidden rounded-lg border border-[#ded8cc] bg-[#ebe4d9]/80 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-home-body text-sm [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 flex-1 items-center gap-2 font-medium text-[#1a3021]">
              <Icon icon="mingcute:shopping-bag-3-line" className="size-4 shrink-0 text-[#1a3021]" aria-hidden />
              <span className="flex min-w-0 items-center gap-2">
                <span className="group-open:hidden">Show order summary</span>
                <span className="hidden group-open:inline">Hide order summary</span>
                <Icon
                  icon="mingcute:down-line"
                  className="size-4 shrink-0 transition duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-[#1a3021]">${formatMoney(grandTotal)}</span>
          </summary>
          <div className="border-t border-[#e8e4dc] bg-[#faf8f3] px-4 pb-6 pt-2">
            <OrderSummaryInner
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              discountAmount={discountAmount}
              appliedDiscountLabel={appliedDiscountLabel}
              onRemoveDiscount={handleRemoveDiscount}
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
            <SectionTitle aside={!user && <Link href="/login" className="font-home-body text-sm text-neutral-600 underline underline-offset-2 hover:text-[#1a3021]">Sign in</Link>}>
              Contact
            </SectionTitle>
            <label className="block">
              <span className="sr-only">Email</span>
              <input 
                type="email" 
                name="email"
                autoComplete="email" 
                placeholder="Email" 
                className={inputClass} 
                value={formData.email}
                onChange={handleFormChange}
              />
            </label>
            <label className="mt-4 flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
              <input type="checkbox" className="mt-1 size-4 rounded border-neutral-300 accent-[#2D3E33]" defaultChecked />
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

          {/* Shipping address — ship only */}
          {deliveryMethod === "ship" ? (
            <section className="mt-10 border-t border-[#eceae5] pt-10">
              <SectionTitle>Delivery</SectionTitle>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                    Country / Region
                  </span>
                  <select 
                    name="country"
                    className={cn(inputClass, "appearance-none")} 
                    value={formData.country}
                    onChange={handleFormChange}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">First name</span>
                    <input 
                      type="text" 
                      name="firstName"
                      autoComplete="given-name" 
                      className={inputClass} 
                      value={formData.firstName}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Last name</span>
                    <input 
                      type="text" 
                      name="lastName"
                      autoComplete="family-name" 
                      className={inputClass} 
                      value={formData.lastName}
                      onChange={handleFormChange}
                    />
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
                    <input 
                      type="text" 
                      name="address"
                      autoComplete="street-address" 
                      className={cn(inputClass, "pl-11")} 
                      placeholder="Street address" 
                      value={formData.address}
                      onChange={handleFormChange}
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                    Apartment, suite, etc. (optional)
                  </span>
                  <input 
                    type="text" 
                    name="apartment"
                    className={inputClass} 
                    value={formData.apartment}
                    onChange={handleFormChange}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">City</span>
                    <input 
                      type="text" 
                      name="city"
                      autoComplete="address-level2" 
                      className={inputClass} 
                      value={formData.city}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">State</span>
                    <select 
                      name="state"
                      className={inputClass} 
                      value={formData.state}
                      onChange={handleFormChange}
                    >
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">ZIP code</span>
                    <input 
                      type="text" 
                      name="zipCode"
                      autoComplete="postal-code" 
                      className={inputClass} 
                      value={formData.zipCode}
                      onChange={handleFormChange}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Phone number</span>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="phone"
                      autoComplete="tel" 
                      className={cn(inputClass, "pr-11")} 
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 outline-none transition hover:bg-black/[0.04] hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-[#2D3E33]/25"
                          aria-label="Why we ask for your phone number"
                        >
                          <Icon icon="mingcute:question-line" className="size-[18px]" aria-hidden />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        sideOffset={8}
                        className={cn("max-w-[min(100vw-2rem,17.5rem)] text-[11px] leading-snug", TOOLTIP_SURFACE)}
                      >
                        In case we need to contact you about your order
                      </PopoverContent>
                    </Popover>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
                  <input type="checkbox" className="mt-1 size-4 rounded border-neutral-300 accent-[#2D3E33]" />
                  <span>Get exclusive offers, wellness tips straight to your WhatsApp!</span>
                </label>
              </div>
            </section>
          ) : null}

          {/* Store pickup — pick up only (4 static locations; first selected) */}
          {deliveryMethod === "pickup" ? (
            <PickupAddressSection selectedId={pickupLocationId} onSelect={setPickupLocationId} />
          ) : null}

          {/* Shipping method — ship only */}
          {deliveryMethod === "ship" ? (
            <section className="mt-10 border-t border-[#eceae5] pt-10">
              <SectionTitle>Shipping method</SectionTitle>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShippingRate("fedex")}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border px-4 py-4 text-left transition",
                    shippingRate === "fedex"
                      ? "border-[#1a3021] bg-[#faf9f6] shadow-sm"
                      : "border-neutral-300 bg-white hover:border-neutral-400"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 flex size-4 shrink-0 rounded-full border-2",
                      shippingRate === "fedex" ? "border-[#1a3021]" : "border-neutral-300"
                    )}
                  >
                    {shippingRate === "fedex" ? (
                      <span className="m-auto block size-2 rounded-full bg-[#1a3021]" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-home-heading text-[#1a3021]">FedEx Ground</span>
                      <span className="font-home-body text-sm font-semibold text-[#2d6a45]">FREE</span>
                    </span>
                    <span className="mt-1 block font-home-body text-xs text-neutral-500">3–5 business days</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingRate("usps")}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border px-4 py-4 text-left transition",
                    shippingRate === "usps"
                      ? "border-[#1a3021] bg-[#faf9f6] shadow-sm"
                      : "border-neutral-300 bg-white hover:border-neutral-400"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 flex size-4 shrink-0 rounded-full border-2",
                      shippingRate === "usps" ? "border-[#1a3021]" : "border-neutral-300"
                    )}
                  >
                    {shippingRate === "usps" ? (
                      <span className="m-auto block size-2 rounded-full bg-[#1a3021]" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-home-heading text-[#1a3021]">USPS Priority</span>
                      <span className="font-home-body text-sm font-semibold tabular-nums text-neutral-900">$10.00</span>
                    </span>
                    <span className="mt-1 block font-home-body text-xs text-neutral-500">2–3 business days</span>
                  </span>
                </button>
              </div>
            </section>
          ) : null}

          {/* Payment */}
          <section className="mt-10 border-t border-[#eceae5] pt-10">
            <div className="mb-6">
              <h2 className="font-home-heading text-lg text-[#1a3021] sm:text-xl">Payment</h2>
              <p className="mt-1 font-home-body text-sm text-neutral-600">
                All transactions are secured and encrypted.
              </p>
            </div>

            <div className="space-y-3">
              <div
                className={cn(
                  "rounded-md border transition",
                  paymentMethod === "card" ? "border-[#1a3021] bg-[#faf9f6]" : "border-neutral-300 bg-white hover:border-neutral-400"
                )}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className="flex w-full flex-col px-4 py-4 text-left outline-none transition"
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
                </button>
                {paymentMethod === "card" ? (
                  <div className="space-y-4 border-t border-[#e8e4dc] px-4 pb-4 pt-4 pl-11">
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
                        <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">
                          Security code
                        </span>
                        <div className="relative">
                          <input type="text" autoComplete="cc-csc" placeholder="CVV" className={cn(inputClass, "pr-11")} />
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 outline-none transition hover:bg-black/[0.04] hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-[#2D3E33]/25"
                                aria-label="What is a security code"
                              >
                                <Icon icon="mingcute:question-line" className="size-[18px]" aria-hidden />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              sideOffset={8}
                              className={cn("max-w-[min(100vw-2rem,20rem)] text-[11px] leading-snug", TOOLTIP_SURFACE)}
                            >
                              3-digit security code usually found on the back of your card. American Express cards have a
                              4-digit code located on the front.
                            </PopoverContent>
                          </Popover>
                        </div>
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Name on card</span>
                      <input type="text" autoComplete="cc-name" className={inputClass} />
                    </label>
                  </div>
                ) : null}
              </div>

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
            <div className="mb-4">
              <h2 className="font-home-heading text-lg text-[#1a3021] sm:text-xl">Billing address</h2>
              <p className="mt-1 font-home-body text-sm text-neutral-600">
                Select the address that matches your card or payment method.
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3 font-home-body text-sm">
                <input
                  type="radio"
                  name="billing"
                  checked={billingSame}
                  onChange={() => setBillingSame(true)}
                  className="size-4 accent-[#2D3E33]"
                />
                Same as shipping address
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3 font-home-body text-sm">
                <input
                  type="radio"
                  name="billing"
                  checked={!billingSame}
                  onChange={() => setBillingSame(false)}
                  className="size-4 accent-[#2D3E33]"
                />
                Use a different billing address
              </label>
            </div>
          </section>

          {/* Remember */}
          <section className="mt-8 rounded-md border border-[#e8e4dc] bg-[#faf9f6] px-4 py-4">
            <h3 className="font-home-heading mb-3 text-base text-[#1a3021]">Remember me</h3>
            <label className="flex cursor-pointer items-start gap-3 font-home-body text-sm text-neutral-700">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-neutral-300 accent-[#2D3E33]"
                checked={saveShopAccount}
                onChange={(e) => setSaveShopAccount(e.target.checked)}
              />
              <span className="flex flex-1 flex-wrap items-center gap-2">
                Save my information for a faster checkout with a Shop account.
                <span className="rounded bg-[#5A31F4]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5A31F4]">
                  Shop
                </span>
              </span>
            </label>
            {saveShopAccount ? (
              <label className="mt-4 block">
                <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-600">Mobile phone number</span>
                <div className="flex gap-2">
                  <span className="flex shrink-0 items-center rounded-md border border-neutral-300 bg-white px-3 py-2.5 font-home-body text-sm text-neutral-700">
                    +1
                  </span>
                  <input type="tel" autoComplete="tel-national" placeholder="(555) 555-5555" className={cn(inputClass, "min-w-0 flex-1")} />
                </div>
              </label>
            ) : null}
          </section>

          {/* Primary CTA — left column on large screens (matches desktop checkout mock) */}
          <div className="mt-10 border-t border-[#eceae5] pt-10">
            <CheckoutFooterActions
              grandTotal={grandTotal}
              totalQty={totalQty}
              onPlaceOrder={handlePlaceOrder}
              placing={placing}
              placeError={placeError}
            />
          </div>

          <footer className="mt-10 hidden border-t border-[#eceae5] pt-8 lg:block">
            <PolicyLinks />
          </footer>
        </main>

        {/* Right column — desktop summary */}
        <aside
          className="relative hidden min-h-0 border-l border-[#e0d9ce] lg:block lg:pl-10 xl:pl-12"
          style={{ backgroundColor: BG_SUMMARY }}
        >
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-10 pt-6 lg:top-[5.5rem]">
            <div className="px-2 sm:px-4">
              <OrderSummaryInner
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discountAmount={discountAmount}
                appliedDiscountLabel={appliedDiscountLabel}
                onRemoveDiscount={handleRemoveDiscount}
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

function CheckoutFooterActions({
  grandTotal,
  totalQty,
  onPlaceOrder,
  placing,
  placeError,
  className,
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {placeError ? (
        <p className="font-home-body text-center text-sm text-red-700" role="alert">
          {placeError}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={placing}
        className="font-home-sub flex h-14 w-full items-center justify-center rounded-md text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: FOREST }}
      >
        {placing ? "Placing order…" : "Place order"}
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
