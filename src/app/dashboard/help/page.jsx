"use client";
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const HelpPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <p className="mt-2 text-gray-500">
          Search for articles or browse the topics below.
        </p>
        <div className="mx-auto mt-6 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon icon="mingcute:search-line" className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Getting Started",
            icon: "mingcute:rocket-line",
            description: "Learn the basics of setting up your store.",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Account & Billing",
            icon: "mingcute:user-3-line",
            description: "Manage your account settings and payments.",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            title: "Orders & Shipping",
            icon: "mingcute:truck-line",
            description: "Track orders and configure shipping rates.",
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            title: "Products & Inventory",
            icon: "mingcute:box-3-line",
            description: "Add products and manage your inventory.",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Themes & Customization",
            icon: "mingcute:paint-brush-line",
            description: "Customize the look and feel of your store.",
            color: "text-pink-600",
            bg: "bg-pink-50",
          },
          {
            title: "Marketing & SEO",
            icon: "mingcute:megaphone-line",
            description: "Promote your store and improve ranking.",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
        ].map((topic, index) => (
          <div
            key={index}
            className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${topic.bg} ${topic.color}`}
            >
              <Icon icon={topic.icon} className="text-2xl" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
              {topic.title}
            </h3>
            <p className="text-sm text-gray-500">{topic.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="rounded-2xl bg-blue-600 p-8 text-center text-white shadow-xl shadow-blue-500/20">
        <h2 className="mb-2 text-2xl font-bold">Still need help?</h2>
        <p className="mb-6 text-blue-100">
          Our support team is available 24/7 to assist you with any issues.
        </p>
        <Link
          href="/dashboard/upgrade/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
        >
          <Icon icon="mingcute:chat-2-line" className="text-lg" />
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default HelpPage;
