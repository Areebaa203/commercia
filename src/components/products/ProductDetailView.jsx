"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ValuePropsBand from "@/components/home/ValuePropsBand";
import { VALUE_PROPS } from "@/components/home/homeValuePropsData";
import ProductCustomerReviews from "@/components/products/ProductCustomerReviews";
import RelatedProductsCarousel from "@/components/products/RelatedProductsCarousel";
import { ALL_SHOP_PRODUCTS } from "@/components/shop-all/shopAllData";

const WHY_LOVE_FEATURES = [
  {
    id: "crafted",
    title: "Thoughtfully crafted",
    body: "Each piece is built with attention to detail—from joinery to upholstery—so it feels as good as it looks in your home.",
  },
  {
    id: "last",
    title: "Built to last",
    body: "Quality materials and solid construction are designed for years of everyday use by you and your family.",
  },
  {
    id: "maintain",
    title: "Easy to maintain",
    body: "Performance fabrics and durable finishes make cleaning simple so you can spend more time enjoying your space.",
  },
  {
    id: "fit",
    title: "Perfect fit guarantee",
    body: "Not the right fit? Exchange or return within our window—we want you to love how it lives in your room.",
  },
];

function formatPrice(n) {
  return n.toFixed(2);
}

export default function ProductDetailView({ product }) {
  const { addItem } = useCart();
  const [slide, setSlide] = useState(0);
  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState("ship");
  const [colorId, setColorId] = useState(product.colorOptions[0]?.id ?? "cream");
  const [openAcc, setOpenAcc] = useState({
    details: true,
    materials: false,
    shipping: false,
  });
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyStep, setNotifyStep] = useState("form"); // "form" | "success"
  const [notifyEmail, setNotifyEmail] = useState("");

  const outOfStock = product.stockQty <= 0;

  const [deadline] = useState(() => Date.now() + (6 * 24 + 20) * 3600000 + 16 * 60000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, deadline - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);

  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const selectedColor = product.colorOptions.find((c) => c.id === colorId) ?? product.colorOptions[0];
  const cartImage = selectedColor?.thumb ?? product.image;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({
      slug: product.slug,
      name: product.name,
      image: cartImage,
      price: product.price,
      compareAt: product.compareAt,
      variantLabel: `Color: ${selectedColor?.label ?? "Cream"}`,
      qty,
    });
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    const email = notifyEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Enter a valid email",
        description: "Please check your email address and try again.",
      });
      return;
    }
    setNotifyStep("success");
  };

  const handleNotifyDialogOpenChange = (open) => {
    setNotifyOpen(open);
    if (!open) {
      setNotifyStep("form");
      setNotifyEmail("");
    }
  };

  const shipSubtitle = outOfStock
    ? "No stock locally."
    : "In stock to ship.";

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav className="font-home-sub mb-8 text-[11px] uppercase tracking-[0.12em] text-[#6b7368]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            {product.breadcrumbs.map((bc, idx) => (
              <li key={`${bc.label}-${idx}`} className="flex items-center gap-1">
                {idx > 0 ? <span className="text-neutral-400">/</span> : null}
                {bc.href ? (
                  <Link href={bc.href} className="transition hover:text-[#1a3021]">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[#1a3021]" aria-current="page">
                    {bc.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,420px)]">
          {/* Gallery */}
          <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#ece7de]">
              <Image
                src={gallery[slide] ?? product.image}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-8"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setSlide((s) => (s - 1 + gallery.length) % gallery.length)}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300/90 bg-[#fcfbf9]/95 text-neutral-700 shadow-sm transition hover:bg-white"
              >
                <Icon icon="mingcute:left-line" className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setSlide((s) => (s + 1) % gallery.length)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300/90 bg-[#fcfbf9]/95 text-neutral-700 shadow-sm transition hover:bg-white"
              >
                <Icon icon="mingcute:right-line" className="size-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Gallery slides">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === slide ? "w-10 bg-[#1a3021]" : "w-6 bg-neutral-400/55 hover:bg-neutral-400/80"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Detail column */}
          <div className="flex min-w-0 flex-col">
            <span className="inline-block bg-[#B22222] px-2.5 py-1 font-home-sub text-[10px] font-semibold uppercase tracking-wide text-white">
              -{product.discount}%
            </span>
            <h1 className="font-home-heading mt-4 text-3xl leading-tight text-[#1a3021] sm:text-4xl">{product.name}</h1>
            <div id="reviews" className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex text-amber-600" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} icon="mingcute:star-fill" className="size-4" />
                ))}
              </span>
              <Link href="#reviews" className="text-sm text-[#1a3021] underline underline-offset-2">
                ({product.reviews} reviews)
              </Link>
            </div>
            <p className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-semibold text-neutral-900 sm:text-3xl">${formatPrice(product.price)}</span>
              <span className="text-lg text-neutral-500 line-through">${formatPrice(product.compareAt)}</span>
            </p>

            <div className="mt-6 flex flex-col gap-2 rounded-sm bg-[#8f2b2e] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
              <p className="font-home-heading max-w-xl text-[0.9375rem] leading-snug sm:text-base">
                Save up to 50% on last season&apos;s favorites.
              </p>
              <div className="font-home-sub flex shrink-0 flex-wrap gap-2 whitespace-nowrap text-[10px] font-semibold tabular-nums tracking-wide">
                <span>{String(days).padStart(2, "0")} DAYS</span>
                <span className="text-white/65">:</span>
                <span>{String(hours).padStart(2, "0")} HRS</span>
                <span className="text-white/65">:</span>
                <span>{String(mins).padStart(2, "0")} MIN</span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">{product.description}</p>

            <div className={cn("mt-6 flex items-center gap-2 text-sm font-medium", outOfStock ? "text-red-600" : "text-[#1a5734]")}>
              <span
                className={cn(
                  "shrink-0 rounded-full",
                  outOfStock ? "size-2 bg-red-600" : "relative flex size-2.5"
                )}
              >
                {!outOfStock ? (
                  <>
                    <span className="absolute inline-flex size-full rounded-full bg-green-600 opacity-80" aria-hidden />
                    <span className="absolute inline-flex size-full animate-[ping_1.25s_ease-out_infinite] rounded-full bg-green-500 opacity-65" aria-hidden />
                  </>
                ) : null}
              </span>
              <span>{outOfStock ? "Out of stock" : `${product.stockQty} in stock`}</span>
            </div>

            <div className="mt-8">
              <p className="font-home-sub text-xs font-semibold uppercase tracking-[0.1em] text-[#566157]">
                Color:&nbsp;
                <span className="text-[#1a3021]">
                  {product.colorOptions.find((c) => c.id === colorId)?.label ?? "Cream"}
                </span>
              </p>
              <div className="mt-3 flex gap-3">
                {product.colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    className={cn(
                      "relative size-14 overflow-hidden rounded-[2px] border-2 transition",
                      colorId === c.id ? "border-[#1a3021] ring-1 ring-[#1a3021]" : "border-neutral-300/70 hover:border-neutral-400"
                    )}
                  >
                    <Image src={c.thumb} alt={c.label} fill className="object-contain p-1.5" sizes="56px" />
                  </button>
                ))}
              </div>
            </div>

            <p className="font-home-sub mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-[#566157]">
              Delivery method: Ship
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDelivery("ship")}
                className={cn(
                  "flex items-start gap-3 rounded-sm border px-4 py-3 text-left transition",
                  delivery === "ship" ? "border-[#1a3021] bg-white shadow-sm" : "border-neutral-300/70 bg-[#faf8f3] hover:bg-white"
                )}
              >
                <Icon icon="mingcute:truck-fill" className="mt-0.5 size-6 shrink-0 text-[#1a3021]" aria-hidden />
                <span>
                  <span className="font-home-heading block text-base text-[#1a3021]">Ship</span>
                  <span className="mt-1 block text-sm text-neutral-600">{shipSubtitle}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDelivery("pickup")}
                className={cn(
                  "flex items-start gap-3 rounded-sm border px-4 py-3 text-left transition",
                  delivery === "pickup" ? "border-[#1a3021] bg-white shadow-sm" : "border-neutral-300/70 bg-[#faf8f3] hover:bg-white"
                )}
              >
                <Icon icon="mingcute:store-2-fill" className="mt-0.5 size-6 shrink-0 text-[#1a3021]" aria-hidden />
                <span>
                  <span className="font-home-heading block text-base text-[#1a3021]">Pickup in-store</span>
                  <span className="mt-1 block text-sm text-neutral-600">Check in-store availability.</span>
                </span>
              </button>
            </div>
            <Link href="#" className="mt-3 inline-block text-sm font-medium text-[#1a3021] underline underline-offset-2">
              Find a store
            </Link>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              {!outOfStock ? (
                <div className="flex h-[3rem] w-full max-w-[11rem] items-center justify-between rounded-sm border border-neutral-300/80 bg-white px-3">
                  <button
                    type="button"
                    className="p-2 text-neutral-700 hover:bg-neutral-50"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Icon icon="mingcute:minimize-line" className="size-5" />
                  </button>
                  <span className="tabular-nums">{qty}</span>
                  <button
                    type="button"
                    className="p-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                    aria-label="Increase quantity"
                    disabled={qty >= product.stockQty}
                    onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))}
                  >
                    <Icon icon="mingcute:add-line" className="size-5" />
                  </button>
                </div>
              ) : null}
              {!outOfStock ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="font-home-sub h-[3rem] w-full shrink-0 rounded-sm bg-[#24352d] px-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e2c26] sm:flex-1"
                >
                  Add to cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setNotifyStep("form");
                    setNotifyOpen(true);
                  }}
                  className="font-home-sub flex h-[3rem] w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-[#24352d] px-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e2c26] sm:flex-1"
                >
                  <Icon icon="mingcute:mail-line" className="size-5" aria-hidden />
                  Notify me
                </button>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-neutral-600 sm:text-left">
              Pay in 4 easy installments with Klarna.
            </p>

            <div className="mt-8 rounded-sm border border-[#e0dcd3] bg-[#faf7f2] px-4 py-4">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-[#e8e4dc]">
                {VALUE_PROPS.map((vp) => (
                  <li key={vp.id} className="flex flex-col gap-1.5 sm:px-3 sm:first:pl-0 sm:last:pr-0">
                    <span className="inline-flex shrink-0 text-[#24352D]" aria-hidden>
                      <Icon icon={vp.icon} className="size-6" />
                    </span>
                    <span className="font-home-heading text-sm leading-snug text-[#24352D]">{vp.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 divide-y divide-[#e0dcd3] border-y border-[#e0dcd3]">
              <AccordionRow
                title="Details"
                open={openAcc.details}
                onToggle={() => setOpenAcc((a) => ({ ...a, details: !a.details }))}
              >
                <ul className="space-y-2 text-sm leading-relaxed text-neutral-700">
                  {product.specs.map((s) => (
                    <li key={s.label}>
                      <span className="font-semibold text-neutral-800">{s.label}: </span>
                      <span>{s.value}</span>
                    </li>
                  ))}
                  <li>
                    Designed for elevated everyday living — spot-clean fabric; avoid harsh solvents.
                  </li>
                </ul>
              </AccordionRow>
              <AccordionRow
                title="Materials & care"
                open={openAcc.materials}
                onToggle={() => setOpenAcc((a) => ({ ...a, materials: !a.materials }))}
              >
                <p className="text-sm leading-relaxed text-neutral-700">{product.materialBlurb}</p>
              </AccordionRow>
              <AccordionRow
                title="Shipping & returns"
                open={openAcc.shipping}
                onToggle={() => setOpenAcc((a) => ({ ...a, shipping: !a.shipping }))}
              >
                <p className="text-sm leading-relaxed text-neutral-700">
                  Free shipping on orders over $100. Most items ship within 2–5 business days. Return unused items
                  within 30 days of delivery for a refund.
                </p>
              </AccordionRow>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={notifyOpen} onOpenChange={handleNotifyDialogOpenChange}>
        <DialogContent
          showCloseButton
          className={cn(
            "gap-6 rounded-lg border border-[#e0dcd3] bg-[#faf9f6] shadow-lg",
            notifyStep === "form"
              ? "max-h-[none] max-w-[min(calc(100vw-2rem),26rem)] p-6 sm:p-8"
              : "max-h-[min(90vh,calc(100dvh-2rem))] max-w-[min(calc(100vw-1rem),52rem)] overflow-y-auto p-5 pb-6 sm:p-8 sm:pb-8"
          )}
        >
          {notifyStep === "form" ? (
            <>
              <DialogHeader className="gap-2 space-y-0 text-left">
                <DialogTitle className="font-home-heading text-xl font-normal leading-snug text-[#1a3021] sm:text-[1.375rem]">
                  The product is currently out of stock
                </DialogTitle>
                <DialogDescription className="font-home-body text-sm leading-relaxed text-neutral-600">
                  Do you want us to notify you when it is available?
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block font-home-body text-xs font-medium text-neutral-800">
                    Enter your email address
                  </span>
                  <input
                    type="email"
                    name="notify-email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 font-home-body text-sm outline-none transition focus:border-[#1a3021] focus:ring-2 focus:ring-[#1a3021]/15"
                  />
                </label>
                <p className="font-home-body text-[11px] leading-relaxed text-neutral-600">
                  By submitting I represent that I have read and agree to Furniqo&apos;s{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-neutral-900">
                    Terms of Services
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  className="font-home-sub flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#24352d] text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e2c26]"
                >
                  <Icon icon="mingcute:mail-line" className="size-5 shrink-0" aria-hidden />
                  Notify me
                </button>
              </form>
            </>
          ) : (
            <>
              <DialogHeader className="gap-3 space-y-0 text-left">
                <DialogTitle className="font-home-heading text-2xl font-normal leading-snug text-[#1a3021] sm:text-[1.75rem]">
                  Thank you
                </DialogTitle>
                <DialogDescription className="font-home-body text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                  We will send you a notification when it is available.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 border-t border-[#e8e4dc] pt-6">
                <h3 className="font-home-heading text-lg text-[#1a3021] sm:text-xl">Similar products</h3>
                <SimilarProductsNotifyCarousel excludeSlug={product.slug} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <ValuePropsBand />
      </div>

      <ProductWhyLoveIt lifestyleSrc={product.gallery?.[1] ?? "/sofa-beds-img.jpg"} />
      <RelatedProductsCarousel
        excludeSlug={product.slug}
        sectionClassName="border-t border-[#e8e4dc] bg-[#f7f4ef]"
      />

      <ProductCustomerReviews reviewTotal={product.reviews} />
    </>
  );
}

function SimilarProductsNotifyCarousel({ excludeSlug }) {
  const { addItem } = useCart();
  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const items = useMemo(() => {
    const list = excludeSlug
      ? ALL_SHOP_PRODUCTS.filter((p) => p.slug !== excludeSlug)
      : [...ALL_SHOP_PRODUCTS];
    return list.slice(0, 12);
  }, [excludeSlug]);

  const updateProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return undefined;
    const schedule = () => requestAnimationFrame(updateProgress);
    const rafId = schedule();
    el.addEventListener("scroll", updateProgress, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", updateProgress);
      ro.disconnect();
    };
  }, [updateProgress, items.length]);

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.55 * dir, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <ul
        ref={scrollerRef}
        className="no-scrollbar flex list-none gap-3 overflow-x-auto scroll-smooth pb-1 pt-1 snap-x snap-mandatory sm:gap-4"
      >
        {items.map((p) => (
          <li
            key={p.slug}
            className="w-[min(calc(50vw-1.75rem),200px)] shrink-0 snap-start sm:w-[200px] md:w-[216px]"
          >
            <article className="flex h-full flex-col rounded-sm border border-[#e8e3d9] bg-[#f4f1ea] p-3 text-center sm:p-3.5">
              <Link href={`/products/${p.slug}`} className="block text-left">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[2px] bg-[#ece7de]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-2 sm:p-2.5"
                    sizes="200px"
                  />
                  <span className="absolute right-2 top-2 bg-[#B22222] px-1.5 py-0.5 font-home-sub text-[9px] font-semibold uppercase tracking-wide text-white">
                    -{p.discount}%
                  </span>
                </div>
                <h4 className="font-home-heading mt-2 line-clamp-2 min-h-[2.5rem] text-left text-sm leading-snug text-[#1a3021] sm:text-[15px]">
                  {p.name}
                </h4>
                <div className="mt-1 flex flex-wrap items-center gap-0.5 text-amber-600" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon="mingcute:star-fill" className="size-3 sm:size-3.5" />
                  ))}
                  <span className="ml-1 font-home-body text-[11px] text-neutral-600 sm:text-xs">({p.reviews} reviews)</span>
                </div>
                <p className="mt-1 flex flex-wrap items-baseline gap-2 font-home-body">
                  <span className="text-[15px] font-semibold text-neutral-900 sm:text-base">${formatPrice(p.price)}</span>
                  <span className="text-[13px] font-medium text-[#B22222] line-through sm:text-sm">${formatPrice(p.compareAt)}</span>
                </p>
              </Link>
              <button
                type="button"
                className="font-home-sub mt-2 w-full border border-neutral-300/90 bg-[#f7f3ec] py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800 transition hover:bg-[#ece7de]"
                onClick={() =>
                  addItem({
                    slug: p.slug,
                    name: p.name,
                    image: p.image,
                    price: p.price,
                    compareAt: p.compareAt,
                    variantLabel: null,
                    qty: 1,
                  })
                }
              >
                Add to cart
              </button>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="h-px min-w-[6rem] max-w-[140px] flex-1 rounded-full bg-[#d8d2c7]">
          <div
            className="h-px rounded-full bg-[#24352d] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Previous products"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de] sm:h-10 sm:w-10"
          >
            <Icon icon="mingcute:left-line" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Next products"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#ddd7cb] bg-[#f6f3ed] text-[#5c645c] transition hover:bg-[#ece7de] sm:h-10 sm:w-10"
          >
            <Icon icon="mingcute:right-line" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductWhyLoveIt({ lifestyleSrc }) {
  const [openId, setOpenId] = useState("crafted");

  return (
    <section className="border-t border-[#e8e4dc] bg-[#FAF9F6] py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="max-w-xl">
            <p className="font-home-sub text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7368]">
              Why you&apos;ll love it
            </p>
            <h2 className="font-home-heading mt-3 text-3xl leading-tight text-[#1a3021] sm:text-4xl md:text-[2.5rem]">
              Designed for everyday comfort
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
              Premium materials, calm proportions, and finishes that age beautifully—so your space feels inviting from the
              first day and for years to come.
            </p>
            <div className="mt-8 divide-y divide-[#e0dcd3] border-t border-b border-[#e0dcd3]">
              {WHY_LOVE_FEATURES.map((f) => {
                const open = openId === f.id;
                return (
                  <div key={f.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? "" : f.id)}
                      className="font-home-sub flex w-full items-center justify-between gap-4 text-left text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-[#1a3021]"
                      aria-expanded={open}
                    >
                      <span>{f.title}</span>
                      <Icon
                        icon={open ? "mingcute:minimize-line" : "mingcute:add-line"}
                        className="size-5 shrink-0 text-neutral-500"
                      />
                    </button>
                    {open ? <p className="mt-3 text-sm leading-relaxed text-neutral-700">{f.body}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-sm bg-[#ece7de] lg:mx-0 lg:max-w-none">
            <Image
              src={lifestyleSrc}
              alt="Lifestyle setting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AccordionRow({ title, open, onToggle, children }) {
  return (
    <div className="py-4">
      <button
        type="button"
        className="font-home-sub flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#1a3021]"
        onClick={onToggle}
        aria-expanded={open}
      >
        {title}
        <Icon icon={open ? "mingcute:minimize-line" : "mingcute:add-line"} className="size-5 text-neutral-500" />
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
