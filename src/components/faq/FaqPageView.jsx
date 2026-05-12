"use client";

import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { SITE_HEADER_GUTTERS } from "@/components/home/SiteHeader";
import { FAQ_CATEGORIES, FAQ_CONTACT } from "@/components/faq/faqData";
import { cn } from "@/lib/utils";

const GREEN = "#2D3E33";
const CREAM_CARD = "#EDE8E0";
const DIVIDER = "#e0dcd4";

function FaqAccordionPanel({ isOpen, children }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="pb-5 pt-0">{children}</div>
      </div>
    </div>
  );
}

export default function FaqPageView() {
  const baseId = useId();
  const [activeCategoryId, setActiveCategoryId] = useState(FAQ_CATEGORIES[0].id);
  const [openItemKey, setOpenItemKey] = useState(() =>
    `${FAQ_CATEGORIES[0].id}-${FAQ_CATEGORIES[0].items[0].id}`
  );

  const activeCategory = useMemo(
    () => FAQ_CATEGORIES.find((c) => c.id === activeCategoryId) ?? FAQ_CATEGORIES[0],
    [activeCategoryId]
  );

  const selectCategory = useCallback((id) => {
    setActiveCategoryId(id);
    const cat = FAQ_CATEGORIES.find((c) => c.id === id);
    if (cat?.items[0]) {
      setOpenItemKey(`${id}-${cat.items[0].id}`);
    }
  }, []);

  const toggleItem = (itemId) => {
    const key = `${activeCategory.id}-${itemId}`;
    setOpenItemKey((prev) => (prev === key ? "" : key));
  };

  return (
    <main className="bg-[#f7f4ef] pb-16 pt-8 sm:pb-20 sm:pt-10 md:pb-24 md:pt-12">
      {/* —— Section 1: FAQs + categories + accordion —— */}
      <section aria-labelledby="faq-page-heading" className={SITE_HEADER_GUTTERS}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start xl:gap-16">
          {/* Left: title + categories */}
          <div className="lg:col-span-4 xl:col-span-3">
            <h1
              id="faq-page-heading"
              className="font-home-heading text-[2rem] font-normal leading-[1.1] tracking-[-0.02em] sm:text-[2.25rem] md:text-[2.5rem]"
              style={{ color: GREEN }}
            >
              FAQs
            </h1>

            <nav className="mt-8 flex flex-row gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:overflow-visible lg:pb-0 lg:gap-1">
              <p className="sr-only">FAQ categories</p>
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2.5 text-left font-home-body text-sm font-medium transition-colors duration-200 lg:w-full lg:max-w-[280px]",
                      isActive
                        ? "bg-[#e4dfd6] text-[#1a251f] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                        : "text-[#4a524a] hover:bg-[#ebe6df]/80"
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-8 xl:col-span-9 lg:min-h-[320px]">
            <div className="border-t border-[#e8e4dc] lg:border-t-0">
              {activeCategory.items.map((item) => {
                const itemKey = `${activeCategory.id}-${item.id}`;
                const isOpen = openItemKey === itemKey;
                const panelId = `${baseId}-${itemKey}-panel`;
                const headerId = `${baseId}-${itemKey}-header`;

                return (
                  <div key={item.id} className="border-b" style={{ borderColor: DIVIDER }}>
                    <h2 className="font-home-body text-base font-semibold">
                      <button
                        id={headerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-start justify-between gap-4 py-5 text-left transition-opacity duration-200 hover:opacity-85 sm:py-[1.35rem]"
                      >
                        <span
                          className="min-w-0 flex-1 leading-snug sm:text-[17px]"
                          style={{ color: GREEN }}
                        >
                          {item.question}
                        </span>
                        <span className="mt-0.5 shrink-0 text-[#5c5c5c]" aria-hidden>
                          <Icon
                            icon={isOpen ? "mingcute:minimize-line" : "mingcute:add-line"}
                            className="size-5 sm:size-6"
                          />
                        </span>
                      </button>
                    </h2>

                    <div id={panelId} role="region" aria-labelledby={headerId}>
                      <FaqAccordionPanel isOpen={isOpen}>
                        <p className="max-w-2xl pr-2 font-home-body text-sm leading-relaxed text-[#555555] sm:text-[15px]">
                          {item.answer}
                        </p>
                      </FaqAccordionPanel>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* —— Section 2: Contact —— */}
      <section
        aria-labelledby="faq-contact-heading"
        className={`${SITE_HEADER_GUTTERS} mt-16 sm:mt-20 md:mt-24`}
      >
        <h2
          id="faq-contact-heading"
          className="mx-auto max-w-3xl text-center font-home-heading text-[1.65rem] font-normal leading-snug tracking-[-0.02em] sm:text-[1.85rem] md:text-[2.1rem]"
          style={{ color: GREEN }}
        >
          Didn&apos;t find your answer? Contact us for assistance!
        </h2>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 md:gap-8">
          <div
            className="flex flex-col rounded-xl px-6 py-8 sm:px-8 sm:py-10"
            style={{ backgroundColor: CREAM_CARD }}
          >
            <span className="font-home-sub text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c5c5c]">
              Call
            </span>
            <p className="mt-4 font-home-heading text-[1.5rem] tracking-tight sm:text-[1.65rem]" style={{ color: GREEN }}>
              {FAQ_CONTACT.phone}
            </p>
            <p className="mt-2 font-home-body text-sm text-[#555555]">{FAQ_CONTACT.phoneHours}</p>
            <Link
              href={FAQ_CONTACT.phoneHref}
              className="font-home-sub mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-92 sm:w-auto sm:self-start sm:px-10"
              style={{ backgroundColor: GREEN }}
            >
              Call us
              <Icon icon="mingcute:phone-line" className="size-4" aria-hidden />
            </Link>
          </div>

          <div
            className="flex flex-col rounded-xl px-6 py-8 sm:px-8 sm:py-10"
            style={{ backgroundColor: CREAM_CARD }}
          >
            <span className="font-home-sub text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c5c5c]">
              Email
            </span>
            <p className="mt-4 break-all font-home-heading text-[1.35rem] tracking-tight sm:text-[1.5rem]" style={{ color: GREEN }}>
              {FAQ_CONTACT.email}
            </p>
            <p className="mt-2 font-home-body text-sm text-[#555555]">{FAQ_CONTACT.emailHours}</p>
            <Link
              href={FAQ_CONTACT.emailHref}
              className="font-home-sub mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-92 sm:w-auto sm:self-start sm:px-10"
              style={{ backgroundColor: GREEN }}
            >
              Email us
              <Icon icon="mingcute:mail-line" className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
