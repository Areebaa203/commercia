import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { discountSchema } from "@/lib/validations/discounts";

export async function POST(request) {
  try {
    const body = await request.json();

    // We parse the dates back to objects for Zod schema, as JSON body has ISO strings
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);

    const result = discountSchema.safeParse(body);

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

    const { code, type, value, startDate, endDate, limit } = result.data;

    const supabase = await createClient();

    const row = {
      code: code,
      type: type,
      value: value || 0,
      status: body.status ? body.status.toLowerCase() : 'active',
      used_count: 0,
      usage_limit: limit || null,
      start_date: startDate.toISOString(),
      end_date: endDate ? endDate.toISOString() : null,
    };

    const { data: discount, error } = await supabase
      .from("discounts")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { success: false, message: "A discount with this code already exists." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Discount created.", data: { discount } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/discounts/add]", error);
    return NextResponse.json(
      { success: false, message: "Failed to create discount." },
      { status: 500 }
    );
  }
}
