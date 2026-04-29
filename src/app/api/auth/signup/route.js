import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/signup
 * Body: { fullName, email, password, confirmPassword, terms }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Validate with Zod ──────────────────────────────────────────────
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 422 }
      );
    }

    const { fullName, email, password } = result.data;
    const requestUrl = new URL(request.url);

    // ── 2. Create Supabase client & call signUp ───────────────────────────
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // After email confirmation Supabase redirects to /auth/callback → dashboard
        emailRedirectTo: `${requestUrl.origin}/auth/callback?next=/dashboard`,
      },
    });

    // ── 3. Handle Already Registered explicitly ───────────────────────────
    // if Supabase actually created a login method
    if (!error && data?.user?.identities?.length === 0) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created! Please check your email to verify your account before signing in.",
        userId: data.user?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[/api/auth/signup]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
