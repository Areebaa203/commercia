"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, paypal

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/upgrade/success");
    }, 2000);
  };

  const planPrice = billingCycle === "monthly" ? 29 : 24;
  const subtotal = planPrice;
  const tax = planPrice * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="mx-auto max-w-5xl py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/upgrade" className="hover:text-blue-600">
          Upgrade
        </Link>
        <Icon icon="mingcute:right-line" />
        <span className="font-medium text-gray-900">Checkout</span>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left Column: Billing & Payment Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Billing Information</h2>
            <form id="payment-form" onSubmit={handlePayment} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@company.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  placeholder="123 Business St"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Payment Method</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all",
                  paymentMethod === "card"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <Icon icon="mingcute:card-pay-fill" className="text-lg" />
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all",
                  paymentMethod === "paypal"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <Icon icon="mingcute:paypal-fill" className="text-lg" />
                PayPal
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="mingcute:card-line" className="text-lg" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon icon="mingcute:safe-lock-line" className="text-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600">
                You will be redirected to PayPal to complete your purchase securely.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="xl:sticky xl:top-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
            
            {/* Plan Details */}
            <div className="mb-6 flex items-start gap-4 rounded-lg bg-blue-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Icon icon="mingcute:diamond-fill" className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pro Plan</h3>
                <p className="text-xs text-gray-500">Everything you need to grow your business.</p>
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={clsx(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
                  billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={clsx(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
                  billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Yearly (-20%)
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 space-y-3 border-b border-gray-100 pb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {billingCycle === "yearly" && (
                <div className="flex justify-between text-green-600">
                  <span>Yearly Discount</span>
                  <span>Applied</span>
                </div>
              )}
            </div>

            <div className="mb-6 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              form="payment-form"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Icon icon="mingcute:loading-fill" className="animate-spin text-lg" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ${total.toFixed(2)}
                  <Icon icon="mingcute:arrow-right-line" className="text-lg" />
                </>
              )}
            </button>
            
            <p className="mt-4 text-center text-xs text-gray-400">
              Secure 256-bit SSL encrypted payment. By continuing, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
