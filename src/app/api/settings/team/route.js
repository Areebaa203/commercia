import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch all internal users from the profiles table
    // We can filter out general 'user' role if needed, but the request says "those who logged in"
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[TEAM_GET_ERROR]", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const formatted = profiles.map(p => ({
      id: p.id, // Profile ID is the same as Auth User ID here
      userId: p.id,
      name: p.full_name || "Unknown User",
      email: p.email,
      avatar: p.avatar_url,
      role: p.role.charAt(0).toUpperCase() + p.role.slice(1), 
      joinedAt: p.created_at,
      status: "Active"
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ success: false, message: "Email and role are required" }, { status: 400 });
    }

    // Since users shows up when they log in, "Adding" a member here might mean 
    // updating an existing user's role or inviting them.
    // Logic: Find profile by email and update role.
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found. They must sign up first to appear in the system." 
      }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: role.toLowerCase() })
      .eq("id", profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEAM_POST_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
