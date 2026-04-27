import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { notificationSettingsSchema } from "@/lib/validations/settings";

/**
 * Logic: User preferences are stored in a dedicated 'user_preferences' table 
 * linked to the user's UUID.
 */

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // If no preferences found (or table doesn't exist yet), return defaults
    if (error || !prefs) {
      return NextResponse.json({
        success: true,
        data: {
          emailOrders: true,
          emailStock: true,
          emailMarketing: false,
          pushOrders: true,
          pushMessages: true,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        emailOrders: prefs.email_orders,
        emailStock: prefs.email_stock,
        emailMarketing: prefs.email_marketing,
        pushOrders: prefs.push_orders,
        pushMessages: prefs.push_messages,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = notificationSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.error.flatten() }, { status: 400 });
    }

    const { emailOrders, emailStock, emailMarketing, pushOrders, pushMessages } = result.data;

    const { error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: user.id,
        email_orders: emailOrders,
        email_stock: emailStock,
        email_marketing: emailMarketing,
        push_orders: pushOrders,
        push_messages: pushMessages,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) throw error;

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[NOTIFICATIONS_PUT_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
