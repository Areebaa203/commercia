import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/utils/supabase/server";
import {
  createGuestOrderSchema,
  isStorefrontProductUuid,
} from "@/lib/validations/guestOrders";
import { FREE_SHIPPING_THRESHOLD } from "@/store/slices/cartSlice";

const GUEST_SHIPPING_FLAT = 12.99;
const TOTAL_EPSILON = 0.02;
const RPC_ATTEMPTS = 5;

function generateGuestOrderNumber() {
  return `FNQ-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * POST — guest checkout: validate totals vs DB catalog (UUID lines), then create_guest_checkout_order RPC.
 * Rejects if a session exists (logged-in users must use /api/account/orders).
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "Signed-in customers should use account checkout.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = createGuestOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const {
      lines,
      total: clientTotalRaw,
      itemsCount,
      shippingCost: clientShippingRaw,
      discountAmount: clientDiscountRaw,
      checkoutDetails,
    } = parsed.data;

    const clientDiscount = roundMoney(clientDiscountRaw ?? 0);
    if (clientDiscount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Discounts are not supported for guest checkout yet.",
        },
        { status: 400 }
      );
    }

    const uuids = [...new Set(lines.map((l) => l.slug).filter(isStorefrontProductUuid))];
    const productMap = new Map();

    if (uuids.length > 0) {
      const { data: products, error: pErr } = await supabase
        .from("products")
        .select("id, price, status, name, stock")
        .in("id", uuids);

      if (pErr) {
        console.error("[POST /api/storefront/guest-orders] products", pErr);
        return NextResponse.json(
          { success: false, message: "Could not verify product prices." },
          { status: 500 }
        );
      }

      for (const p of products ?? []) {
        productMap.set(p.id, p);
      }

      for (const id of uuids) {
        const p = productMap.get(id);
        if (!p || p.status !== "active") {
          return NextResponse.json(
            { success: false, message: "One or more products are unavailable." },
            { status: 400 }
          );
        }
      }
    }

    let subtotal = 0;
    const rpcLines = [];

    for (const line of lines) {
      let unitPrice = roundMoney(line.price);

      if (isStorefrontProductUuid(line.slug)) {
        const p = productMap.get(line.slug);
        if (!p) {
          return NextResponse.json(
            { success: false, message: "Invalid product in cart." },
            { status: 400 }
          );
        }
        unitPrice = roundMoney(p.price);
        const stock = Number(p.stock ?? 0);
        if (stock < line.qty) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for ${p.name ?? "an item"}.`,
            },
            { status: 400 }
          );
        }
      }

      subtotal = roundMoney(subtotal + unitPrice * line.qty);

      const row = {
        slug: line.slug,
        name: line.name,
        image: line.image,
        price: unitPrice,
        qty: line.qty,
      };
      if (line.compareAt != null) row.compareAt = line.compareAt;
      if (line.variantLabel != null) row.variantLabel = line.variantLabel;
      rpcLines.push(row);
    }

    const expectedShipping =
      lines.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : GUEST_SHIPPING_FLAT;
    const clientShipping = roundMoney(clientShippingRaw ?? 0);
    if (Math.abs(clientShipping - expectedShipping) > TOTAL_EPSILON) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping cost is out of date. Refresh checkout and try again.",
        },
        { status: 400 }
      );
    }

    const serverTotal = roundMoney(subtotal + expectedShipping - clientDiscount);
    const clientRounded = roundMoney(clientTotalRaw);
    if (Math.abs(serverTotal - clientRounded) > TOTAL_EPSILON) {
      return NextResponse.json(
        {
          success: false,
          message: "Order total does not match current prices. Refresh and try again.",
        },
        { status: 400 }
      );
    }

    const sumQty = lines.reduce((s, l) => s + l.qty, 0);
    if (sumQty !== itemsCount) {
      return NextResponse.json(
        { success: false, message: "Item count does not match line quantities." },
        { status: 400 }
      );
    }

    const email = String(checkoutDetails.contactEmail).trim().toLowerCase();
    const shippingName = String(checkoutDetails.shippingName ?? "").trim();
    const phone = String(checkoutDetails.contactPhone ?? "")
      .replace(/^—$/, "")
      .trim();

    let lastRpcError = null;

    for (let attempt = 0; attempt < RPC_ATTEMPTS; attempt += 1) {
      const orderNumber = generateGuestOrderNumber();

      const { data: orderId, error: rpcError } = await supabase.rpc("create_guest_checkout_order", {
        p_email: email,
        p_name: shippingName || email.split("@")[0] || "Guest",
        p_phone: phone || null,
        p_order_number: orderNumber,
        p_total: serverTotal,
        p_items_count: itemsCount,
        p_lines: rpcLines,
        p_shipping_cost: expectedShipping,
        p_discount_amount: clientDiscount,
        p_checkout_details: checkoutDetails,
      });

      if (!rpcError && orderId) {
        return NextResponse.json({ success: true, data: { id: orderId } });
      }

      lastRpcError = rpcError;
      const msg = rpcError?.message ?? "";
      const isUniqueViolation =
        rpcError?.code === "23505" ||
        msg.includes("duplicate key") ||
        msg.includes("unique constraint");

      if (!isUniqueViolation) break;
    }

    console.error("[POST /api/storefront/guest-orders] rpc", lastRpcError);
    return NextResponse.json(
      {
        success: false,
        message: lastRpcError?.message || "Could not create order.",
      },
      { status: 500 }
    );
  } catch (err) {
    console.error("[POST /api/storefront/guest-orders]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
