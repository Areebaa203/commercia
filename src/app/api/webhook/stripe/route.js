import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/server";
import { fulfillCheckoutSessionCompleted } from "@/lib/stripe/fulfillCheckoutSession";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/**
 * Idempotency: insert stripe_webhooks row; duplicate event id with processed_at → skip.
 * Duplicate id without processed_at → continue (retry after partial failure).
 */
async function shouldSkipStripeEvent(supabase, event) {
  const { data: inserted, error } = await supabase
    .from("stripe_webhooks")
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      status: "received",
    })
    .select("id")
    .maybeSingle();

  if (!error && inserted?.id) {
    return false;
  }

  if (error?.code !== "23505") {
    console.error("[Stripe webhook] stripe_webhooks insert", error);
    throw error;
  }

  const { data: row, error: selErr } = await supabase
    .from("stripe_webhooks")
    .select("processed_at")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (selErr) {
    console.error("[Stripe webhook] stripe_webhooks select", selErr);
    throw selErr;
  }

  if (row?.processed_at) {
    return true;
  }

  return false;
}

async function markStripeEventProcessed(supabase, eventId) {
  await supabase
    .from("stripe_webhooks")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
    })
    .eq("stripe_event_id", eventId);
}

async function handleCheckoutSessionAsyncFailed(event, supabase) {
  const failedSession = event.data.object;
  const orderId = failedSession.metadata?.orderId;
  console.warn(`[Stripe webhook] async_payment_failed session=${failedSession.id} order=${orderId || "?"}`);

  if (!orderId) return;

  const { data: orderRow } = await supabase
    .from("orders")
    .select("checkout_details, payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (!orderRow || orderRow.payment_status === "paid") return;

  const details = {
    ...(orderRow.checkout_details && typeof orderRow.checkout_details === "object"
      ? orderRow.checkout_details
      : {}),
  };
  details.paymentDisplay = details.paymentDisplay || "Payment failed";
  details.statusMessage =
    "We could not confirm your payment. Please try again or use a different payment method.";
  details.timelineDetail = `Updated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      checkout_details: details,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("payment_status", "pending");
}

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[Stripe webhook] STRIPE_SECRET_KEY missing");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
      console.warn("[Stripe webhook] STRIPE_WEBHOOK_SECRET not set — signature verification skipped");
    }
  } catch (error) {
    console.error(`[Stripe webhook] constructEvent: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[Stripe webhook] SUPABASE_SERVICE_ROLE_KEY missing");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  let supabase;
  try {
    supabase = await createAdminClient();
  } catch (e) {
    console.error("[Stripe webhook] admin client", e);
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  let skipEvent = false;
  try {
    skipEvent = await shouldSkipStripeEvent(supabase, event);
  } catch (e) {
    console.error("[Stripe webhook] idempotency", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (skipEvent) {
    console.log(`[Stripe webhook] duplicate event ${event.id} (already processed)`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await fulfillCheckoutSessionCompleted(supabase, event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await handleCheckoutSessionAsyncFailed(event, supabase);
        break;
      default:
        console.log(`[Stripe webhook] unhandled type ${event.type}`);
    }

    await markStripeEventProcessed(supabase, event.id);
  } catch (err) {
    console.error("[Stripe webhook] handler error", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
