import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";
import { authRedirectUrl } from "@/utils/site-url";
import { linkGuestOrdersToUserByEmail } from "@/lib/account/linkGuestOrdersByEmail";

/**
 * POST /api/auth/signup
 * Body: { firstName, lastName, email, password, marketingOptOut? }
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

    const { firstName, lastName, email, password } = result.data;
    const fullName = `${firstName} ${lastName}`.trim();

    // ── 2. Create Supabase client & call signUp ───────────────────────────
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // After email confirmation → storefront account area
        emailRedirectTo: authRedirectUrl("/auth/callback?next=/account/orders", request),
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

    const newUserId = data.user?.id;
    if (newUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = await createAdminClient();
        const { linked } = await linkGuestOrdersToUserByEmail(admin, newUserId, email);
        if (linked > 0) {
          console.log(`[/api/auth/signup] linked ${linked} guest order(s) → ${newUserId}`);
        }
      } catch (linkErr) {
        console.error("[/api/auth/signup] linkGuestOrdersToUserByEmail", linkErr);
      }
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
