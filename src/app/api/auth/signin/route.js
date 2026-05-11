import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { signInSchema } from "@/lib/validations/auth";
import { postAuthPathForRole } from "@/lib/auth/roles";
import { linkGuestOrdersToUserByEmail } from "@/lib/account/linkGuestOrdersByEmail";

/**
 * POST /api/auth/signin
 * Body: { email, password }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Validate with Zod ──────────────────────────────────────────────
    const result = signInSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 422 }
        // submitting data is invalid
      );
    }

    const { email, password } = result.data;

    // ── 2. Sign in with Supabase ──────────────────────────────────────────
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Invalid credentials keep message like this for security
      if (
        error.message.toLowerCase().includes("invalid") ||
        error.message.toLowerCase().includes("credentials")
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password." },
          { status: 401 }
        );
      }
      // Email not confirmed
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please verify your email address before signing in. Check your inbox.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (data.user?.id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = await createAdminClient();
        const { linked } = await linkGuestOrdersToUserByEmail(
          admin,
          data.user.id,
          data.user.email ?? email
        );
        if (linked > 0) {
          console.log(`[/api/auth/signin] linked ${linked} guest order(s) → ${data.user.id}`);
        }
      } catch (linkErr) {
        console.error("[/api/auth/signin] linkGuestOrdersToUserByEmail", linkErr);
      }
    }

    const redirectTo = postAuthPathForRole(profile?.role ?? "user");

    return NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        redirectTo,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          fullName: data.user?.user_metadata?.full_name,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/auth/signin]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
