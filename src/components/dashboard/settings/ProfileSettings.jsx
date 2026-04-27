"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations/settings";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  const { uploadFile, deleteFile, uploading: profileUploading } = useCloudinaryUpload();
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [initialAvatarUrl, setInitialAvatarUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      avatarUrl: "",
    },
  });

  const avatarUrl = watch("avatarUrl");
  const role = watch("role") || "Administrator"; // Mocking role if not in schema yet or fetch it

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/settings/profile");
        const json = await res.json();
        if (json.success && json.data) {
          const profileData = {
            fullName: json.data.full_name || "",
            email: json.data.email || "",
            phone: json.data.phone || "",
            avatarUrl: json.data.avatar_url || "",
            role: json.data.role || "user",
          };
          reset(profileData);
          setInitialAvatarUrl(json.data.avatar_url || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadFile(file);
      setValue("avatarUrl", url, { shouldDirty: true });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    }
  };

  const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes("cloudinary")) return null;
    try {
      const uploadIndex = url.indexOf("upload/");
      if (uploadIndex === -1) return null;
      const pathAfterUpload = url.substring(uploadIndex + 7);
      const parts = pathAfterUpload.split("/");
      if (parts[0].startsWith("v") && /^\d+$/.test(parts[0].substring(1))) {
        parts.shift();
      }
      const fullIdWithExt = parts.join("/");
      const dotIndex = fullIdWithExt.lastIndexOf(".");
      return dotIndex === -1 ? fullIdWithExt : fullIdWithExt.substring(0, dotIndex);
    } catch (e) {
      return null;
    }
  };

  const onSubmit = async (data) => {
    if (!isDirty) {
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 3000);
      return;
    }
    setShowInfo(false);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        // If image changed, delete old one from Cloudinary
        if (initialAvatarUrl && initialAvatarUrl !== data.avatarUrl) {
          const oldPublicId = getPublicIdFromUrl(initialAvatarUrl);
          if (oldPublicId) {
            try {
              await deleteFile(oldPublicId);
            } catch (err) {
              console.error("Failed to delete old image from Cloudinary", err);
            }
          }
        }
        setInitialAvatarUrl(data.avatarUrl || "");
        reset(data);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        const errorMessage = json.errors 
          ? Object.values(json.errors).flat().join(", ")
          : json.message || "Failed to update profile";
        throw new Error(errorMessage);
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
      {/* Profile Picture */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-gray-50">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                <Icon icon="mingcute:user-3-line" className="text-4xl" />
              </div>
            )}
            {profileUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Icon icon="mingcute:loading-fill" className="animate-spin text-2xl text-white" />
              </div>
            )}
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={profileUploading} />
              <Icon icon="mingcute:camera-line" className="text-2xl text-white" />
            </label>
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <label className="cursor-pointer rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors whitespace-nowrap">
                <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={profileUploading} />
                {profileUploading ? "Uploading..." : "Change Photo"}
              </label>
              <button 
                type="button"
                onClick={() => setValue("avatarUrl", "", { shouldDirty: true })}
                disabled={!avatarUrl || profileUploading}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
            <p className="text-xs text-gray-500">
              JPG, GIF or PNG. Max size of 800K
            </p>
            {errors.avatarUrl && <p className="text-xs text-red-500 mt-1">{errors.avatarUrl.message}</p>}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                {...register("fullName")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:user-3-line" className="text-lg" />
              </div>
            </div>
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="group relative flex items-center gap-1 text-amber-500">
                <Icon icon="mingcute:alert-line" className="text-sm" />
                <span className="text-[10px] font-medium hidden group-hover:inline absolute bottom-full right-0 mb-1 w-32 rounded bg-gray-900 p-1 text-center text-white shadow-lg">
                  Email cannot be changed
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-gray-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:mail-line" className="text-lg" />
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium mt-1">
              <Icon icon="mingcute:information-line" />
              This field is managed by your authentication provider.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                {...register("phone")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:phone-line" className="text-lg" />
              </div>
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="group relative flex items-center gap-1 text-blue-500">
                <Icon icon="mingcute:shield-line" className="text-sm" />
                <span className="text-[10px] font-medium hidden group-hover:inline absolute bottom-full right-0 mb-1 w-32 rounded bg-gray-900 p-1 text-center text-white shadow-lg">
                  Role is managed by Owner
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={watch("role") || "Administrator"}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-gray-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:shield-line" className="text-lg" />
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium mt-1">
              <Icon icon="mingcute:information-line" />
              Contact your workspace owner to change your role.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        {showInfo && (
          <p className="text-xs font-medium text-amber-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
            <Icon icon="mingcute:information-line" />
            Information is already up to date
          </p>
        )}
        <button 
          type="submit"
          disabled={isSubmitting || profileUploading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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

export default ProfileSettings;
