import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { contentIdParamSchema } from "@/lib/validations/content";
import { inferCloudinaryPublicIdFromUrl, inferCloudinaryResourceTypeFromUrl } from "@/lib/product-images";
import {
  configureCloudinaryFromEnv,
  destroyCloudinaryAsset,
  UPLOAD_FOLDER_PREFIX,
} from "@/lib/cloudinary-admin";

export async function DELETE(_request, context) {
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
    const supabase = await createClient();

    const { data: row, error: selectError } = await supabase
      .from("content")
      .select("id,thumbnail_url")
      .eq("id", id)
      .maybeSingle();
    if (selectError) {
      throw selectError;
    }
    if (!row) {
      return NextResponse.json({ success: false, message: "Content not found." }, { status: 404 });
    }

    const publicId = inferCloudinaryPublicIdFromUrl(row.thumbnail_url);
    if (publicId?.startsWith(UPLOAD_FOLDER_PREFIX)) {
      const cfg = configureCloudinaryFromEnv();
      if (!cfg.ok) {
        return NextResponse.json({ success: false, message: "Cloudinary is not configured for cleanup." }, { status: 503 });
      }
      try {
        const resourceType = inferCloudinaryResourceTypeFromUrl(row.thumbnail_url);
        await destroyCloudinaryAsset(publicId, resourceType);
      } catch (err) {
        console.error("[DELETE /api/content/delete] Cloudinary cleanup:", err?.message || err);
        return NextResponse.json(
          { success: false, message: "Could not delete Cloudinary thumbnail. Content was not deleted." },
          { status: 502 }
        );
      }
    }

    const { data: deleted, error: deleteError } = await supabase
      .from("content")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      throw deleteError;
    }
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Content deleted.", data: { id: deleted.id } }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/content/delete/[id]]", error);
    return NextResponse.json({ success: false, message: "Failed to delete content." }, { status: 500 });
  }
}
