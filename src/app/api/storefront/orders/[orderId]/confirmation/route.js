import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/server";
import { mapOrderRowWithItems } from "@/lib/account/mapOrder";
import { fulfillCheckoutSessionCompleted } from "@/lib/stripe/fulfillCheckoutSession";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/**
 * GET — public order summary after Stripe Checkout for **guest** buyers only when:
 * - `session_id` query param is a real Checkout Session, and
 * - `session.metadata.orderId` matches this `orderId`, and
 * - `payment_status === 'paid'` (one-time card checkout success path).
 *
 * Uses service role only to read `orders` / `order_items` (no anon RLS on those tables).
 */
export async function GET(request, { params }) {
  try {
    const { orderId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Missing order id" }, { status: 400 });
    }
    if (!sessionId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing session_id" },
        { status: 400 }
      );
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "Payment verification is not configured." },
        { status: 503 }
      );
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId.trim(), {
        expand: ["payment_intent"],
      });
    } catch (e) {
      console.error("[GET /guest confirmation] Stripe retrieve", e?.message ?? e);
      return NextResponse.json(
        { success: false, message: "Invalid or expired checkout session." },
        { status: 400 }
      );
    }

    const metaOrderId = session.metadata?.orderId != null ? String(session.metadata.orderId) : "";
    if (metaOrderId !== String(orderId)) {
      return NextResponse.json({ success: false, message: "Checkout session does not match this order." }, { status: 403 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          success: false,
          message:
            session.payment_status === "unpaid"
              ? "Payment is still processing. Refresh this page in a moment."
              : "Payment was not completed.",
        },
        { status: 409 }
      );
    }

    const supabase = await createAdminClient();
    try {
      await fulfillCheckoutSessionCompleted(supabase, session);
    } catch (e) {
      console.error("[GET /guest confirmation] fulfillCheckoutSessionCompleted", e?.message ?? e);
      return NextResponse.json(
        { success: false, message: "Could not finalize your order after payment." },
        { status: 500 }
      );
    }
    const { data: orderRow, error: oErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (oErr) {
      console.error("[GET /guest confirmation] orders", oErr);
      return NextResponse.json({ success: false, message: "Could not load order." }, { status: 500 });
    }
    if (!orderRow) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    const { data: itemRows, error: iErr } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (iErr) {
      console.error("[GET /guest confirmation] order_items", iErr);
      return NextResponse.json({ success: false, message: "Could not load order lines." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: mapOrderRowWithItems(orderRow, itemRows ?? []),
    });
  } catch (err) {
    console.error("[GET /api/storefront/orders/.../confirmation]", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
