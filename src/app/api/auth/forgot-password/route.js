import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { authRedirectUrl } from "@/utils/site-url";

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 *
 * set a new password on /reset-password.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Validate ───────────────────────────────────────────────────────
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 422 }
      );
    }

    const { email } = result.data;

    // ── 2. Send email ─────────────────────────────────────────────────
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authRedirectUrl("/auth/callback?next=/reset-password", request),
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // Always return success — avoids exposing whether the email is registered
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a reset code has been sent.",
        email, // pass back so the UI can display which email was used
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/auth/forgot-password]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
