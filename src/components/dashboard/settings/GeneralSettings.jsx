"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingsSchema } from "@/lib/validations/settings";
import { useToast } from "@/hooks/use-toast";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "",
      homepageTitle: "",
      supportEmail: "",
      currency: "PKR",
      timezone: "Asia/Karachi",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings/store");
        const json = await res.json();
        if (json.success && json.data) {
          reset({
            storeName: json.data.store_name || "",
            homepageTitle: json.data.homepage_title || "",
            supportEmail: json.data.support_email || "",
            currency: json.data.currency || "PKR",
            timezone: json.data.timezone || "Asia/Karachi",
          });
        }
      } catch (error) {
        console.error("Failed to fetch store settings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/settings/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Success",
          description: "Store settings updated successfully.",
        });
      } else {
        throw new Error(json.message || "Failed to update store settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex h-32 items-center justify-center">
      <Icon icon="mingcute:loading-fill" className="animate-spin text-2xl text-blue-600" />
    </div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Store Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store Name</label>
            <div className="relative">
              <input
                type="text"
                {...register("storeName")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:store-2-line" className="text-lg" />
              </div>
            </div>
            {errors.storeName && <p className="text-xs text-red-500">{errors.storeName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Homepage Title</label>
            <div className="relative">
              <input
                type="text"
                {...register("homepageTitle")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:home-5-line" className="text-lg" />
              </div>
            </div>
            {errors.homepageTitle && <p className="text-xs text-red-500">{errors.homepageTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Support Email</label>
            <div className="relative">
              <input
                type="email"
                {...register("supportEmail")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:mail-line" className="text-lg" />
              </div>
            </div>
            {errors.supportEmail && <p className="text-xs text-red-500">{errors.supportEmail.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Regional Settings</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Currency</label>
            <div className="relative">
              <select
                {...register("currency")}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="PKR">PKR (₨)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:currency-dollar-line" className="text-lg" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="mingcute:down-line" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <div className="relative">
              <select
                {...register("timezone")}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Asia/Karachi">Islamabad, Karachi (GMT+5)</option>
                <option value="UTC-8 (PST)">Pacific Time (UTC-8)</option>
                <option value="UTC-5 (EST)">Eastern Time (UTC-5)</option>
                <option value="UTC+0 (GMT)">Greenwich Mean Time (UTC+0)</option>
                <option value="UTC+1 (CET)">Central European Time (UTC+1)</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:time-line" className="text-lg" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="mingcute:down-line" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Icon icon="mingcute:loading-fill" className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default GeneralSettings;
