import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { canAccessDashboard } from "@/lib/auth/roles";

const MAX_PAGE_SIZE = 100;
const SEARCH_MAX_LEN = 80;

function clampInt(n, fallback, min, max) {
  const v = parseInt(String(n), 10);
  if (Number.isNaN(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

/** Strip LIKE wildcards so user search cannot broaden matches. */
function sanitizeSearchTerm(q) {
  return String(q ?? "")
    .trim()
    .slice(0, SEARCH_MAX_LEN)
    .replace(/[%_,\\]/g, "")
    .replace(/,/g, "")
    .replace(/"/g, "");
}

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
    console.error("[GET /api/dashboard/customers] profile", error);
    return {
      error: NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 }),
    };
  }

  if (!canAccessDashboard(profile?.role)) {
    return { error: NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 }) };
  }

  return { user };
}

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const page = clampInt(searchParams.get("page"), 1, 1, 1_000_000);
    const pageSize = clampInt(searchParams.get("pageSize"), 10, 1, MAX_PAGE_SIZE);
    const filter = (searchParams.get("filter") || "All").trim();
    const qRaw = searchParams.get("q") || "";
    const search = sanitizeSearchTerm(qRaw);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? true : false;
    const minSpent = parseFloat(searchParams.get("minSpent") || "0");
    const minOrders = parseInt(searchParams.get("minOrders") || "0");
    const location = searchParams.get("location");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();

    const [totalRes, activeRes, blockedRes, newSignupsRes] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("customers").select("*", { count: "exact", head: true }).eq("status", "blocked"),
      supabase.from("customers").select("*", { count: "exact", head: true }).gte("created_at", since),
    ]);

    for (const res of [totalRes, activeRes, blockedRes, newSignupsRes]) {
      if (res.error) throw res.error;
    }

    const stats = {
      total: totalRes.count ?? 0,
      active: activeRes.count ?? 0,
      blocked: blockedRes.count ?? 0,
      newSignups: newSignupsRes.count ?? 0,
    };

    let query = supabase
      .from("customers")
      .select(
        `
        id,
        name,
        email,
        phone,
        location,
        avatar_url,
        status,
        total_orders,
        total_spent,
        last_order_at,
        created_at
      `,
        { count: "exact" }
      );

    // Apply main tabs filters
    if (filter === "Active") {
      query = query.eq("status", "active");
    } else if (filter === "Blocked") {
      query = query.eq("status", "blocked");
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      if (end.getHours() === 0 && end.getMinutes() === 0) {
        end.setHours(23, 59, 59, 999);
      }
      query = query.lte("created_at", end.toISOString());
    }

    if (minSpent > 0) {
      query = query.gte("total_spent", minSpent);
    }
    if (minOrders > 0) {
      query = query.gte("total_orders", minOrders);
    }
    if (location && location !== "All") {
      query = query.ilike("location", `%${location}%`);
    }

    if (search) {
      const pattern = `%${search}%`;
      query = query.or(`name.ilike.${pattern},email.ilike.${pattern}`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: customers, error: listError, count } = await query
      .order(sortBy, { ascending: sortOrder, nullsFirst: false })
      .range(from, to);

    if (listError) throw listError;

    return NextResponse.json({
      success: true,
      data: customers || [],
      totalCount: count ?? 0,
      stats,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/customers]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    const body = await request.json();
    const { name, email, phone, location, status } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          email: email || null,
          phone: phone || null,
          location: location || null,
          status: status || "active",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[POST /api/dashboard/customers]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
