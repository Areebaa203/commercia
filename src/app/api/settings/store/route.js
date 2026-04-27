import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { storeSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: settings, error } = await supabase.from("store_settings").select("*").limit(1).single();
    if (error && error.code !== "PGRST116") throw error;
    return NextResponse.json({ success: true, data: settings || {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const result = storeSettingsSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ success: false, errors: result.error.flatten() }, { status: 400 });

    const { storeName, homepageTitle, currency, timezone } = result.data;
    const { data: current } = await supabase.from("store_settings").select("id").limit(1).single();

    let query;
    if (current) {
      query = supabase.from("store_settings").update({ store_name: storeName, homepage_title: homepageTitle, currency, timezone }).eq("id", current.id);
    } else {
      query = supabase.from("store_settings").insert({ store_name: storeName, homepage_title: homepageTitle, currency, timezone });
    }

    const { data, error } = await query.select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
