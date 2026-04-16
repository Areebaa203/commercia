"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <Icon icon="mingcute:check-circle-fill" className="text-5xl" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="mb-8 max-w-md text-gray-500">
        Thank you for upgrading to the Pro Plan. Your account has been updated and you now have access to all premium features.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          Go to Dashboard
          <Icon icon="mingcute:arrow-right-line" />
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          View Receipt
        </Link>
      </div>
    </div>
  );
}
