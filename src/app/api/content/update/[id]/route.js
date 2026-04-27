import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { contentIdParamSchema, updateContentSchema } from "@/lib/validations/content";

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const idResult = contentIdParamSchema.safeParse(params?.id);
    if (!idResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid content id.", errors: idResult.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const id = idResult.data;

    const body = await request.json();
    const parsed = updateContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: content, error } = await supabase
      .from("content")
      .update({
        title: data.title,
        description: data.description || null,
        type: data.type,
        status: data.status,
        thumbnail_url: data.thumbnail_url,
        published_at: data.published_at ? data.published_at.toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!content) {
      return NextResponse.json({ success: false, message: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Content updated.", data: { content } }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/content/update/[id]]", error);
    return NextResponse.json({ success: false, message: "Failed to update content." }, { status: 500 });
  }
}
