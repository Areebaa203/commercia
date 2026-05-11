import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const filter = searchParams.get("filter") || "All";
    const q = searchParams.get("q") || "";
    const statusFilter = searchParams.get("status") || "All";
    const paymentFilter = searchParams.get("payment") || "All";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabase = await createClient();

    // Fetch total counts for stats
    const { data: allStats, error: statsError } = await supabase
      .from("orders")
      .select("status, payment_status");

    if (statsError) throw statsError;

    const stats = {
      total: allStats.length,
      pending: allStats.filter(o => o.payment_status === "pending" || o.status === "processing").length,
      completed: allStats.filter(o => o.status === "delivered").length,
      refunded: allStats.filter(o => o.payment_status === "refunded").length,
    };

    // Build the query for orders
    let query = supabase
      .from("orders")
      .select(`
        *,
        customer:customers(
          id,
          name,
          email,
          avatar_url
        )
      `, { count: "exact" });

    // Apply main tabs filters
    if (filter === "Paid") {
      query = query.eq("payment_status", "paid");
    } else if (filter === "Pending") {
      query = query.eq("payment_status", "pending");
    } else if (filter === "Cancelled") {
      query = query.eq("status", "cancelled");
    } else if (filter === "Returns") {
      query = query.eq("status", "returned");
    }

    // Apply additional filters from dropdown
    if (statusFilter !== "All") {
      query = query.eq("status", statusFilter.toLowerCase());
    }
    if (paymentFilter !== "All") {
      query = query.eq("payment_status", paymentFilter.toLowerCase());
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      // If only date is provided, make sure it covers the full day
      const end = new Date(endDate);
      if (end.getHours() === 0 && end.getMinutes() === 0) {
        end.setHours(23, 59, 59, 999);
      }
      query = query.lte("created_at", end.toISOString());
    }

    if (q) {
      query = query.or(`order_number.ilike.%${q}%`);
    }

    // Apply sorting and pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: orders, error: ordersError, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (ordersError) throw ordersError;

    return NextResponse.json({
      success: true,
      data: orders || [],
      totalCount: count || 0,
      stats,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/orders]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
