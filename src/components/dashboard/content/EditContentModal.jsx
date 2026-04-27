"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentFormSchema } from "@/lib/validations/content";
import { parseProductImageUrls, parseProductImages, stringifyProductImages } from "@/lib/product-images";
import ProductImagesField from "@/components/dashboard/products/ProductImagesField";
import ProductVideoField from "@/components/dashboard/products/ProductVideoField";

const EditContentModal = ({ isOpen, onClose, content, onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      type: "article",
      status: "draft",
      description: "",
      image_url: "[]",
      video_asset_url: "[]",
      publishDate: "",
      publishTime: "",
      author: "",
    },
    mode: "onSubmit",
  });

  const contentType = watch("type");
  const status = watch("status");

  const formatDateInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };
  const formatTimeInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(11, 16);
  };

  const thumbToImageUrlJson = (raw) => {
    const s = (raw && String(raw).trim()) || "";
    if (!s) return "[]";
    return stringifyProductImages(parseProductImages(s));
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (content) {
        const t = (content.type || "article").toLowerCase();
        const mediaJson = thumbToImageUrlJson(content.thumbnail_url || content.thumbnail);
        reset({
          title: content.title || "",
          type: t,
          status: (content.status || "draft").toLowerCase(),
          description: content.description || "",
          image_url: t === "video" ? "[]" : mediaJson,
          video_asset_url: t === "video" ? mediaJson : "[]",
          publishDate: formatDateInput(content.published_at),
          publishTime: formatTimeInput(content.published_at),
          author: content.author_name || content.author || "",
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, content, reset]);

  if (!isVisible && !isOpen) return null;

  const onSubmit = async (values) => {
    if (!content?.id) return;
    const publishDate = values.publishDate?.trim();
    const publishTime = values.publishTime?.trim();
    const publishedAt = publishDate && publishTime ? new Date(`${publishDate}T${publishTime}:00`).toISOString() : null;

    const thumbnail_url =
      values.type === "video"
        ? parseProductImageUrls(values.video_asset_url)[0] || ""
        : parseProductImageUrls(values.image_url)[0] || "";

    const payload = {
      title: values.title,
      description: values.description,
      type: values.type,
      status: values.status,
      thumbnail_url,
      published_at: publishedAt,
    };

    setLoading(true);
    try {
      await axios.patch(`/api/content/update/${content.id}`, payload);
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.response?.data?.errors && Object.values(error.response.data.errors).flat().join(" ")) ||
        error.message ||
        "Failed to update content.";
      console.error("Error updating content:", msg);
      setErrorDialog({ open: true, message: "Failed to update content: " + msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={clsx(
          "absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={clsx(
          "relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Sticky header (first row) */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Edit Content</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {content && (
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* Scrollable form fields */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
                {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Type</label>
                  <select
                    {...register("type")}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="banner">Banner</option>
                    <option value="product">Product Promotion</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Status</label>
                  <select
                    {...register("status")}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {/* Conditional Schedule Fields */}
              {status === "scheduled" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Publish Date</label>
                    <input
                      type="date"
                      {...register("publishDate")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Publish Time</label>
                    <input
                      type="time"
                      {...register("publishTime")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-600"
                    />
                  </div>
                </div>
              )}
              {status === "scheduled" && errors.publishDate && (
                <p className="text-xs text-red-600">{errors.publishDate.message}</p>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  {...register("author")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Description</label>
                <textarea
                  rows="3"
                  {...register("description")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 resize-none"
                ></textarea>
              </div>

              {contentType === "video" ? (
                <>
                  <input type="hidden" {...register("video_asset_url")} />
                  <ProductVideoField
                    label="Video"
                    maxVideos={1}
                    value={watch("video_asset_url")}
                    onChange={(json) => setValue("video_asset_url", json, { shouldValidate: true })}
                    errorMessage={errors.video_asset_url?.message}
                    disabled={loading}
                  />
                </>
              ) : (
                <>
                  <input type="hidden" {...register("image_url")} />
                  <ProductImagesField
                    label="Images"
                    value={watch("image_url")}
                    onChange={(json) => setValue("image_url", json, { shouldValidate: true })}
                    errorMessage={errors.image_url?.message}
                    disabled={loading}
                  />
                </>
              )}
            </div>

            {/* Sticky footer (last row) */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2 min-w-[8.5rem] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Icon icon="mingcute:loading-fill" className="animate-spin shrink-0" width="18" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent className="z-[60]">
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ open: false, message: "" })}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditContentModal;
