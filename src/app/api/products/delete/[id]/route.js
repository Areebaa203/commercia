import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { productIdParamSchema } from "@/lib/validations/products";
import { inferCloudinaryPublicIdFromUrl, parseProductImages } from "@/lib/product-images";
import {
  configureCloudinaryFromEnv,
  destroyCloudinaryImage,
  UPLOAD_FOLDER_PREFIX,
} from "@/lib/cloudinary-admin";

/**
 * DELETE /api/products/delete/[id]
 * Removes DB row, then best-effort deletes Cloudinary assets for that product.
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

    const { data: row, error: selectError } = await supabase
      .from("products")
      .select("id, image_url")
      .eq("id", id)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }
    if (!row) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    const cloudinaryIds = parseProductImages(row.image_url)
      .map((img) => img.publicId?.trim() || inferCloudinaryPublicIdFromUrl(img.url))
      .filter((id) => typeof id === "string" && id.startsWith(UPLOAD_FOLDER_PREFIX));

    if (cloudinaryIds.length > 0) {
      const cfg = configureCloudinaryFromEnv();
      if (!cfg.ok) {
        return NextResponse.json(
          { success: false, message: "Cloudinary is not configured for image cleanup." },
          { status: 503 }
        );
      }

      const failedIds = [];
      for (const publicId of [...new Set(cloudinaryIds)]) {
        try {
          await destroyCloudinaryImage(publicId);
        } catch (e) {
          console.error("[DELETE /api/products/delete] Cloudinary cleanup:", e?.message || e);
          failedIds.push(publicId);
        }
      }

      if (failedIds.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Could not delete one or more Cloudinary images. Product was not deleted. Please retry.",
          },
          { status: 502 }
        );
      }
    }

    const { data: deleted, error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      throw deleteError;
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
