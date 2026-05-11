import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { canAccessDashboard } from "@/lib/auth/roles";

async function requireDashboardStaff(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 }) };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      error: NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 }),
    };
  }

  if (!canAccessDashboard(profile?.role)) {
    return { error: NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 }) };
  }

  return { user };
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const auth = await requireDashboardStaff(supabase);
    if (auth.error) return auth.error;

    const body = await request.json();
    const { name, email, phone, location, status } = body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (location !== undefined) updateData.location = location || null;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(`[PATCH /api/dashboard/customers/${id}]`, error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const auth = await requireDashboardStaff(supabase);
    if (auth.error) return auth.error;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error(`[DELETE /api/dashboard/customers/${id}]`, error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
