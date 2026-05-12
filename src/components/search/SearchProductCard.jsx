"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { getShopLineStockQty } from "@/lib/storefront-product";

function formatPrice(n) {
  return n.toFixed(2);
}

export default function SearchProductCard({ product, dense = false, className }) {
  const { addItem } = useCart();
  const stockQty = getShopLineStockQty(product.slug);
  const outOfStock = stockQty <= 0;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-sm border border-[#e8e3d9] bg-[#f4f1ea] p-2.5 text-center sm:p-3",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col text-left">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2px] bg-[#ece7de]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn("object-contain", dense ? "p-2" : "p-2.5 sm:p-3")}
            sizes={dense ? "160px" : "(max-width:768px) 45vw, 240px"}
          />
          <span className="absolute right-2 top-2 bg-[#B22222] px-1.5 py-0.5 font-home-sub text-[9px] font-semibold uppercase tracking-wide text-white">
            -{product.discount}%
          </span>
        </div>
        <h3 className={cn("font-home-heading mt-2 line-clamp-2 text-[#1a3021]", dense ? "text-xs sm:text-[13px]" : "text-sm sm:text-[15px]")}>
          {product.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-0.5 text-amber-600" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} icon="mingcute:star-fill" className={dense ? "size-2.5 sm:size-3" : "size-3 sm:size-3.5"} />
          ))}
          <span className={cn("ml-1 font-home-body text-neutral-600", dense ? "text-[10px]" : "text-[11px] sm:text-xs")}>
            ({product.reviews} reviews)
          </span>
        </div>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-2 font-home-body">
          <span className="text-neutral-500 line-through">${formatPrice(product.compareAt)}</span>
          <span className="font-semibold text-[#B22222]">${formatPrice(product.price)}</span>
        </p>
      </Link>
      {outOfStock ? (
        <p className="font-home-sub mt-auto py-2 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Out of stock
        </p>
      ) : (
        <button
          type="button"
          className={cn(
            "font-home-sub mt-auto w-full border border-neutral-300/90 bg-[#f7f3ec] py-2 font-semibold uppercase tracking-[0.12em] text-neutral-800 transition hover:bg-[#ece7de]",
            dense ? "text-[9px] sm:text-[10px]" : "text-[10px] tracking-[0.14em]"
          )}
          onClick={() =>
            addItem({
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              compareAt: product.compareAt,
              variantLabel: null,
              qty: 1,
            })
          }
        >
          Add to cart
        </button>
      )}
    </article>
  );
}
