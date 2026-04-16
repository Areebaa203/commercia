"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const notifications = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    message: "Order #1234 from John Doe has been placed.",
    time: "2 mins ago",
    read: false,
    icon: "mingcute:shopping-bag-2-fill",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    type: "user",
    title: "New customer registered",
    message: "Alice Smith just created an account.",
    time: "1 hour ago",
    read: false,
    icon: "mingcute:user-add-fill",
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    id: 3,
    type: "system",
    title: "System update",
    message: "System maintenance scheduled for tonight at 2 AM.",
    time: "5 hours ago",
    read: true,
    icon: "mingcute:settings-3-fill",
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    id: 4,
    type: "payment",
    title: "Payment received",
    message: "Payment of $120.00 received from Bob Jones.",
    time: "1 day ago",
    read: true,
    icon: "mingcute:card-pay-fill",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    id: 5,
    type: "review",
    title: "New product review",
    message: "Charlie Day left a 5-star review on 'Wireless Headphones'.",
    time: "2 days ago",
    read: true,
    icon: "mingcute:star-fill",
    color: "text-yellow-600",
    bg: "bg-yellow-50"
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(notifications);

  const handleMarkAsRead = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const handleMarkAllAsRead = () => {
    setItems(items.map(item => ({ ...item, read: true })));
  };

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    return item.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
                onClick={handleMarkAllAsRead}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors whitespace-nowrap"
            >
                <Icon icon="mingcute:check-circle-line" width="16" />
                <span>Mark all read</span>
            </button>
            <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-colors">
                <Icon icon="mingcute:settings-3-line" width="16" />
                <span>Settings</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="xl:col-span-1">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sticky top-24">
                <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">Filters</h3>
                <nav className="flex overflow-x-auto pb-2 xl:pb-0 xl:flex-col gap-2 xl:gap-1 no-scrollbar">
                    {[
                        { id: "all", label: "All", icon: "mingcute:notification-line" },
                        { id: "unread", label: "Unread", icon: "mingcute:mail-line" },
                        { id: "order", label: "Orders", icon: "mingcute:shopping-bag-2-line" },
                        { id: "user", label: "Customers", icon: "mingcute:user-3-line" },
                        { id: "system", label: "System", icon: "mingcute:settings-3-line" }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={clsx(
                                "flex items-center gap-2 xl:gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                                filter === item.id 
                                    ? "bg-blue-50 text-blue-600" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon icon={item.icon} width="18" />
                            <span>{item.label}</span>
                            {item.id === "unread" && items.some(i => !i.read) && (
                                <span className="ml-2 xl:ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                                    {items.filter(i => !i.read).length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Notification List */}
        <div className="xl:col-span-3">
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
                {filteredItems.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className={clsx(
                                    "flex items-start gap-4 p-4 transition-colors hover:bg-gray-50",
                                    !item.read ? "bg-blue-50/30" : ""
                                )}
                            >
                                <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", item.bg, item.color)}>
                                    <Icon icon={item.icon} width="20" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={clsx("text-sm font-semibold", !item.read ? "text-gray-900" : "text-gray-700")}>
                                            {item.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{item.message}</p>
                                    {!item.read && (
                                        <button 
                                            onClick={() => handleMarkAsRead(item.id)}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                {!item.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                            <Icon icon="mingcute:notification-off-line" width="32" className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No notifications found</h3>
                        <p className="text-sm text-gray-500 max-w-xs mt-1">
                            There are no notifications matching your current filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
