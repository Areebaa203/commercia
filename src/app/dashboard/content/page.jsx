"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import AddContentModal from "@/components/dashboard/content/AddContentModal";
import ViewContentModal from "@/components/dashboard/content/ViewContentModal";
import EditContentModal from "@/components/dashboard/content/EditContentModal";
import DeleteContentModal from "@/components/dashboard/content/DeleteContentModal";
import ContentActionDropdown from "@/components/dashboard/content/ContentActionDropdown";

// Mock Data for Content
const contentItems = [
  { id: 1, title: "Summer Collection Launch", type: "Article", status: "Published", author: "Jane Doe", date: "Oct 24, 2023", views: "1.2k", likes: 145, comments: 23, thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop", description: "Discover the latest trends for the summer season with our exclusive collection launch event." },
  { id: 2, title: "How to Style Your Outfit", type: "Video", status: "Draft", author: "John Smith", date: "Oct 23, 2023", views: "-", likes: "-", comments: "-", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop", description: "A comprehensive guide on styling your daily outfits for maximum impact." },
  { id: 3, title: "Black Friday Sale Banner", type: "Banner", status: "Scheduled", author: "Alice Brown", date: "Nov 01, 2023", views: "-", likes: "-", comments: "-", thumbnail: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=400&auto=format&fit=crop", description: "Promotional banner for the upcoming Black Friday sales event." },
  { id: 4, title: "New Arrivals: Winter 2024", type: "Article", status: "Published", author: "Jane Doe", date: "Oct 20, 2023", views: "3.5k", likes: 210, comments: 45, thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop", description: "Get a sneak peek at our cozy and stylish winter arrivals." },
  { id: 5, title: "Customer Review Highlight", type: "Video", status: "Published", author: "Mike Ross", date: "Oct 18, 2023", views: "890", likes: 56, comments: 12, thumbnail: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=400&auto=format&fit=crop", description: "Real customers share their honest feedback about our best-selling products." },
  { id: 6, title: "Product Spotlight: Smart Watch", type: "Product", status: "Published", author: "Sarah Lee", date: "Oct 15, 2023", views: "2.1k", likes: 180, comments: 34, thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", description: "An in-depth look at the features and benefits of our latest Smart Watch." },
];

const stats = [
  { label: "Total Content", value: "145", change: "+12%", trend: "up", icon: "mingcute:file-fill", color: "bg-blue-500" },
  { label: "Total Views", value: "45.2k", change: "+24%", trend: "up", icon: "mingcute:eye-2-fill", color: "bg-green-500" },
  { label: "Engagement", value: "3.8%", change: "+5%", trend: "up", icon: "mingcute:chart-line-fill", color: "bg-purple-500" },
  { label: "Pending Review", value: "8", change: "-2%", trend: "down", icon: "mingcute:time-fill", color: "bg-orange-500" },
];

export default function ContentPage() {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedType, setSelectedType] = useState("All");
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  
  // Modal States
  const [viewContent, setViewContent] = useState(null);
  const [editContent, setEditContent] = useState(null);
  const [deleteContent, setDeleteContent] = useState(null);

  const actionRefs = useRef({});

  const getTypeColor = (type) => {
    switch (type) {
      case "Article": return "bg-blue-100 text-blue-700";
      case "Video": return "bg-red-100 text-red-700";
      case "Banner": return "bg-purple-100 text-purple-700";
      case "Product": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-700 ring-green-600/20";
      case "Draft": return "bg-gray-100 text-gray-700 ring-gray-600/20";
      case "Scheduled": return "bg-blue-100 text-blue-700 ring-blue-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
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
             <AddContentModal 
                isOpen={isAddContentOpen}
                onClose={() => setIsAddContentOpen(false)}
             />
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
                    onClick={() => setSelectedType(tab)}
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
                type="text" 
                placeholder="Search content..." 
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
        </div>
      </div>

      {/* Content Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {contentItems.map((item) => (
                <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute top-3 left-3">
                            <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm", getTypeColor(item.type).replace("bg-", "text-").replace("text-", "text-"))}>
                                {item.type}
                            </span>
                        </div>
                        <div className="absolute top-3 right-3">
                             <button 
                                ref={(el) => (actionRefs.current[item.id] = el)}
                                onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm hover:bg-white transition-colors"
                            >
                                <Icon icon="mingcute:more-2-fill" width="18" />
                            </button>
                            <ContentActionDropdown 
                                isOpen={openActionId === item.id} 
                                onClose={() => setOpenActionId(null)}
                                anchorRef={{ current: actionRefs.current[item.id] }}
                                content={item}
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
                            <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(item.status))}>
                                {item.status}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Icon icon="mingcute:eye-2-line" /> {item.views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Icon icon="mingcute:thumb-up-2-line" /> {item.likes}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
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
                        {contentItems.map((item) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                                            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                                            <div className="text-xs text-gray-400">{item.date}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", getTypeColor(item.type))}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(item.status))}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{item.author}</td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">{item.views}</td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        ref={(el) => (actionRefs.current[item.id] = el)}
                                        onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                        className={clsx(
                                            "rounded-lg p-2 transition-colors",
                                            openActionId === item.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        )}
                                    >
                                        <Icon icon="mingcute:more-2-fill" width="20" />
                                    </button>
                                    <ContentActionDropdown 
                                        isOpen={openActionId === item.id} 
                                        onClose={() => setOpenActionId(null)}
                                        anchorRef={{ current: actionRefs.current[item.id] }}
                                        content={item}
                                        onView={(c) => setViewContent(c)}
                                        onEdit={(c) => setEditContent(c)}
                                        onDelete={(c) => setDeleteContent(c)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">6</span> of <span className="font-medium text-gray-900">145</span> results
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
                        12
                    </button>
                </div>
                <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0">
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
      />
      <DeleteContentModal 
        isOpen={!!deleteContent} 
        onClose={() => setDeleteContent(null)} 
        content={deleteContent} 
      />
      <AddContentModal 
        isOpen={isAddContentOpen} 
        onClose={() => setIsAddContentOpen(false)} 
      />
    </div>
  );
}
