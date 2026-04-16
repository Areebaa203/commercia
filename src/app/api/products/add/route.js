import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createProductSchema } from "@/lib/validations/products";

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=200&auto=format&fit=crop";

/**
 * POST /api/products/add
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

    const { data: product, error } = await supabase
      .from("products")
      .insert(row)
      .select()
      .single();

    console.log("product", product);
    console.log("error", error);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Product created.", data: { product } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/products/add]", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product." },
      { status: 500 }
    );
  }
}
