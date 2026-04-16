"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import StatsCard from "@/components/dashboard/shared/StatsCard";
import DiscountActionDropdown from "@/components/dashboard/discounts/DiscountActionDropdown";
import AddDiscountModal from "@/components/dashboard/discounts/AddDiscountModal";
import DuplicateDiscountModal from "@/components/dashboard/discounts/DuplicateDiscountModal";
import DeleteDiscountModal from "@/components/dashboard/discounts/DeleteDiscountModal";

// Mock Data
const initialDiscounts = [
  {
    id: 1,
    code: "SUMMER2024",
    type: "percentage",
    value: "20",
    status: "Active",
    used: 145,
    limit: 500,
    startDate: "Jun 1, 2024",
    endDate: "Aug 31, 2024",
  },
  {
    id: 2,
    code: "WELCOME10",
    type: "percentage",
    value: "10",
    status: "Active",
    used: 892,
    limit: "Unlimited",
    startDate: "Jan 1, 2024",
    endDate: null,
  },
  {
    id: 3,
    code: "FLASH50",
    type: "fixed",
    value: "50",
    status: "Expired",
    used: 50,
    limit: 50,
    startDate: "May 10, 2024",
    endDate: "May 12, 2024",
  },
  {
    id: 4,
    code: "FREESHIP",
    type: "free_shipping",
    value: "0",
    status: "Scheduled",
    used: 0,
    limit: 100,
    startDate: "Dec 1, 2024",
    endDate: "Dec 31, 2024",
  },
  {
    id: 5,
    code: "BLACKFRIDAY",
    type: "percentage",
    value: "40",
    status: "Scheduled",
    used: 0,
    limit: "Unlimited",
    startDate: "Nov 24, 2024",
    endDate: "Nov 27, 2024",
  },
];

export default function DiscountsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Modal States
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Filter Logic
  const filteredDiscounts = discounts.filter((discount) => {
    if (selectedStatus === "All") return true;
    return discount.status === selectedStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 ring-green-600/20";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 ring-blue-600/20";
      case "Expired":
        return "bg-gray-100 text-gray-700 ring-gray-600/20";
      default:
        return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  const getTypeLabel = (type, value) => {
    switch (type) {
      case "percentage":
        return `${value}% Off`;
      case "fixed":
        return `$${value} Off`;
      case "free_shipping":
        return "Free Shipping";
      default:
        return type;
    }
  };

  const confirmDelete = () => {
    if (selectedDiscount) {
      setDiscounts(discounts.filter((d) => d.id !== selectedDiscount.id));
      setSelectedDiscount(null);
    }
  };

  const handleDeactivate = (id) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id ? { ...d, status: "Expired" } : d
      )
    );
  };

  const confirmDuplicate = () => {
    if (selectedDiscount) {
      const newDiscount = {
        ...selectedDiscount,
        id: Math.max(...discounts.map((d) => d.id)) + 1,
        code: `${selectedDiscount.code}-COPY`,
        status: "Scheduled",
        used: 0,
      };
      setDiscounts([newDiscount, ...discounts]);
      setSelectedDiscount(null);
    }
  };

  const handleSave = (newDiscount) => {
    if (editData) {
      // Edit existing
      setDiscounts(
        discounts.map((d) =>
          d.id === editData.id ? { ...d, ...newDiscount } : d
        )
      );
    } else {
      // Create new
      const id = Math.max(...discounts.map((d) => d.id)) + 1;
      setDiscounts([
        {
          id,
          ...newDiscount,
          used: 0,
          limit: "Unlimited", // Default for now
          status: "Active", // Default
        },
        ...discounts,
      ]);
    }
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your coupons and promotional campaigns.
          </p>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Icon icon="mingcute:add-line" className="text-lg" />
          Create Discount
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Active Discounts"
          value={discounts.filter((d) => d.status === "Active").length}
          change="2"
          changeType="positive"
          period="new this month"
          icon="mingcute:tag-2-fill"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Redemptions"
          value="1,245"
          change="12%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:coupon-fill"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Saved"
          value="$12,450"
          change="8%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:wallet-3-fill"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Conversion Impact"
          value="+3.2%"
          change="0.5%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:chart-line-fill"
          iconColor="text-orange-600"
        />
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs/Filter */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {["All", "Active", "Scheduled", "Expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={clsx(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  selectedStatus === tab
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500">
                <th className="px-6 py-4 font-medium">Code / Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Used</th>
                <th className="px-6 py-4 font-medium">Date Range</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon icon="mingcute:coupon-line" className="text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{discount.code}</p>
                          <p className="text-xs text-gray-500">
                            {getTypeLabel(discount.type, discount.value)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                          getStatusColor(discount.status)
                        )}
                      >
                        {discount.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {getTypeLabel(discount.type, discount.value)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.used} <span className="text-gray-400">/ {discount.limit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-gray-500">
                        <span>{discount.startDate}</span>
                        {discount.endDate ? (
                          <span>to {discount.endDate}</span>
                        ) : (
                          <span>No expiry</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DiscountActionDropdown
                        onEdit={() => {
                          setEditData(discount);
                          setIsModalOpen(true);
                        }}
                        onDuplicate={() => {
                          setSelectedDiscount(discount);
                          setDuplicateModalOpen(true);
                        }}
                        onDeactivate={() => handleDeactivate(discount.id)}
                        onDelete={() => {
                          setSelectedDiscount(discount);
                          setDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                        <Icon icon="mingcute:coupon-line" className="text-2xl text-gray-400" />
                      </div>
                      <p className="font-medium">No discounts found</p>
                      <p className="text-sm">Try adjusting your filters or create a new one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">45</span> results
            </div>
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
                <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0">
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    <button className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 border border-blue-100 shrink-0">
                        1
                    </button>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0">
                        2
                    </button>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0 hidden sm:block">
                        3
                    </button>
                    <span className="text-gray-400 shrink-0">...</span>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0 hidden sm:block">
                        5
                    </button>
                </div>
                <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0">
                    Next
                </button>
            </div>
      </div>

      <AddDiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editData}
      />

      <DuplicateDiscountModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onConfirm={confirmDuplicate}
        discountName={selectedDiscount?.code}
      />

      <DeleteDiscountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        discountName={selectedDiscount?.code}
      />
    </div>
  );
}
