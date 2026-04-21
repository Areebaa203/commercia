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
import { createProductSchema } from "@/lib/validations/products";
import ProductImagesField from "@/components/dashboard/products/ProductImagesField";

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
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
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      category: "",
      status: "active",
      price: "",
      stock: "",
      image_url: "[]",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/products/add", data);
      onSuccess?.();
      onClose();
      reset();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(" ")) ||
        error.message ||
        "Failed to add product.";
      console.error("Error adding product:", msg);
      setErrorDialog({ open: true, message: "Failed to add product: " + msg });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible && !isOpen) return null;

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
          <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* Scrollable form fields */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g. Wireless Headphones"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Category</label>
                <select
                  {...register("category")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Fitness">Fitness</option>
                </select>
                {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && <p className="text-xs text-red-600">{errors.status.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>
                {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  {...register("stock")}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
                {errors.stock && <p className="text-xs text-red-600">{errors.stock.message}</p>}
              </div>
            </div>

            <input type="hidden" {...register("image_url")} />
            <ProductImagesField
              value={watch("image_url")}
              onChange={(json) => setValue("image_url", json, { shouldValidate: true })}
              errorMessage={errors.image_url?.message}
              disabled={loading}
            />
          </div>

          {/* Sticky footer (last row) */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
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
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
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

export default AddProductModal;
