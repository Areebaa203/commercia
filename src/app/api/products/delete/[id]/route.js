import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { productIdParamSchema } from "@/lib/validations/products";

/**
 * DELETE /api/products/delete/[id]
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

    const { data: deleted, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

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
    console.error("[DELETE /api/products/delete/[id]]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product." },
      { status: 500 }
    );
  }
}
