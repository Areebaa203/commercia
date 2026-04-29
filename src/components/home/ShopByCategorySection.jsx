"use client";

import Image from "next/image";
import Link from "next/link";

const BG = "#F9F7F0";
const FOREST = "#2D3E33";

const CATEGORIES = [
  { id: "armchairs", label: "Armchairs", image: "/arm-chair-img.jpg" },
  { id: "bedroom-beds", label: "Bedroom beds", image: "/bedroom-img.jpg" },
  { id: "sofa-beds", label: "Sofa beds", image: "/sofa-beds-img.jpg" },
  { id: "dining-tables", label: "Dining tables", image: "/dining-table-img.jpg" },
  { id: "textiles", label: "Textiles", image: "/textile-img.jpg" },
  { id: "coffee-tables", label: "Coffee tables", image: "/coffee-tables-img.jpg" },
];

function CategoryCard({ category }) {
  return (
    <li className="min-w-0">
      <Link href="/shop-all" className="group block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#e8e4de] sm:rounded-2xl">
          <Image
            src={category.image}
            alt={category.label}
            fill
            sizes="(max-width: 640px) 45vw, 180px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-2.5 text-center font-home-body text-[13px] font-medium leading-snug text-[#2d3230] sm:mt-3 sm:text-sm">
          {category.label}
        </p>
      </Link>
    </li>
  );
}

export default function ShopByCategorySection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="font-home-heading text-center text-[1.625rem] leading-tight tracking-tight sm:text-left sm:text-3xl md:text-[2.75rem]"
          style={{ color: FOREST }}
        >
          Shop by category
        </h2>

        <ul className="mt-8 grid list-none grid-cols-2 gap-x-3 gap-y-6 sm:mt-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/shop-all"
            className="font-home-sub inline-flex min-h-[44px] items-center justify-center border px-10 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-[#f0ebe3]"
            style={{
              borderColor: FOREST,
              backgroundColor: "#fcfbf8",
              color: FOREST,
              borderRadius: "6px",
            }}
          >
            Show more
          </Link>
        </div>
      </div>
    </section>
  );
}
