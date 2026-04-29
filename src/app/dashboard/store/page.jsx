"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import ThemePreviewCard from "@/components/dashboard/store/ThemePreviewCard";

// Mock Data
const themes = [
  { id: 1, name: "Modern Minimal", version: "2.1.0", author: "Furniqo Inc.", description: "A clean and modern theme designed for lifestyle and fashion brands. Features large imagery and elegant typography.", thumbnail: "https://images.unsplash.com/photo-1769257911527-bdfd73b545cf?q=80&w=600&auto=format&fit=crop", updatedAt: "2 days ago" },
  { id: 2, name: "Classic Shop", version: "1.5.3", author: "PixelPerfect", description: "The classic ecommerce layout optimized for high conversion rates. Perfect for large catalogs.", thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop", updatedAt: "1 week ago" },
  { id: 3, name: "Tech Pro", version: "3.0.1", author: "DevStudio", description: "Designed specifically for electronics and gadgets. Dark mode support and technical specs focused.", thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=600&auto=format&fit=crop", updatedAt: "3 weeks ago" },
];

const settings = [
  { id: "general", label: "General", icon: "mingcute:settings-3-line", description: "Store details, currency, and time zone." },
  { id: "payments", label: "Payments", icon: "mingcute:card-pay-line", description: "Manage payment providers and methods." },
  { id: "shipping", label: "Shipping", icon: "mingcute:truck-line", description: "Shipping zones, rates, and labels." },
  { id: "taxes", label: "Taxes", icon: "mingcute:bill-line", description: "Tax rates and calculations." },
  { id: "notifications", label: "Notifications", icon: "mingcute:notification-line", description: "Email and SMS templates." },
  { id: "files", label: "Files", icon: "mingcute:file-line", description: "Upload and manage store assets." },
];

const pages = [
  { id: 1, title: "About Us", status: "Published", date: "Oct 24, 2023" },
  { id: 2, title: "Contact", status: "Published", date: "Oct 22, 2023" },
  { id: 3, title: "FAQ", status: "Draft", date: "Oct 20, 2023" },
  { id: 4, title: "Privacy Policy", status: "Published", date: "Oct 15, 2023" },
];

const navigationMenus = [
  { id: 1, title: "Main Menu", items: 5, location: "Header" },
  { id: 2, title: "Footer Menu", items: 4, location: "Footer" },
  { id: 3, title: "Sidebar Menu", items: 6, location: "Sidebar" },
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("themes");
  const [activeThemeId, setActiveThemeId] = useState(1);

  const handleActivateTheme = (theme) => {
    setActiveThemeId(theme.id);
  };

  const handleCustomizeTheme = (theme) => {
    console.log("Customizing theme:", theme.name);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Online Store</h1>
            <p className="text-sm text-gray-500 mt-1">Customize your storefront, manage themes, and configure store settings.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Icon icon="mingcute:earth-line" width="18" />
                View Store
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 min-w-max">
            {["themes", "pages", "navigation", "preferences"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                        "pb-3 text-sm font-medium capitalize transition-all border-b-2 whitespace-nowrap",
                        activeTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "themes" && (
        <div className="space-y-8">
            {/* Current Theme Section */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    <div className="w-full xl:w-1/2 aspect-video rounded-lg overflow-hidden border border-gray-100 relative group">
                        <img 
                            src={themes.find(t => t.id === activeThemeId)?.thumbnail} 
                            alt="Current Theme" 
                            className="w-full h-full object-cover" 
                        />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-50 transition-transform hover:scale-105">
                                 Customize
                             </button>
                         </div>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Current Theme</h2>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">Live</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{themes.find(t => t.id === activeThemeId)?.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{themes.find(t => t.id === activeThemeId)?.description}</p>
                            <p className="text-xs text-gray-400">Version {themes.find(t => t.id === activeThemeId)?.version} • Last saved just now</p>
                        </div>
                        <div className="pt-4 flex flex-row gap-3">
                            <button className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm text-center">
                                Customize
                            </button>
                            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
                                <Icon icon="mingcute:more-2-line" width="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Theme Library */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Theme Library</h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                        Explore Free Themes
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                        <ThemePreviewCard 
                            key={theme.id} 
                            theme={theme} 
                            isActive={activeThemeId === theme.id}
                            onActivate={handleActivateTheme}
                            onCustomize={handleCustomizeTheme}
                        />
                    ))}
                     <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group h-full min-h-[300px]">
                        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-4">
                            <Icon icon="mingcute:add-line" width="24" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Add Theme</h3>
                        <p className="text-sm text-gray-500 text-center mt-1">Upload zip file or connect from GitHub</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Preferences (Placeholder for other tabs) */}
      {activeTab === "preferences" && (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-6">
              <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Store Metadata</h3>
                  <div className="space-y-4 max-w-xl">
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Homepage Title</label>
                          <input type="text" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. My Awesome Store" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Homepage Meta Description</label>
                          <textarea rows="3" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Enter a description for SEO..."></textarea>
                      </div>
                  </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Google Analytics</h3>
                   <div className="space-y-1.5 max-w-xl">
                       <label className="text-sm font-medium text-gray-700">Google Analytics Account</label>
                       <p className="text-sm text-gray-500 mb-2">Paste your code from Google Analytics here.</p>
                       <textarea rows="3" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-xs resize-none" placeholder="UA-XXXXXXXX-X"></textarea>
                   </div>
              </div>
              <div className="border-t border-gray-100 pt-6 flex justify-end">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                      Save Preferences
                  </button>
              </div>
          </div>
      )}

      {/* Pages Tab */}
      {activeTab === "pages" && (
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">All Pages</h3>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                      <Icon icon="mingcute:add-line" width="18" />
                      Add Page
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500">
                      <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
                          <tr>
                              <th className="px-6 py-4">Title</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                          {pages.map((page) => (
                              <tr key={page.id} className="group hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                  <td className="px-6 py-4">
                                      <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", 
                                          page.status === "Published" ? "bg-green-100 text-green-700 ring-green-600/20" : "bg-gray-100 text-gray-700 ring-gray-600/20"
                                      )}>
                                          {page.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">{page.date}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                          <Icon icon="mingcute:more-2-fill" width="20" />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* Navigation Tab */}
      {activeTab === "navigation" && (
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Menus</h3>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                      <Icon icon="mingcute:add-line" width="18" />
                      Add Menu
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500">
                      <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
                          <tr>
                              <th className="px-6 py-4">Title</th>
                              <th className="px-6 py-4">Menu Items</th>
                              <th className="px-6 py-4">Location</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                          {navigationMenus.map((menu) => (
                              <tr key={menu.id} className="group hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{menu.title}</td>
                                  <td className="px-6 py-4">{menu.items} items</td>
                                  <td className="px-6 py-4">
                                       <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                          {menu.location}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                          <Icon icon="mingcute:edit-2-line" width="20" />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

       {/* Other Tabs Placeholder */}
    </div>
  );
}
