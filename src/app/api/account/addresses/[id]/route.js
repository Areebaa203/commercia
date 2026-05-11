import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isDefault, ...rest } = body;

    if (isDefault) {
      // Unset other defaults for this user
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await supabase
      .from("addresses")
      .update({
        first_name: body.firstName,
        last_name: body.lastName,
        address: body.address,
        apartment: body.apartment,
        city: body.city,
        state: body.state,
        zip_code: body.zipCode,
        country: body.country,
        phone: body.phone,
        is_default: isDefault
      })
      .eq("id", id)
      .eq("user_id", user.id) // Security check
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
