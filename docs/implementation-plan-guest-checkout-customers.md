# Implementation plan: `customers` table, guest checkout, and payment status

This document breaks work into phases, lists database changes, and maps each phase to files in this repo.

---

## Goals

1. **Persist buyer data in `customers`** for both logged-in users and guests (email required; phone ideal), using **upsert** so `orders.customer_id` is usually non-null.
2. **Allow guests to complete checkout** without signing in, using the **anon Supabase key** (no service role in the app for this flow).
3. **Keep payment status accurate** end-to-end: pending → paid (or failed), aligned with Stripe webhooks and storefront UX.
4. **Stripe Checkout** uses **`customer_email`** only (transient payer identity). **No** `profiles.stripe_customer_id` column or profile updates from checkout (that column is not part of this project’s schema).

---

## Phase 0 — Locked-in decisions

| # | Decision |
|---|-----------|
| 1 | Require **email** (ideally **phone**) at checkout; **upsert `customers`** (by email) so `orders.customer_id` is set for nearly all orders. |
| 2 | Guest writes use **database RPC + grants** under **anon** (no app service role for small tasks). |
| 3 | Stripe: **`customer_email`** on the Checkout Session; **no** persisted Stripe Customer id on `profiles`. |
| 4 | Prefer **always** having a `customers` row via upsert (**never** rely on `transactions` with a null `customer_id` for the happy path). |

### How you know someone is a **guest**

- **At checkout:** no Supabase Auth session → **guest** in the browser.
- **In the database:** **`orders.user_id IS NULL`** for that order (logged-in buyers have `user_id = auth.uid()`).

You do **not** need a separate `is_guest` flag if you keep this convention.

---

## Phase 1 — Database / RLS — **DONE**

**Status:** Implemented in-repo. **Apply the SQL on your Supabase instance** by running `migrations/guest_checkout_anon_rls.sql` after `rls_policies.sql` (and after `storefront_orders` columns exist).

### What was built (best-practice: atomic RPC, not broad anon policies)

Early drafts used **anon `INSERT`** on `orders` / `order_items`. That pattern **fails safely** under RLS subqueries **or** forces a **permissive anon `SELECT` on `orders`**, which can **expose other guests’ orders** in a time window. Phase 1 therefore ships:

| Piece | Behavior |
|--------|-----------|
| **`ensure_guest_customer(text, text, text, text)`** | `SECURITY DEFINER`, `SET search_path = public`, validates lengths and minimal email shape, upserts `public.customers` by `email`. **`REVOKE ALL … FROM PUBLIC`** — **not** granted to `anon` (only called from the other function). |
| **`create_guest_checkout_order(...)`** | `SECURITY DEFINER`, **single transaction**: upsert customer → insert guest **`orders`** (`user_id` **NULL**) → insert **`order_items`**. Rejects **`auth.uid() IS NOT NULL`** (logged-in buyers must use the account checkout path). Validates totals, line caps, and per-line fields. Accepts **`p_lines`** keys compatible with `src/app/api/account/orders` (`slug`, `name`, `image`, `price`, `qty`, `compareAt`, `variantLabel`) plus snake_case aliases. **`GRANT EXECUTE … TO anon`** (+ `service_role` when that role exists). |
| **Legacy cleanup** | `DROP POLICY IF EXISTS` for any old **anon insert/select** policies on `orders` / `order_items` if you had applied a previous draft. |

### Repo pointers

- **`migrations/guest_checkout_anon_rls.sql`** — canonical migration (run in SQL editor or CI).
- **`rls_policies.sql`** — footer comment: run this migration after the main RLS file.
- **`database_functions.sql`** — section **§5** comment points to the same migration (functions live in the migration file to avoid drift).

### Phase 1 checklist (you mark off on deploy)

- [ ] `storefront_orders.sql` applied (`user_id`, `checkout_details`, line snapshot columns).
- [ ] `rls_policies.sql` applied.
- [ ] `guest_checkout_anon_rls.sql` applied.
- [ ] In Supabase Dashboard → **Database → Functions**: confirm `create_guest_checkout_order` exists and **`anon`** has **execute**.

### RPC from the app

The app calls the RPC **via** `POST /api/storefront/guest-orders` (Phase 2) with the Supabase **server** client and **no user session** (anon), so you do not embed the RPC in the browser.

---

## Phase 2 — Guest order creation — **DONE**

**Status:** Implemented in-repo.

| Deliverable | Purpose |
|-------------|---------|
| **`src/lib/validations/guestOrders.js`** | `createGuestOrderSchema`, `guestCheckoutDetailsSchema`, `isStorefrontProductUuid`. |
| **`src/app/api/storefront/guest-orders/route.js`** | **400** if a user session exists (use `/api/account/orders`). **Zod** validate body. **Recompute** subtotal from **`products`** for cart lines whose `slug` is a **UUID** (DB PDP); non-UUID lines still use declared prices (mock catalog). **Recompute shipping** (`FREE_SHIPPING_THRESHOLD` + **12.99** flat) and reject guest **discounts** (0 only for now). **Match** client total within **0.02**. **RPC** `create_guest_checkout_order` with server-trusted line prices; **retry** on `order_number` unique violation. |

**Flow:** `CheckoutReviewView` → when **no** `resolveSupabaseUserId`, `POST /api/storefront/guest-orders` with the same payload shape as account checkout → Stripe session with returned **`order.id`**.

**Not in Phase 2:** rate limiting / CAPTCHA (optional hardening). **`CheckoutView.jsx`** still requires login (no shipping/contact form there).

---

## Phase 3 — Storefront UI (checkout) — **DONE**

| File | Status |
|------|--------|
| `src/components/checkout/CheckoutReviewView.jsx` | Guest vs account submit. |
| `src/components/checkout/CheckoutView.jsx` | Unchanged — login required (no full checkout form for guests). |
| `src/components/checkout/CheckoutConfirmationView.jsx` | **Guest path:** requires Stripe **`session_id`** on the success URL; calls **`GET /api/storefront/orders/[orderId]/confirmation?session_id=…`**. **Signed-in path:** unchanged **`GET /api/account/orders/[orderId]`**. UI: guests see **Thank you**, back link to **shop**, **Manage / Cancel** hidden. |

### Guest confirmation API (Phase 3)

| Path | Behavior |
|------|-----------|
| **`src/app/api/storefront/orders/[orderId]/confirmation/route.js`** | Verifies **`session_id`** with **Stripe** (`metadata.orderId` match, **`payment_status === 'paid'`**), then loads **`orders` + `order_items`** via **`createAdminClient()`** and returns **`mapOrderRowWithItems`** (same shape as account). No public read without a valid paid Checkout Session. |

---

## Phase 4 — Stripe Checkout session — **DONE**

| Deliverable | Behavior |
|-------------|-----------|
| **`src/app/api/checkout/create-checkout-session/route.js`** | **`customer_email`** only (no Stripe Customer id on `profiles`). **`orderId`** required. **`metadata.orderId`** (+ **`metadata.userId`** when signed in). **Loads order first:** authenticated users via RLS (`user_id` match); guests via **`createAdminClient`** with **`user_id` IS NULL** and **`checkout_details.contactEmail`** must match request email. Only **`payment_status === 'pending'`**. **Shipping / subtotal** use **`FREE_SHIPPING_THRESHOLD`** from `cartSlice` and **\$12.99** flat (aligned with guest-orders). **Rejects** if reconstructed total ≠ **`orders.total`** (±\$0.02). **Stripe:** **`client_reference_id`**, **`payment_intent_data.metadata.orderId`**, **idempotency key** per request, URL-encoded **`orderId`** in success URL, **`StripeError`** message surfaced when safe. **503** if secret key missing. |

**Requires:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, session cookies (anon or auth) + **`SUPABASE_SERVICE_ROLE_KEY`** for guest order verification only.

---

## Phase 5 — Webhooks and payment status — **DONE**

**Status:** Implemented in-repo.

| Deliverable | Behavior |
|-------------|-----------|
| **Idempotency** | **`stripe_webhooks`** table: insert **`stripe_event_id`**; on unique conflict, skip if **`processed_at`** set (otherwise retry continues). Mark **`processed`** after successful handler. |
| **`checkout.session.completed`** | Skip if order already **`paid`**. Resolve **`customers`** (upsert by email from **`checkout_details.contactEmail`** / session email) if **`orders.customer_id`** null — **throw** (500, Stripe retries) if unresolved so paid orders are not left without a **`transactions`** row. Single conditional **`UPDATE … WHERE payment_status = 'pending'`** with **`SELECT`** — only then bump **`customers`** stats and insert **`transactions`** (**dedupe** by order sale + **`stripe_payment_intent_id`**). |
| **`checkout.session.async_payment_failed`** | Set **`payment_status: failed`** when still pending; refresh **`checkout_details`** messaging. |
| **Config / errors** | **500** if **`SUPABASE_SERVICE_ROLE_KEY`** missing; handler failures **500** (Stripe retries); **`STRIPE_WEBHOOK_SECRET`** required for signature verify in production. |

| File |
|------|
| `src/app/api/webhook/stripe/route.js` |

---

## Phase 6 — Account linking — **DONE**

**Status:** Implemented in-repo.

| Behavior | Detail |
|----------|--------|
| **Match** | Normalize email (`trim` + `lower`) to match **`customers.email`** (same as guest RPC / checkout). |
| **Update** | **`orders.user_id`** = new session user for rows where **`customer_id`** matches that customer and **`user_id` IS NULL** (guest orders only). **Service role** client — RLS would block this for authenticated users on `user_id` null rows. |
| **Idempotent** | Re-running only touches rows still unlinked. |
| **Triggers** | **`POST /api/auth/signup`** (after successful **`signUp`**), **`POST /api/auth/signin`** (covers guest checkout while an account already exists), **`GET /auth/callback`** (email verification + OAuth). Linking failures are logged and do not fail auth. **`SUPABASE_SERVICE_ROLE_KEY`** required to run linking (skipped if unset). |

| File |
|------|
| `src/lib/account/linkGuestOrdersByEmail.js` |
| `src/app/api/auth/signup/route.js` |
| `src/app/api/auth/signin/route.js` |
| `src/app/auth/callback/route.js` |

---

## Phase 7 — Dashboard and CRM — **DONE**

**Status:** Implemented in-repo.

| Deliverable | Behavior |
|-------------|-----------|
| **`GET /api/dashboard/customers`** | **401** if no session; **403** if `profiles.role` cannot access dashboard (`canAccessDashboard`). **Staff** RLS applies on **`customers`**. Query params: **`page`**, **`pageSize`** (capped at 100), **`filter`** (`All` / `Active` / `Blocked`), **`q`** (search **`name`** / **`email`**, ILIKE; wildcards stripped). Response matches dashboard UI: **`success`**, **`data`** (listed columns), **`totalCount`**, **`stats`** (`total`, `active`, `blocked`, **`newSignups`** = created in last **30 days**), **`page`**, **`pageSize`**. Ordering: **`last_order_at`** desc (nulls last), then **`created_at`** desc. |

| File |
|------|
| `src/app/api/dashboard/customers/route.js` |

---

## Summary: database changes

| Item | Change |
|------|--------|
| **`profiles.stripe_customer_id`** | Not used. |
| **`orders.user_id`** | Nullable — guests use **`NULL`**. |
| **`customers`** | Upsert inside **`ensure_guest_customer`**. |
| **`transactions.customer_id`** | Keep **NOT NULL**. |
| **RLS** | No new anon policies on tables; **RPC + `GRANT EXECUTE TO anon`** only. |

---

## Codebase reference map

| Priority | Path | Why |
|----------|------|-----|
| Done | `migrations/guest_checkout_anon_rls.sql` | Phase 1 RPC + grants. |
| Done | `src/app/api/storefront/guest-orders/route.js` | Phase 2 guest orders + RPC + price checks. |
| Done | `src/lib/validations/guestOrders.js` | Guest checkout Zod schemas. |
| Done | `src/components/checkout/CheckoutReviewView.jsx` | Guest vs account submit. |
| Done | `src/lib/account/linkGuestOrdersByEmail.js` | Phase 6 guest **`orders.user_id`** link on auth. |
| Done | `src/app/api/auth/signup/route.js` | Phase 6 (+ account creation). |
| Done | `src/app/api/auth/signin/route.js` | Phase 6 (+ returning login). |
| Done | `src/app/auth/callback/route.js` | Phase 6 (verify / OAuth). |
| Done | `src/app/api/dashboard/customers/route.js` | Phase 7 staff customers list + stats. |
| High | `src/app/api/account/orders/route.js` | Logged-in path only. |
| Done | `src/app/api/checkout/create-checkout-session/route.js` | Phase 4 Stripe session hardening. |
| Done | `src/app/api/webhook/stripe/route.js` | Phase 5 idempotency, paid/failed, customer + transactions. |
| Done | `src/app/api/storefront/orders/[orderId]/confirmation/route.js` | Stripe-verified guest confirmation read. |
| Done | `src/components/checkout/CheckoutConfirmationView.jsx` | Guest vs account confirmation UX. |
| Lower | `docs/implementation-plan-guest-checkout-customers.md` | This file. |

---

## Suggested order of execution

1. ~~Apply **guest_checkout_anon_rls.sql** in Supabase.~~ **SQL is in repo; deploy to your project.**
2. ~~Implement guest **checkout** calling **`create_guest_checkout_order`**.~~ **Done** via `/api/storefront/guest-orders`.
3. ~~Guest **confirmation** (`session_id` + storefront confirmation route).~~ **Done.**
4. ~~**Stripe Checkout** session (order verify, shipping parity, metadata).~~ **Done (Phase 4).**
5. ~~Webhook hardening (`src/app/api/webhook/stripe/route.js`).~~ **Done (Phase 5).**
6. ~~Guest order **account linking** (`linkGuestOrdersByEmail` + auth routes).~~ **Done (Phase 6).**
7. ~~Dashboard **`GET /api/dashboard/customers`**.~~ **Done (Phase 7).**

---

## Out of scope (unless you expand)

- Saved cards / Stripe Customer per user.
- Full webhook reconciliation job.
- Tax/multi-currency parity.
