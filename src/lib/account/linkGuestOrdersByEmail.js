import "server-only";

function normalizeEmail(e) {
  return String(e ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Set orders.user_id for guest rows whose customers.email matches the auth user.
 * Idempotent (only rows with user_id IS NULL). Call only from trusted server code with a service-role client.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} admin
 * @param {string} userId - auth.users.id
 * @param {string} rawEmail - session or signup email
 * @returns {Promise<{ linked: number }>}
 */
export async function linkGuestOrdersToUserByEmail(admin, userId, rawEmail) {
  const email = normalizeEmail(rawEmail);
  if (!userId || !email || !email.includes("@")) {
    return { linked: 0 };
  }

  const { data: customer, error: custErr } = await admin
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (custErr) {
    console.error("[linkGuestOrdersToUserByEmail] customers", custErr);
    throw custErr;
  }

  if (!customer?.id) {
    return { linked: 0 };
  }

  const { data: updated, error: updErr } = await admin
    .from("orders")
    .update({
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("customer_id", customer.id)
    .is("user_id", null)
    .select("id");

  if (updErr) {
    console.error("[linkGuestOrdersToUserByEmail] orders", updErr);
    throw updErr;
  }

  return { linked: updated?.length ?? 0 };
}
