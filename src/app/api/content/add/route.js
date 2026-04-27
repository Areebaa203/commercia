import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createContentSchema } from "@/lib/validations/content";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = createContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const row = {
      title: data.title,
      description: data.description || null,
      type: data.type,
      status: data.status,
      author_id: user?.id ?? null,
      thumbnail_url: data.thumbnail_url,
      views: 0,
      likes: 0,
      comments_count: 0,
      published_at: data.published_at ? data.published_at.toISOString() : null,
    };

    const { data: content, error } = await supabase.from("content").insert(row).select().single();
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: "Content created.", data: { content } }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/content/add]", error);
    return NextResponse.json({ success: false, message: "Failed to create content." }, { status: 500 });
  }
}
