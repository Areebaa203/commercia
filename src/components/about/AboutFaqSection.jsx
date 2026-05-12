"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { SITE_HEADER_GUTTERS } from "@/components/home/SiteHeader";

const GREEN = "#2D3E33";

const FAQ_ITEMS = [
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "Most orders ship within 5–7 business days and arrive within 7–10 days depending on your location. You'll receive tracking information as soon as your order ships. White-glove delivery is available for larger items for an additional fee.",
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day easy return window on most items in original condition and packaging. Start a return from your order history or contact us—we'll send a prepaid label when your piece qualifies. Some made-to-order or final-sale items are noted at checkout.",
  },
  {
    id: "assembly",
    question: "Do I need to assemble the furniture myself?",
    answer:
      "Many pieces arrive partially assembled with clear instructions and hardware included. Larger items can be delivered with assembly or white-glove service where available in your area.",
  },
  {
    id: "materials",
    question: "What materials are your furniture made from?",
    answer:
      "We use solid hardwoods, high-quality veneers, and durable upholstery fabrics. Each product page lists materials and care notes so you know exactly what you're bringing home.",
  },
  {
    id: "size",
    question: "How do I know what size will fit my space?",
    answer:
      "Check listed dimensions and clearance for doors, stairs, and hallways. Our team can help you compare sizes to your room layout—send measurements or a floor plan and we'll suggest pieces that fit.",
  },
  {
    id: "showroom",
    question: "Can I see the furniture in person before buying?",
    answer:
      "Where we have partner showrooms or pop-ups, you'll find locations on our site. Everywhere else, high-resolution photos, fabric swatches, and our team's guidance help you decide with confidence.",
  },
  {
    id: "care",
    question: "How do I clean and maintain my furniture?",
    answer:
      "Dust regularly with a soft cloth, blot spills quickly, and follow the care guide for your finish or fabric. Avoid harsh chemicals unless specified—when in doubt, ask us before trying a new cleaner.",
  },
  {
    id: "financing",
    question: "Do you offer financing or payment plans?",
    answer:
      "Yes—eligible orders can use buy-now-pay-later or installment options at checkout where available. Terms depend on the provider and your approval.",
  },
];

export default function AboutFaqSection() {
  const baseId = useId();
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  return (
    <section className="bg-[#F9F7F2]" aria-labelledby="about-faq-heading">
      <div className={`${SITE_HEADER_GUTTERS} py-14 sm:py-16 md:py-20 lg:py-24`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <h2
              id="about-faq-heading"
              className="text-left font-home-heading text-[1.75rem] font-normal leading-[1.12] tracking-[-0.02em] sm:text-[2rem] md:text-[2.125rem] lg:text-[2.35rem] lg:leading-[1.08]"
              style={{ color: GREEN }}
            >
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-md text-left font-home-body text-sm leading-relaxed text-[#555555] sm:mt-5 sm:text-[15px] lg:text-base">
              If you&apos;re new to Furniqo®, these are a few things people often want to know before
              getting started.
            </p>
            <div className="mt-8 sm:mt-9">
              <Link
                href="#"
                className="font-home-sub flex h-12 w-full items-center justify-center rounded-md px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-92 sm:inline-flex sm:w-auto sm:min-w-[11rem] sm:text-[11px]"
                style={{ backgroundColor: GREEN }}
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="border-t border-[#e0dcd4] lg:col-span-7 lg:border-t-0 lg:pt-0">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `${baseId}-${item.id}-panel`;
              const headerId = `${baseId}-${item.id}-header`;
              return (
                <div key={item.id} className="border-b border-[#e0dcd4]">
                  <h3 className="font-home-body">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? "" : item.id)}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:opacity-90 sm:py-[1.35rem]"
                    >
                      <span
                        className="min-w-0 flex-1 text-[15px] font-semibold leading-snug sm:text-base"
                        style={{ color: GREEN }}
                      >
                        {item.question}
                      </span>
                      <span className="shrink-0 text-[#5c5c5c]" aria-hidden>
                        <Icon
                          icon={isOpen ? "mingcute:minimize-line" : "mingcute:add-line"}
                          className="size-5 sm:size-[1.35rem]"
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    hidden={!isOpen}
                    className={isOpen ? "pb-5" : "hidden"}
                  >
                    <p className="max-w-2xl pr-2 font-home-body text-sm leading-relaxed text-[#555555] sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
