import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { canAccessDashboard, postAuthPathForRole } from "@/lib/auth/roles";

async function fetchProfileRole(supabase, userId) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role ?? "user";
}

/**
 * Refreshes the user session inside middleware so cookies stay up-to-date
 * on every request. Returns the (possibly modified) response.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/auth/callback",
  ];

  const authEntryPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];

  const isDashboardPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isPublic =
    publicPaths.some((p) => pathname === p) ||
    pathname.startsWith("/journal") ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/contact" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname.startsWith("/search") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/shop-all" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/api/auth") ||
    // Catalog + guest checkout: routes enforce their own rules (e.g. Stripe on confirmation)
    pathname.startsWith("/api/storefront/") ||
    // Stripe (and other providers) call webhooks without a user session; do not redirect them to login
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (!isPublic && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  const needsRole =
    !!user &&
    (isDashboardPath ||
      authEntryPaths.includes(pathname));

  let profileRole = null;
  if (needsRole) {
    profileRole = await fetchProfileRole(supabase, user.id);
  }

  if (user && isDashboardPath && !canAccessDashboard(profileRole)) {
    return NextResponse.redirect(new URL("/account/orders", request.url));
  }

  if (user && authEntryPaths.includes(pathname)) {
    return NextResponse.redirect(new URL(postAuthPathForRole(profileRole), request.url));
  }

  return supabaseResponse;
}
