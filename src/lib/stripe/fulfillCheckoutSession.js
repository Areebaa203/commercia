import { randomUUID } from "node:crypto";

function paymentIntentIdFromSession(session) {
  const pi = session.payment_intent;
  if (typeof pi === "string") return pi;
  if (pi && typeof pi === "object" && "id" in pi) return pi.id;
  return null;
}

/**
 * Ensure orders.customer_id is set before inserting transactions (NOT NULL).
 */
async function resolveCustomerIdForOrder(admin, orderId, orderRow, session) {
  if (orderRow.customer_id) return orderRow.customer_id;

  const raw =
    orderRow.checkout_details?.contactEmail ||
    session.customer_email ||
    session.customer_details?.email ||
    "";
  const email = String(raw).trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error(`[fulfillCheckoutSession] No customer email for order ${orderId}`);
    return null;
  }

  const name =
    String(orderRow.checkout_details?.shippingName || "").trim() ||
    email.split("@")[0] ||
    "Guest";
  const rawPhone = orderRow.checkout_details?.contactPhone;
  const phone =
    rawPhone && String(rawPhone).trim() !== "—" ? String(rawPhone).trim() : null;

  const { data: existing } = await admin.from("customers").select("id").eq("email", email).maybeSingle();
  let customerId = existing?.id;

  if (!customerId) {
    const { data: ins, error: insErr } = await admin
      .from("customers")
      .insert({
        name,
        email,
        phone,
        status: "active",
        total_orders: 0,
        total_spent: 0,
      })
      .select("id")
      .single();

    if (insErr) {
      if (insErr.code === "23505") {
        const { data: again } = await admin.from("customers").select("id").eq("email", email).maybeSingle();
        customerId = again?.id;
      } else {
        console.error("[fulfillCheckoutSession] customers insert", insErr);
        return null;
      }
    } else {
      customerId = ins?.id;
    }
  }

  if (!customerId) {
    console.error("[fulfillCheckoutSession] resolveCustomerIdForOrder: could not obtain id");
    return null;
  }

  return customerId;
}

/**
 * Marks the order paid, updates checkout_details copy, and ensures a sale transaction
 * row + customer stats. Idempotent — safe for webhook and guest confirmation page.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase Service-role client
 * @param {import("stripe").Stripe.Checkout.Session} session Checkout Session from Stripe API or webhook payload
 */
export async function fulfillCheckoutSessionCompleted(supabase, session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[fulfillCheckoutSession] checkout.session missing metadata.orderId");
    return;
  }

  let { data: orderRow, error: fetchErr } = await supabase
    .from("orders")
    .select("id, customer_id, checkout_details, total, payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchErr) {
    console.error(`[fulfillCheckoutSession] fetch order ${orderId}`, fetchErr);
    throw fetchErr;
  }
  if (!orderRow) {
    console.error(`[fulfillCheckoutSession] order not found ${orderId}`);
    return;
  }

  let customerId = orderRow.customer_id;
  if (!customerId) {
    customerId = await resolveCustomerIdForOrder(supabase, orderId, orderRow, session);
    if (!customerId) {
      console.error(`[fulfillCheckoutSession] could not resolve customer_id for order ${orderId}`);
      throw new Error(`customer_id unresolved for order ${orderId}`);
    }
  }

  if (orderRow.payment_status !== "paid") {
    const updatedDetails = {
      ...(orderRow.checkout_details && typeof orderRow.checkout_details === "object"
        ? orderRow.checkout_details
        : {}),
    };
    updatedDetails.paymentDisplay = `Card payment - $${Number(orderRow.total || 0).toFixed(2)}`;
    updatedDetails.statusMessage = "Payment confirmed. We're preparing your order for shipment.";
    updatedDetails.timelineDetail = `Updated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    const patch = {
      payment_status: "paid",
      status: "processing",
      stripe_checkout_session_id: session.id,
      checkout_details: updatedDetails,
      updated_at: new Date().toISOString(),
    };
    if (customerId && !orderRow.customer_id) {
      patch.customer_id = customerId;
    }

    const { data: updatedRows, error: orderError } = await supabase
      .from("orders")
      .update(patch)
      .eq("id", orderId)
      .eq("payment_status", "pending")
      .select("id, customer_id, total");

    if (orderError) {
      console.error(`[fulfillCheckoutSession] update order ${orderId}`, orderError);
      throw orderError;
    }

    if (!updatedRows?.[0]) {
      const { data: again } = await supabase
        .from("orders")
        .select("id, customer_id, checkout_details, total, payment_status")
        .eq("id", orderId)
        .maybeSingle();
      if (again?.payment_status !== "paid") {
        console.log(`[fulfillCheckoutSession] order ${orderId} not updated (still not paid)`);
        return;
      }
      orderRow = again;
    } else {
      orderRow = {
        ...orderRow,
        customer_id: updatedRows[0].customer_id || customerId,
        total: updatedRows[0].total ?? orderRow.total,
        payment_status: "paid",
        checkout_details: updatedDetails,
      };
    }
  }

  customerId = orderRow.customer_id || customerId;
  if (!customerId) {
    console.error(`[fulfillCheckoutSession] order ${orderId} still has no customer_id; skip transaction`);
    return;
  }

  const total = Number(orderRow.total ?? 0);
  const piId = paymentIntentIdFromSession(session);

  const { data: existingTrx } = await supabase
    .from("transactions")
    .select("id")
    .eq("order_id", orderId)
    .eq("type", "sale")
    .eq("status", "completed")
    .maybeSingle();

  if (existingTrx) {
    console.log(`[fulfillCheckoutSession] transaction already exists for order ${orderId}`);
    return;
  }

  if (piId) {
    const { data: piDup } = await supabase
      .from("transactions")
      .select("id")
      .eq("stripe_payment_intent_id", piId)
      .maybeSingle();
    if (piDup) {
      console.log(`[fulfillCheckoutSession] transaction already exists for PI ${piId}`);
      return;
    }
  }

  const { data: cust } = await supabase
    .from("customers")
    .select("total_spent, total_orders")
    .eq("id", customerId)
    .single();

  if (cust) {
    await supabase
      .from("customers")
      .update({
        total_spent: Number(cust.total_spent || 0) + total,
        total_orders: (cust.total_orders || 0) + 1,
      })
      .eq("id", customerId);
  }

  const { error: trxError } = await supabase.from("transactions").insert({
    transaction_number: `TRX-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`,
    order_id: orderId,
    customer_id: customerId,
    amount: total,
    type: "sale",
    status: "completed",
    method: session.payment_method_types?.[0] || "card",
    stripe_payment_intent_id: piId,
  });

  if (trxError) {
    console.error(`[fulfillCheckoutSession] transaction insert ${orderId}`, trxError);
  }
}
