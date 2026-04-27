import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { discountIdParamSchema, discountUpdateSchema } from "@/lib/validations/discounts";

/**
 * PATCH /api/discounts/update/[id] — same pattern as products/content (validated id + maybeSingle).
 */
export async function PATCH(request, context) {
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

    const body = await request.json();

    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);

    const result = discountUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const supabase = await createClient();
    const updates = {};
    const data = result.data;

    if (data.code !== undefined) updates.code = data.code;
    if (data.type !== undefined) updates.type = data.type;
    if (data.value !== undefined) updates.value = data.value;
    if (data.status !== undefined) updates.status = data.status;

    if (data.limitUsage === false) {
      updates.usage_limit = null;
    } else if (data.limit !== undefined) {
      updates.usage_limit = data.limit || null;
    }

    if (data.startDate !== undefined) {
      updates.start_date = data.startDate ? data.startDate.toISOString() : null;
    }

    if (data.hasEndDate === false) {
      updates.end_date = null;
    } else if (data.endDate !== undefined) {
      updates.end_date = data.endDate ? data.endDate.toISOString() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: "No data provided to update." }, { status: 400 });
    }

    const { data: discount, error } = await supabase
      .from("discounts")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, message: "A discount with this code already exists." },
          { status: 409 }
        );
      }
      throw error;
    }

    if (!discount) {
      return NextResponse.json({ success: false, message: "Discount not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Discount updated.", data: { discount } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/discounts/update/[id]]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update discount." },
      { status: 500 }
    );
  }
}
