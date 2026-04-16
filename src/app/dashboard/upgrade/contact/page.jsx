"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { clsx } from "clsx";

export default function ContactSalesPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Icon icon="mingcute:send-plane-fill" className="text-4xl" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Message Sent!</h1>
        <p className="mb-8 text-gray-500">
          Thanks for reaching out. One of our sales representatives will get back to you within 24 hours.
        </p>
        <Link
          href="/dashboard"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/upgrade" className="hover:text-blue-600">
          Upgrade
        </Link>
        <Icon icon="mingcute:right-line" />
        <span className="font-medium text-gray-900">Contact Sales</span>
      </div>

      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
        {/* Left Column: Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Talk to Sales</h1>
            <p className="mt-4 text-lg text-gray-500">
              Need a custom plan for your large team? Have specific requirements? We're here to help you find the perfect solution.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon icon="mingcute:group-3-fill" className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">For Large Teams</h3>
                <p className="text-sm text-gray-500">
                  Custom pricing and features for teams with 50+ members.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Icon icon="mingcute:safe-flash-fill" className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Enterprise Security</h3>
                <p className="text-sm text-gray-500">
                  Advanced security features, SSO, and dedicated compliance support.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon icon="mingcute:service-fill" className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Dedicated Support</h3>
                <p className="text-sm text-gray-500">
                  24/7 priority support with a dedicated account manager.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Work Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Team Size</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none">
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-500 employees</option>
                <option>500+ employees</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Tell us about your needs..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Icon icon="mingcute:loading-fill" className="animate-spin text-lg" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
