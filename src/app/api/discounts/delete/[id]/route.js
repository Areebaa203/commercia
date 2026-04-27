import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { discountIdParamSchema } from "@/lib/validations/discounts";

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const idResult = discountIdParamSchema.safeParse(params?.id);
    if (!idResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid discount id.", errors: idResult.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const id = idResult.data;

    const supabase = await createClient();

    const { error } = await supabase
      .from("discounts")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Discount deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/discounts/delete/[id]]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete discount." },
      { status: 500 }
    );
  }
}
