import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "All";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    let query = supabase
      .from("discounts")
      .select("*", { count: "exact" });

    if (q) {
      query = query.ilike("code", `%${q}%`);
    }

    if (status !== "All") {
      query = query.eq("status", status.toLowerCase());
    }

    const { data: discounts, count: totalCount, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const { data: allData } = await supabase
      .from("discounts")
      .select("status, used_count, value, type");

    let totalActive = 0;
    let totalRedemptions = 0;
    let totalSaved = 0;

    if (allData) {
      allData.forEach((d) => {
        if (d.status === "active") totalActive++;
        totalRedemptions += d.used_count || 0;

        // Roughly approximate Total Saved for these demo stats, assuming ~$100 avg order base for percentages
        const valBase = d.type === "fixed" ? d.value : d.type === "percentage" ? (d.value / 100) * 100 : 5.00; // $5 for free shipping approx
        totalSaved += (d.used_count || 0) * valBase;
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          discounts: discounts || [],
          totalCount: totalCount || 0,
          page,
          pageSize,
          stats: {
            active: totalActive,
            redemptions: totalRedemptions,
            saved: totalSaved,
          }
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/discounts]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch discounts." },
      { status: 500 }
    );
  }
}
