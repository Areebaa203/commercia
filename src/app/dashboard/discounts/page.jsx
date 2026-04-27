"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import StatsCard from "@/components/dashboard/shared/StatsCard";
import DiscountActionDropdown from "@/components/dashboard/discounts/DiscountActionDropdown";
import AddDiscountModal from "@/components/dashboard/discounts/AddDiscountModal";
import DuplicateDiscountModal from "@/components/dashboard/discounts/DuplicateDiscountModal";
import DeleteDiscountModal from "@/components/dashboard/discounts/DeleteDiscountModal";
import { Skeleton } from "@/components/ui/skeleton";
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

// Format Date helper
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function DiscountsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [discounts, setDiscounts] = useState([]);
  const [stats, setStats] = useState({ active: 0, redemptions: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  
  // Modal States
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const activeRequestRef = useRef(0);

  // Fetch Discounts
  const fetchDiscounts = useCallback(async () => {
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        status: selectedStatus,
        page: String(currentPage),
        pageSize: String(pageSize),
      });

      const response = await fetch(`/api/discounts?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch discounts");
      }

      if (activeRequestRef.current !== requestId) return;

      const data = payload.data || {};
      
      const formattedData = (data.discounts || []).map((d) => ({
        id: d.id,
        code: d.code,
        type: d.type,
        value: d.value,
        status: d.status.charAt(0).toUpperCase() + d.status.slice(1), // Capitalize
        used: d.used_count || 0,
        limit: d.usage_limit || "Unlimited",
        startDate: formatDate(d.start_date),
        endDate: formatDate(d.end_date),
        raw: d,
      }));
      setDiscounts(formattedData);
      setTotalCount(data.totalCount || 0);

      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      if (activeRequestRef.current !== requestId) return;
      console.error("Error fetching discounts:", err.message);
    } finally {
      if (activeRequestRef.current !== requestId) return;
      setLoading(false);
    }
  }, [debouncedSearch, selectedStatus, currentPage]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Debounce: update debouncedSearch 400ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);



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

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(`/api/discounts/update/${id}`, { status: "expired" });
      fetchDiscounts();
    } catch (err) {
      console.error("Deactivate Error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to deactivate discount.";
      setErrorDialog({ open: true, message: "Failed to deactivate discount: " + msg });
    }
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
          value={loading ? "-" : stats.active}
          change="+"
          changeType="positive"
          period="currently running"
          icon="mingcute:tag-2-fill"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Redemptions"
          value={loading ? "-" : stats.redemptions.toLocaleString()}
          change="+"
          changeType="positive"
          period="all time"
          icon="mingcute:coupon-fill"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Saved"
          value={loading ? "-" : `$${stats.saved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+"
          changeType="positive"
          period="estimated value"
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
        <div className="border-b border-gray-100 p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {["All", "Active", "Scheduled", "Expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSelectedStatus(tab);
                  setCurrentPage(1);
                }}
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
          
          {/* Search */}
          <div className="mt-4 sm:ml-auto sm:mt-0 sm:w-64 relative">
             <Icon icon="mingcute:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" />
             <input
               type="search"
               placeholder="Search discounts..."
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 setCurrentPage(1);
                 if (!e.target.value) {
                   if (debounceRef.current) clearTimeout(debounceRef.current);
                   setDebouncedSearch("");
                 }
               }}
               className="search-input w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
             />
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
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-t border-gray-100 animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                        <div className="space-y-2 w-full max-w-[150px]">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 w-24">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-4/5" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : discounts.length > 0 ? (
                discounts.map((discount) => (
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
      {loading ? (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
          <div className="w-48"><Skeleton className="h-5 w-full" /></div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <div className="flex items-center gap-1 hidden sm:flex">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium text-gray-900">{Math.min(totalCount, (currentPage - 1) * pageSize + 1)}</span> to <span className="font-medium text-gray-900">{Math.min(totalCount, currentPage * pageSize)}</span> of <span className="font-medium text-gray-900">{totalCount}</span> results
          </div>
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.ceil(totalCount / pageSize) || 1)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === Math.ceil(totalCount / pageSize) ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={clsx(
                        "rounded-lg px-3 py-1 text-sm font-medium shrink-0",
                        currentPage === pageNum ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-gray-400 shrink-0">...</span>;
                }
                return null;
              })}
            </div>
            <button
              disabled={currentPage >= Math.ceil(totalCount / pageSize) || totalCount === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddDiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDiscounts}
        initialData={editData}
      />

      <DuplicateDiscountModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onSuccess={fetchDiscounts}
        discount={selectedDiscount}
      />

      <DeleteDiscountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={fetchDiscounts}
        discount={selectedDiscount}
      />

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
}
