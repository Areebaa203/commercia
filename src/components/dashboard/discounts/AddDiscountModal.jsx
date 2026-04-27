"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { discountSchema } from "@/lib/validations/discounts";
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

const AddDiscountModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: "",
      startDate: new Date(),
      hasEndDate: false,
      endDate: null,
      limitUsage: false,
      limit: "",
      limitOnePerUser: false,
    },
    mode: "onChange",
  });

  const discountType = watch("type");
  const hasEndDate = watch("hasEndDate");
  const limitUsage = watch("limitUsage");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        reset({
          code: initialData.code || "",
          type: initialData.type || "percentage",
          value: initialData.value ? String(initialData.value) : "",
          startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
          hasEndDate: !!initialData.endDate,
          endDate: initialData.endDate ? new Date(initialData.endDate) : null,
          limitUsage: initialData.limit !== undefined && initialData.limit !== "Unlimited",
          limit: initialData.limit !== "Unlimited" ? String(initialData.limit || "") : "",
          limitOnePerUser: false, // Could be hydrated if present in db
        });
      } else {
        reset({
          code: "",
          type: "percentage",
          value: "",
          startDate: new Date(),
          hasEndDate: false,
          endDate: null,
          limitUsage: false,
          limit: "",
          limitOnePerUser: false,
        });
      }
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, initialData, reset]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("code", result, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        code: data.code,
        type: data.type,
        value: data.value !== "" && data.value != null ? Number(data.value) : 0,
        startDate: data.startDate.toISOString(),
        hasEndDate: data.hasEndDate,
        endDate: data.hasEndDate && data.endDate ? data.endDate.toISOString() : null,
        limitUsage: data.limitUsage,
        limitOnePerUser: data.limitOnePerUser,
        status: "Active",
      };
      if (data.limitUsage && data.limit !== "" && data.limit != null) {
        payload.limit = Number(data.limit);
      }

      if (initialData) {
        await axios.patch(`/api/discounts/update/${initialData.id}`, payload);
      } else {
        await axios.post("/api/discounts/add", payload);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(" ")) ||
        error.message ||
        "Failed to save discount.";
      console.error("Error saving discount:", msg);
      setErrorDialog({ open: true, message: "Failed to save discount: " + msg });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Discount" : "Create Discount"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-4">
            {/* Discount Code Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Discount Code</label>
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Generate random code
                </button>
              </div>
              <input
                type="text"
                {...register("code")}
                onChange={(e) => setValue("code", e.target.value.toUpperCase(), { shouldValidate: true })}
                placeholder="e.g. SUMMER2024"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Customers will enter this code at checkout.</p>
              {errors.code && <p className="text-xs text-red-600 font-medium">{errors.code.message}</p>}
            </div>

            {/* Discount Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Discount Type</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: "percentage", label: "Percentage", icon: "mingcute:tag-2-fill" },
                  { id: "fixed", label: "Fixed Amount", icon: "mingcute:currency-dollar-fill" },
                  { id: "free_shipping", label: "Free Shipping", icon: "mingcute:truck-fill" },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setValue("type", type.id, { shouldValidate: true })}
                    className={clsx(
                      "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:outline-none",
                      discountType === type.id
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <Icon icon={type.icon} className="text-lg" />
                    {type.label}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-xs text-red-600 font-medium">{errors.type.message}</p>}
            </div>

            {/* Value Section */}
            {discountType !== "free_shipping" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Discount Value</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register("value")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={discountType === "percentage" ? "20" : "10.00"}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon
                      icon={discountType === "percentage" ? "mingcute:tag-2-fill" : "mingcute:currency-dollar-fill"}
                      className="text-lg"
                    />
                  </div>
                </div>
                {errors.value && <p className="text-xs text-red-600 font-medium">{errors.value.message}</p>}
              </div>
            )}

            {/* Active Dates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Active Dates</label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-gray-500">Start Date</label>
                  <div className="relative">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Icon icon="mingcute:calendar-line" />
                    </div>
                  </div>
                  {errors.startDate && <p className="mt-1 text-xs text-red-600 font-medium">{errors.startDate.message}</p>}
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-gray-500">End Date</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("hasEndDate")}
                        id="hasEndDate"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="hasEndDate" className="text-xs text-gray-500 cursor-pointer select-none">Set End Date</label>
                    </div>
                  </div>
                  <div className={clsx("relative", !hasEndDate && "opacity-50 pointer-events-none")}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          placeholderText="No expiration"
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Icon icon="mingcute:calendar-line" />
                    </div>
                  </div>
                  {errors.endDate && <p className="mt-1 text-xs text-red-600 font-medium">{errors.endDate.message}</p>}
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Usage Limits (Optional)</label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    {...register("limitUsage")}
                    id="limitUsage"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="limitUsage" className="text-sm text-gray-600 select-none cursor-pointer">Limit number of times this discount can be used in total</label>
                </div>
                {limitUsage && (
                   <div className="pl-7">
                     <input
                       type="number"
                       {...register("limit")}
                       placeholder="e.g. 100"
                       className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                     />
                     {errors.limit && <p className="mt-1 text-xs text-red-600 font-medium">{errors.limit.message}</p>}
                   </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input
                  type="checkbox"
                  {...register("limitOnePerUser")}
                  id="limitOnePerUser"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="limitOnePerUser" className="text-sm text-gray-600 select-none cursor-pointer">Limit to one use per customer</label>
              </div>
            </div>

          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors inline-flex items-center gap-2 disabled:opacity-50 min-w-[8.5rem] justify-center"
            >
              {loading ? (
                <>
                  <Icon icon="mingcute:loading-fill" className="animate-spin shrink-0" width="18" />
                  Saving...
                </>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Create Discount"
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

export default AddDiscountModal;
