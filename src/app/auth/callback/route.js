import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  // /auth/callback?error=access_denied&error_description=User+canceled
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

  const safeNext = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(new URL(safeNext, origin));
}