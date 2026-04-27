import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { data: billing, error } = await supabase.from("billing_plans").select("*").eq("user_id", user.id).single();
    if (error && error.code !== "PGRST116") throw error;
    return NextResponse.json({ success: true, data: billing || { plan: "free", status: "active" } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
