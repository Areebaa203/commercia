import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { canAccessDashboard } from "@/lib/auth/roles";
import { linkGuestOrdersToUserByEmail } from "@/lib/account/linkGuestOrdersByEmail";

const DEFAULT_POST_AUTH = "/account/orders";

function sanitizeInternalPath(path, fallback) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? DEFAULT_POST_AUTH;
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  if (error) {
    console.error("[/auth/callback] Provider error:", error, errorDescription);

    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set(
      "error",
      "Authentication failed. Missing authorization code."
    );
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[/auth/callback] Exchange error:", exchangeError.message);

    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", exchangeError.message);
    return NextResponse.redirect(loginUrl);
  }

  let redirectPath = sanitizeInternalPath(next, DEFAULT_POST_AUTH);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (user.email && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = await createAdminClient();
        const { linked } = await linkGuestOrdersToUserByEmail(admin, user.id, user.email);
        if (linked > 0) {
          console.log(`[/auth/callback] linked ${linked} guest order(s) → ${user.id}`);
        }
      } catch (e) {
        console.error("[/auth/callback] linkGuestOrdersToUserByEmail", e);
      }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role ?? "user";

    if (redirectPath === "/dashboard" || redirectPath.startsWith("/dashboard/")) {
      if (!canAccessDashboard(role)) {
        redirectPath = DEFAULT_POST_AUTH;
      }
    }
  }

  return NextResponse.redirect(new URL(redirectPath, origin));
}
