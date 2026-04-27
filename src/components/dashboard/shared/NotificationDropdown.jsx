"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const notificationStyles = {
  order: { icon: "mingcute:shopping-bag-2-fill", color: "text-blue-600", bg: "bg-blue-50" },
  user: { icon: "mingcute:user-add-fill", color: "text-green-600", bg: "bg-green-50" },
  system: { icon: "mingcute:settings-3-fill", color: "text-orange-600", bg: "bg-orange-50" },
  payment: { icon: "mingcute:card-pay-fill", color: "text-purple-600", bg: "bg-purple-50" },
  review: { icon: "mingcute:star-fill", color: "text-yellow-600", bg: "bg-yellow-50" },
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "just now";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const NotificationDropdown = ({ isOpen, onClose, anchorRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200); // Match transition duration
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    if (items.length === 0) return;
    const previous = items;
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
        cache: "no-store",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
    } catch (error) {
      console.error("Failed to mark all as read", error);
      setItems(previous);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute top-full mt-2 w-80 z-50 rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        // Desktop: Align right
        "right-0 origin-top-right",
        // Mobile (max-width: 480px): Fixed position or centered
        "max-[480px]:fixed max-[480px]:left-4 max-[480px]:right-4 max-[480px]:w-auto max-[480px]:top-20",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Icon icon="mingcute:loading-fill" className="animate-spin text-xl text-blue-600" />
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none">
              <div
                className={clsx(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                  notificationStyles[item.type]?.bg || "bg-gray-100",
                  notificationStyles[item.type]?.color || "text-gray-600"
                )}
              >
                <Icon icon={notificationStyles[item.type]?.icon || "mingcute:notification-line"} width="16" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 font-medium truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{formatRelativeTime(item.created_at)}</p>
              </div>
              {!item.read && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600 mt-1.5"></div>}
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet.</div>
        )}
      </div>

      <div className="p-2 border-t border-gray-100">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="block w-full py-2 text-center text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
