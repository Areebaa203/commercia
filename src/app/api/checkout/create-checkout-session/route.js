import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { FREE_SHIPPING_THRESHOLD } from "@/store/slices/cartSlice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const SHIPPING_FLAT_USD = 12.99;
const TOTAL_EPSILON = 0.02;

function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

function normalizeEmail(e) {
  return String(e ?? "")
    .trim()
    .toLowerCase();
}

/**
 * POST — Stripe Checkout Session for an existing **pending-payment** order.
 * Best practice: verify order in DB, ownership (guest vs account), email, and that
 * cart line items match **order.total** before charging (aligned with FREE_SHIPPING_THRESHOLD).
 */
export async function POST(request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured (missing STRIPE_SECRET_KEY)." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { items, email: bodyEmail, orderId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const email = normalizeEmail(bodyEmail || user?.email || "");
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email is required for checkout" }, { status: 400 });
    }

    let orderRow = null;

    if (user) {
      const { data, error } = await supabase
        .from("orders")
        .select("id, user_id, total, payment_status, status, checkout_details")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("[create-checkout-session] load order", error);
        return NextResponse.json({ error: "Could not verify order." }, { status: 500 });
      }
      orderRow = data;
    } else {
      const admin = await createAdminClient();
      const { data, error } = await admin
        .from("orders")
        .select("id, user_id, total, payment_status, status, checkout_details")
        .eq("id", orderId)
        .maybeSingle();

      if (error) {
        console.error("[create-checkout-session] load guest order", error);
        return NextResponse.json({ error: "Could not verify order." }, { status: 500 });
      }
      if (!data) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      if (data.user_id != null) {
        return NextResponse.json(
          { error: "Sign in to pay for this order." },
          { status: 403 }
        );
      }
      orderRow = data;

      const storedEmail = normalizeEmail(data.checkout_details?.contactEmail ?? "");
      if (storedEmail && storedEmail !== email) {
        return NextResponse.json(
          { error: "Email does not match this order. Use the address from checkout." },
          { status: 403 }
        );
      }
    }

    if (!orderRow) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (orderRow.payment_status !== "pending") {
      return NextResponse.json(
        { error: "This order is not awaiting payment." },
        { status: 409 }
      );
    }

    const subtotal = roundMoney(items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0));
    const shippingUsd =
      items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_USD;
    const expectedTotal = roundMoney(subtotal + shippingUsd);
    const dbTotal = roundMoney(orderRow.total);

    if (Math.abs(expectedTotal - dbTotal) > TOTAL_EPSILON) {
      return NextResponse.json(
        {
          error:
            "Cart total does not match this order. Refresh the page or return to checkout and try again.",
        },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image
            ? [item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`]
            : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Math.max(1, Math.floor(Number(item.qty))),
    }));

    const shippingCents = Math.round(shippingUsd * 100);
    if (shippingCents > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    const metadata = {
      orderId: String(orderId),
    };
    if (user?.id) {
      metadata.userId = user.id;
    }

    const session = await stripe.checkout.sessions.create(
      {
        customer_email: email,
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        client_reference_id: String(orderId).slice(0, 200),
        success_url: `${siteUrl}/checkout/confirmation?orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/checkout`,
        metadata,
        payment_intent_data: {
          metadata: { orderId: String(orderId) },
        },
      },
      { idempotencyKey: `checkout_${orderId}_${randomUUID()}`.slice(0, 255) }
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Checkout Session:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
