import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // "Removing" from team usually means downgrading to 'user' or deleting profile
    // If the dashboard is purely for team, we might just set role to 'user' so they can't access anymore
    const { error } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEAM_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { role } = await request.json();
    const supabase = await createClient();

    const { error } = await supabase
      .from("profiles")
      .update({ role: role.toLowerCase() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEAM_PUT_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
