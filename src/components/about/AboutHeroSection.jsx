import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { SITE_HEADER_GUTTERS } from "@/components/home/SiteHeader";

const HERO_IMG = "/about-img-1.jpg";

const FEATURES = [
  "Free shipping over $100",
  "30-day easy returns",
  "Quality materials",
  "Handcrafted furniture",
  "Sustainably sourced wood",
  "No hidden fees",
  "Easy assembly",
  "Lifetime guarantee",
  "Real wood",
];

export default function AboutHeroSection() {
  return (
    <section className="w-full overflow-hidden" aria-labelledby="about-hero-heading">
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[min(72vh,640px)] lg:min-h-[min(78vh,720px)]">
        <div className="relative order-1 aspect-[4/3] w-full sm:aspect-[16/10] md:order-2 md:aspect-auto md:min-h-[380px] lg:min-h-[480px]">
          <Image
            src={HERO_IMG}
            alt="Outdoor patio with warm lighting, wood table, and comfortable seating"
            fill
            className="object-cover"
            style={{ objectPosition: "50% 55%" }}
            sizes="(max-width: 767px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="order-2 flex flex-col justify-center bg-[#F9F8F3] px-4 py-12 sm:px-6 sm:py-14 md:order-1 md:px-8 md:py-14 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto flex w-full max-w-xl flex-col text-center md:mx-0 md:max-w-lg md:text-left lg:max-w-xl">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="flex shrink-0 text-[#1a3021]" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} icon="mingcute:star-fill" className="size-4 sm:size-[1.05rem]" />
                ))}
              </span>
              <span className="font-home-body text-xs font-medium tracking-wide text-[#3d4a42] sm:text-sm">
                1M+ satisfied customers
              </span>
            </div>

            <p className="font-home-sub text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7d867f] sm:text-[11px]">
              Furniture made right
            </p>

            <h1
              id="about-hero-heading"
              className="mt-3 font-home-heading text-[2rem] font-normal leading-[1.12] tracking-[-0.02em] text-[#1a3021] sm:text-[2.35rem] md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.08]"
            >
              Pieces made for the long haul
            </h1>

            <p className="mt-4 font-home-body text-sm font-normal leading-relaxed text-[#2c3b33] sm:mt-5 sm:text-[15px] lg:text-base">
              Every piece at Furniqo is crafted from quality materials and built for real life. Timeless
              design that grows with you, without the compromises.
            </p>

            <div className="mt-8 flex justify-center md:justify-start sm:mt-9">
              <Link
                href="/shop-all"
                className="font-home-sub inline-flex h-12 min-w-[10.5rem] items-center justify-center rounded-md bg-[#1a3021] px-8 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#142418] sm:h-[3rem] sm:text-[11px]"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a3021]">
        <div
          className={`${SITE_HEADER_GUTTERS} py-5 sm:py-6`}
          role="list"
          aria-label="Brand promises"
        >
          <div
            className="-mx-4 flex gap-x-6 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:gap-x-8 sm:px-0 sm:pb-0 lg:gap-x-10 [&::-webkit-scrollbar]:hidden"
          >
            {FEATURES.map((label) => (
              <div
                key={label}
                role="listitem"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap last:pr-2 sm:last:pr-0"
              >
                <Icon
                  icon="mingcute:check-line"
                  className="size-3.5 shrink-0 text-white/90 sm:size-4"
                  aria-hidden
                />
                <span className="font-home-sub text-[9px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[10px] sm:tracking-[0.14em] lg:text-[11px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
