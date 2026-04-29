import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

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

  // Refresh session — do NOT remove this call
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Protected routes ───────────────────────────────────────────────────
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

  const isPublic =
    publicPaths.some((p) => pathname === p) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (!isPublic && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && authEntryPaths.includes(pathname) && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
