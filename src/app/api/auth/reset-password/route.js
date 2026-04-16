import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resetPasswordSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/reset-password
 * Body: { password, confirmPassword }
 *
 * Called AFTER the user has verified their OTP (they hold a valid session).
 * Updates the authenticated user's password.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Validate ───────────────────────────────────────────────────────
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 422 }
      );
    }

    const { password } = result.data;

    // ── 2. Ensure user has an active session ──────────────────────────────
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Session expired. Please restart the password reset process.",
        },
        { status: 401 }
      );
    }

    // ── 3. Update password ────────────────────────────────────────────────
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Supabase rejects reusing the same password
      if (error.message.toLowerCase().includes("same password")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "New password must be different from your current password.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Password updated successfully. You can now sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/auth/reset-password]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
