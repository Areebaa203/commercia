"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { resetPasswordSchema } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.success) {
      setServerError(json.message);
      return;
    }

    setSuccessMsg(json.message);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Shared Layout for Left Side */}
      <div className="hidden w-1/2 flex-col justify-between bg-blue-600 p-12 text-white lg:flex relative overflow-hidden">
        <div className="z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon icon="mingcute:shopping-bag-2-fill" width="24" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Commercia</span>
        </div>

        <div className="z-10 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Create a new password.
          </h2>
          <p className="text-lg text-blue-100">
            Make sure your new password is secure and unique.
          </p>
        </div>

        <div className="z-10 flex items-center justify-between text-sm text-blue-200">
          <p>© 2024 Commercia Inc.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-3xl"></div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
            <p className="mt-2 text-gray-500">Your new password must be different from previous used passwords.</p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <Icon icon="mingcute:warning-line" className="shrink-0 text-lg" />
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <Icon icon="mingcute:check-circle-line" className="mt-0.5 shrink-0 text-lg" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 pr-11 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="mingcute:lock-line" className="text-lg" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon={showPassword ? "mingcute:eye-line" : "mingcute:eye-close-line"} className="text-lg" />
                  </button>
                </div>
                {errors.password ? (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <Icon icon="mingcute:alert-circle-line" />
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 pr-11 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="mingcute:lock-line" className="text-lg" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon={showConfirmPassword ? "mingcute:eye-line" : "mingcute:eye-close-line"} className="text-lg" />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <Icon icon="mingcute:alert-circle-line" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || successMsg}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting || successMsg ? (
                  <>
                    <Icon icon="mingcute:loading-fill" className="animate-spin text-lg" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500">
            <Link href="/" className="flex items-center justify-center gap-2 font-bold text-gray-700 hover:text-gray-900">
              <Icon icon="mingcute:arrow-left-line" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
