import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const category = searchParams.get("category") || "All";
    const priceMin = parseFloat(searchParams.get("priceMin") || "0");
    const priceMax = parseFloat(searchParams.get("priceMax") || "999999");
    const sort = searchParams.get("sort") || "best";
    const q = searchParams.get("q") || "";

    const supabase = await createClient();

    // Start building the query
    let query = supabase
      .from("products")
      .select("*", { count: "exact" });

    // Apply search filter
    if (q) {
      query = query.ilike("name", `%${q}%`);
    }

    // Apply category filter (Room in UI)
    if (category !== "All") {
      const categories = category.split(",");
      // Try to match both exact (as passed) and capitalized (as in seed data)
      const expandedCategories = [
        ...categories,
        ...categories.map(c => c.charAt(0).toUpperCase() + c.slice(1))
      ];
      query = query.in("category", expandedCategories);
    }

    // Apply price filter
    query = query.gte("price", priceMin).lte("price", priceMax);

    // Apply sorting
    if (sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (sort === "reviews") {
      // Note: If reviews column doesn't exist, we might need to fallback.
      // Assuming it might be added or we just order by created_at for now if missing.
      query = query.order("created_at", { ascending: false });
    } else {
      // Default: best (could be based on sales or just newest)
      query = query.order("sales", { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: products, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        products: products || [],
        totalCount: count || 0,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("[GET /api/storefront/products]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
