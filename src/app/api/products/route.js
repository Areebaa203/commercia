import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createProductSchema, productListQuerySchema } from "@/lib/validations/products";

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=200&auto=format&fit=crop";

function applyProductFilters(query, { q, status, category, stockStatus, priceRange }) {
  let nextQuery = query;

  if (q) {
    nextQuery = nextQuery.ilike("name", `%${q}%`);
  }

  if (status !== "All") {
    const normalizedStatus = status === "Archive" ? "archived" : status.toLowerCase();
    nextQuery = nextQuery.eq("status", normalizedStatus);
  }

  if (category !== "All") {
    nextQuery = nextQuery.eq("category", category);
  }

  if (stockStatus !== "All") {
    if (stockStatus === "In Stock") nextQuery = nextQuery.gt("stock", 0);
    if (stockStatus === "Low Stock") nextQuery = nextQuery.lt("stock", 10).gt("stock", 0);
    if (stockStatus === "Out of Stock") nextQuery = nextQuery.eq("stock", 0);
  }

  if (priceRange !== "All") {
    if (priceRange === "Under $50") nextQuery = nextQuery.lt("price", 50);
    if (priceRange === "$50 - $100") nextQuery = nextQuery.gte("price", 50).lte("price", 100);
    if (priceRange === "$100 - $500") nextQuery = nextQuery.gt("price", 100).lte("price", 500);
    if (priceRange === "Over $500") nextQuery = nextQuery.gt("price", 500);
  }

  return nextQuery;
}

export async function GET(request) {
  try {
    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const result = productListQuerySchema.safeParse(rawQuery);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters.",
          errors: result.error.fieldErrors,
        },
        { status: 422 }
      );
    }

    const filters = result.data;
    const { page, pageSize } = filters;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    const productQuery = applyProductFilters(
      supabase
        .from("products")
        .select(
          "id,name,category,status,stock,price,sales,image_url,created_at",
          { count: "exact" }
        ),
      filters
    );

    const { data: products, count: totalCount, error: productsError } = await productQuery
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (productsError) {
      throw productsError;
    }

    const { data: stockRows, error: statsError } = await supabase.from("products").select("stock");
    if (statsError) {
      throw statsError;
    }

    const total = stockRows?.length ?? 0;
    const inStock = stockRows?.filter((p) => p.stock > 0).length ?? 0;
    const lowStock = stockRows?.filter((p) => p.stock < 10 && p.stock > 0).length ?? 0;
    const outOfStock = stockRows?.filter((p) => p.stock === 0).length ?? 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          products: products ?? [],
          totalCount: totalCount ?? 0,
          page,
          pageSize,
          stats: {
            total,
            inStock,
            lowStock,
            outOfStock,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/products]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Body: { name, category?, status?, price, stock?, image_url? }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: result.error.fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = result.data;
    const supabase = await createClient();

    const row = {
      name: data.name,
      category: data.category?.trim() ? data.category.trim() : null,
      status: data.status,
      price: data.price,
      stock: data.stock,
      image_url: data.image_url ?? DEFAULT_PRODUCT_IMAGE,
      sales: 0,
    };

    const { data: product, error } = await supabase.from("products").insert(row).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Product created.", data: { product } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product." },
      { status: 500 }
    );
  }
}
