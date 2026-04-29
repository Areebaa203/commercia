"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export default function CartDrawer({ open, onOpenChange }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-300"
          )}
        />

        {/* Drawer panel — slides in from the right */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 right-0 z-[70] flex h-full w-full flex-col bg-[#FFFDF7] shadow-2xl outline-none",
            "max-w-[100vw] sm:max-w-[420px]",
            "border-l border-[#e8e4dc]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200"
          )}
        >
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between border-b border-[#e8e4dc] px-5 py-4 sm:px-6">
            <DialogPrimitive.Title className="font-home-heading text-lg tracking-tight text-[#1a3021] sm:text-xl">
              Your Cart
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 text-[#3d4a42] transition-colors hover:bg-black/[0.04] hover:text-[#1a3021]"
                aria-label="Close cart"
              >
                <Icon icon="mingcute:close-line" className="size-5 sm:size-6" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* ─── Empty state body ─── */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
            {/* Shopping bag icon */}
            <div className="relative mb-6 flex size-20 items-center justify-center rounded-full bg-[#f0ede6] sm:size-24">
              <Icon
                icon="mingcute:shopping-bag-3-line"
                className="size-9 text-[#8a917f] sm:size-11"
              />
              {/* Badge count */}
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#d6d0c5] text-[10px] font-semibold text-[#566157] sm:size-6 sm:text-xs">
                0
              </span>
            </div>

            <h3 className="font-home-heading text-xl text-[#1a3021] sm:text-2xl">
              Your cart is empty
            </h3>
            <p className="mt-2 max-w-[260px] text-center text-sm leading-relaxed text-[#6b7368] sm:max-w-[280px] sm:text-[15px]">
              Looks like you haven&apos;t added anything to your cart yet.
              Browse our collection and find something you love.
            </p>

            {/* CTA button */}
            <Link
              href="/shop-all"
              onClick={() => onOpenChange(false)}
              className="font-home-sub mt-8 inline-flex h-12 w-full max-w-[280px] items-center justify-center rounded-sm bg-[#24352d] px-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e2c26] sm:max-w-[300px]"
            >
              Start shopping
            </Link>

            {/* Secondary link */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-3 text-sm font-medium text-[#3d4a42] underline underline-offset-2 transition-colors hover:text-[#1a3021]"
            >
              Continue browsing
            </button>
          </div>

          {/* ─── Footer — value props ─── */}
          <div className="border-t border-[#e8e4dc] bg-[#faf8f3] px-5 py-4 sm:px-6">
            <ul className="flex items-center justify-between gap-2 sm:gap-4">
              <li className="flex flex-col items-center gap-1.5 text-center">
                <Icon
                  icon="mingcute:truck-line"
                  className="size-5 text-[#3d5346] sm:size-6"
                />
                <span className="font-home-sub text-[9px] font-semibold uppercase tracking-[0.08em] text-[#566157] sm:text-[10px] sm:tracking-[0.1em]">
                  Free shipping
                </span>
              </li>
              <li className="h-6 w-px bg-[#e0dcd3]" aria-hidden />
              <li className="flex flex-col items-center gap-1.5 text-center">
                <Icon
                  icon="mingcute:refresh-2-line"
                  className="size-5 text-[#3d5346] sm:size-6"
                />
                <span className="font-home-sub text-[9px] font-semibold uppercase tracking-[0.08em] text-[#566157] sm:text-[10px] sm:tracking-[0.1em]">
                  Easy returns
                </span>
              </li>
              <li className="h-6 w-px bg-[#e0dcd3]" aria-hidden />
              <li className="flex flex-col items-center gap-1.5 text-center">
                <Icon
                  icon="mingcute:shield-check-line"
                  className="size-5 text-[#3d5346] sm:size-6"
                />
                <span className="font-home-sub text-[9px] font-semibold uppercase tracking-[0.08em] text-[#566157] sm:text-[10px] sm:tracking-[0.1em]">
                  Secure checkout
                </span>
              </li>
            </ul>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
