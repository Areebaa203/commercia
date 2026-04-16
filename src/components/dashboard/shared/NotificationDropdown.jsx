"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const NotificationDropdown = ({ isOpen, onClose, anchorRef }) => {
  const [isVisible, setIsVisible] = useState(false);
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
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon icon="mingcute:shopping-bag-2-fill" width="16" />
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">New order received</p>
              <p className="text-xs text-gray-500 mt-0.5">Order #1234 from John Doe has been placed.</p>
              <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
            </div>
            {item === 1 && (
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600 mt-1.5"></div>
            )}
          </div>
        ))}
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
