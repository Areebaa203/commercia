import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { productIdParamSchema, updateProductSchema } from "@/lib/validations/products";

/**
 * PATCH /api/products/[id]
 * Body: { name, category?, status, price, stock, image_url? }
 */
export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const idResult = productIdParamSchema.safeParse(params?.id);
    if (!idResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid product id.", errors: idResult.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const id = idResult.data;

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: data.name,
        category: data.category?.trim() ? data.category.trim() : null,
        status: data.status,
        price: data.price,
        stock: data.stock,
        image_url: data.image_url ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product updated.", data: { product } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/products/[id]]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 */
export async function DELETE(_request, context) {
  try {
    const params = await context.params;
    const idResult = productIdParamSchema.safeParse(params?.id);
    if (!idResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid product id.", errors: idResult.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const id = idResult.data;

    const supabase = await createClient();

    const { data: deleted, error } = await supabase.from("products").delete().eq("id", id).select("id").maybeSingle();

    if (error) {
      throw error;
    }
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product deleted.", data: { id: deleted.id } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product." },
      { status: 500 }
    );
  }
}
