"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  FOOTER_INFO_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SHOP_LINKS,
  FOOTER_SOCIAL,
} from "@/components/home/siteFooterData";

const BG = "#FDFBF7";
const BTN_GREEN = "#2F3E33";

function HavenWordmark({ className }) {
  return (
    <span
      className={cn(
        "inline-block font-home-heading font-normal uppercase leading-none tracking-[0.18em] text-[#2D3E33]",
        className
      )}
    >
      HAVEN
      <span className="align-super text-[0.42em] font-normal leading-none tracking-normal">®</span>
    </span>
  );
}

function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast({
      title: "You're on the list",
      description: "Thanks for subscribing — check your inbox soon.",
    });
    setEmail("");
  };

  return (
    <div>
      <p className="font-home-body text-sm leading-relaxed text-neutral-800">
        Join our newsletter and save 10% on your first order.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label htmlFor="footer-email" className="sr-only">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full border border-neutral-200/90 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 sm:flex-1"
        />
        <button
          type="submit"
          className="font-home-sub min-h-11 shrink-0 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
          style={{ backgroundColor: BTN_GREEN }}
        >
          SUBSCRIBE
        </button>
      </form>
      <p className="mt-3 max-w-md font-home-body text-[11px] leading-relaxed text-neutral-500">
        By subscribing you agree to our{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-neutral-800">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-neutral-800">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

function LinkList({ links }) {
  return (
    <ul className="font-home-body space-y-3 text-xs font-medium uppercase tracking-[0.1em] text-neutral-700">
      {links.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className="transition hover:text-neutral-900">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-home-sub text-sm font-bold uppercase tracking-[0.08em] text-neutral-900">{title}</h3>
      <div className="mt-4">
        <LinkList links={links} />
      </div>
    </div>
  );
}

function AccordionBlock({ title, defaultOpen = false, links }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-300/60">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-home-sub text-sm font-semibold uppercase tracking-[0.1em] text-neutral-900">
          {title}
        </span>
        <Icon
          icon={open ? "mdi:minus" : "mdi:plus"}
          className="size-5 shrink-0 text-neutral-600"
          aria-hidden
        />
      </button>
      {open ? (
        <div className="pb-4 pt-0">
          <LinkList links={links} />
        </div>
      ) : null}
    </div>
  );
}

const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: BG }}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-12 lg:px-8 lg:pb-14 lg:pt-16">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="max-w-xl md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Haven Home">
              <HavenWordmark className="text-[2rem] tracking-[0.2em] sm:text-[2.35rem]" />
            </Link>
            <div className="mt-5 flex items-center gap-5">
              {FOOTER_SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D3E33] transition hover:opacity-70"
                  aria-label={s.label}
                >
                  <Icon icon={s.icon} className="size-[1.35rem]" />
                </a>
              ))}
            </div>
            <div className="mt-8">
              <NewsletterBlock />
            </div>
          </div>

          {/* Mobile accordions */}
          <div className="mt-10 md:col-span-12 md:hidden">
            <AccordionBlock title="Shop" defaultOpen={true} links={FOOTER_SHOP_LINKS} />
            <AccordionBlock title="Info" links={FOOTER_INFO_LINKS} />
            <AccordionBlock title="Legal" links={FOOTER_LEGAL_LINKS} />
          </div>

          {/* Desktop link columns */}
          <div className="hidden md:col-span-7 md:grid md:grid-cols-3 md:gap-6 lg:col-span-8 lg:gap-10">
            <LinkColumn title="Shop" links={FOOTER_SHOP_LINKS} />
            <LinkColumn title="Info" links={FOOTER_INFO_LINKS} />
            <LinkColumn title="Legal" links={FOOTER_LEGAL_LINKS} />
          </div>
        </div>

        <div className="pointer-events-none relative mt-12 select-none sm:mt-16 md:mt-20" aria-hidden>
          <p
            className="text-center font-home-heading font-light leading-none tracking-[0.12em] text-[#2D3E33]/[0.15] text-[min(3.2rem,14vw)] sm:text-[min(4.5rem,13vw)] md:text-[6.5rem] lg:text-[7.5rem]"
          >
            HAVEN
            <span className="align-super text-[0.38em]">®</span>
          </p>
        </div>

        <div className="mt-10 border-t border-neutral-300/70 pt-6 sm:mt-12">
          <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
            <p className="font-home-body text-xs text-neutral-600">
              © Haven {year}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 opacity-[0.92] sm:justify-end">
              <Icon icon="logos:visa" className="h-6 w-10" aria-hidden />
              <Icon icon="logos:mastercard" className="h-6 w-10" aria-hidden />
              <Icon icon="logos:amex" className="h-6 w-10" aria-hidden />
              <Icon icon="logos:discover" className="h-6 w-10" aria-hidden />
              <Icon icon="logos:apple-pay" className="h-6 w-12" aria-hidden />
              <Icon icon="logos:paypal" className="h-6 w-10" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
