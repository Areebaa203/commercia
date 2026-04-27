"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import AddContentModal from "@/components/dashboard/content/AddContentModal";
import ViewContentModal from "@/components/dashboard/content/ViewContentModal";
import EditContentModal from "@/components/dashboard/content/EditContentModal";
import DeleteContentModal from "@/components/dashboard/content/DeleteContentModal";
import ContentActionDropdown from "@/components/dashboard/content/ContentActionDropdown";

const TYPE_LABELS = {
  article: "Article",
  video: "Video",
  banner: "Banner",
  product: "Product",
};

const STATUS_LABELS = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

function mapRowToCard(row) {
  const typeKey = row.type?.toLowerCase();
  const statusKey = row.status?.toLowerCase();
  const dateValue = row.published_at || row.created_at;
  return {
    ...row,
    typeLabel: TYPE_LABELS[typeKey] || row.type || "Article",
    statusLabel: STATUS_LABELS[statusKey] || row.status || "Draft",
    date: dateValue ? new Date(dateValue).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
    viewsLabel: formatCompactNumber(row.views || 0),
    thumbnail: row.thumbnail_url,
  };
}

export default function ContentPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [statsData, setStatsData] = useState({
    total: 0,
    totalViews: 0,
    engagementRate: "0.0",
    pendingReview: 0,
  });

  const [viewContent, setViewContent] = useState(null);
  const [editContent, setEditContent] = useState(null);
  const [deleteContent, setDeleteContent] = useState(null);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const stats = useMemo(
    () => [
      { label: "Total Content", value: statsData.total.toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:file-fill", color: "bg-blue-500" },
      { label: "Total Views", value: formatCompactNumber(statsData.totalViews), change: "+0%", trend: "up", icon: "mingcute:eye-2-fill", color: "bg-green-500" },
      { label: "Engagement", value: `${statsData.engagementRate}%`, change: "+0%", trend: "up", icon: "mingcute:chart-line-fill", color: "bg-purple-500" },
      { label: "Pending Review", value: statsData.pendingReview.toLocaleString(), change: "-0%", trend: "down", icon: "mingcute:time-fill", color: "bg-orange-500" },
    ],
    [statsData]
  );

  const fetchContent = async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        type: selectedType,
        status: "All",
        page: String(currentPage),
        pageSize: String(pageSize),
      });
      const res = await fetch(`/api/content?${params.toString()}`, { method: "GET", cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to fetch content");
      }
      if (requestIdRef.current !== requestId) return;
      const data = payload.data || {};
      const mapped = (data.content || []).map(mapRowToCard);
      setContentItems(mapped);
      setTotalCount(data.totalCount || 0);
      setStatsData(data.stats || { total: 0, totalViews: 0, engagementRate: "0.0", pendingReview: 0 });
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      console.error("Error fetching content:", err?.message || err);
      setContentItems([]);
      setTotalCount(0);
      setStatsData({ total: 0, totalViews: 0, engagementRate: "0.0", pendingReview: 0 });
    } finally {
      if (requestIdRef.current !== requestId) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedType, currentPage]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const getTypeColor = (type) => {
    switch (type) {
      case "Article":
        return "bg-blue-100 text-blue-700";
      case "Video":
        return "bg-red-100 text-red-700";
      case "Banner":
        return "bg-purple-100 text-purple-700";
      case "Product":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-700 ring-green-600/20";
      case "Draft":
        return "bg-gray-100 text-gray-700 ring-gray-600/20";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 ring-blue-600/20";
      default:
        return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, manage and track your content performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              <Icon icon="mingcute:grid-line" width="18" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={clsx("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              <Icon icon="mingcute:list-check-line" width="18" />
            </button>
          </div>
          <button
            onClick={() => setIsAddContentOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Icon icon="mingcute:add-line" width="18" />
            Create Content
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm", stat.color)}>
                <Icon icon={stat.icon} width="24" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={clsx("flex items-center text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
                <Icon icon={stat.trend === "up" ? "mingcute:arrow-up-fill" : "mingcute:arrow-down-fill"} width="16" />
                {stat.change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-white p-1 rounded-lg border border-gray-200 w-fit">
          {["All", "Article", "Video", "Banner", "Product"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedType(tab);
                setCurrentPage(1);
              }}
              className={clsx(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                selectedType === tab ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Icon icon="mingcute:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" />
          <input
            type="search"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Content Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 animate-pulse">
                <div className="aspect-video w-full rounded-lg bg-gray-100" />
                <div className="mt-4 h-4 w-1/3 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-4 h-8 w-full rounded bg-gray-100" />
              </div>
            ))
          ) : contentItems.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white p-10 text-center text-gray-400 ring-1 ring-gray-100">No content found.</div>
          ) : (
            contentItems.map((item) => (
              <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all">
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  {item.type?.toLowerCase() === "video" ? (
                    <video
                      src={item.thumbnail_url}
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    />
                  ) : (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm", getTypeColor(item.type).replace("bg-", "text-").replace("text-", "text-"))}>
                      {item.typeLabel}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-right">
                    <ContentActionDropdown
                      content={item}
                      viewMode="grid"
                      onView={(c) => setViewContent(c)}
                      onEdit={(c) => setEditContent(c)}
                      onDelete={(c) => setDeleteContent(c)}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.author}</span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(item.statusLabel))}>
                      {item.statusLabel}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Icon icon="mingcute:eye-2-line" /> {item.viewsLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="mingcute:thumb-up-2-line" /> {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4">Content</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4 text-right">Views</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 w-48 rounded bg-gray-100" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 rounded bg-gray-100" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 rounded bg-gray-100" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-gray-100" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-10 rounded bg-gray-100 ml-auto" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-8 rounded bg-gray-100 ml-auto" /></td>
                    </tr>
                  ))
                ) : contentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No content found.</td>
                  </tr>
                ) : (
                  contentItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                            {item.type?.toLowerCase() === "video" ? (
                              <video
                                src={item.thumbnail_url}
                                muted
                                playsInline
                                className="h-full w-full object-cover pointer-events-none"
                              />
                            ) : (
                              <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", getTypeColor(item.type))}>
                          {item.typeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(item.statusLabel))}>
                          {item.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{item.author_name}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{item.viewsLabel}</td>
                      <td className="px-6 py-4 text-right">
                        <ContentActionDropdown
                          content={item}
                          viewMode="list"
                          onView={(c) => setViewContent(c)}
                          onEdit={(c) => setEditContent(c)}
                          onDelete={(c) => setDeleteContent(c)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
        <div className="text-sm text-gray-500 text-center sm:text-left">
          Showing <span className="font-medium text-gray-900">{totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(totalCount, currentPage * pageSize)}</span> of <span className="font-medium text-gray-900">{totalCount}</span> results
        </div>
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[...Array(Math.max(1, Math.ceil(totalCount / pageSize)))].map((_, i) => {
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
            disabled={currentPage >= Math.max(1, Math.ceil(totalCount / pageSize))}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <ViewContentModal
        isOpen={!!viewContent}
        onClose={() => setViewContent(null)}
        content={viewContent}
      />
      <EditContentModal
        isOpen={!!editContent}
        onClose={() => setEditContent(null)}
        content={editContent}
        onSuccess={fetchContent}
      />
      <DeleteContentModal
        isOpen={!!deleteContent}
        onClose={() => setDeleteContent(null)}
        content={deleteContent}
        onSuccess={fetchContent}
      />
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onSuccess={fetchContent}
      />
    </div>
  );
}
