"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const MessageDropdown = ({ isOpen, onClose, anchorRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [isOpen]);

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
        <h3 className="font-semibold text-gray-900">Messages</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto">
        {[
            { id: 1, name: "Alice Smith", msg: "Hey, can you check order #123?", time: "5m ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice" },
            { id: 2, name: "Bob Jones", msg: "Thanks for the quick response!", time: "1h ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob" },
            { id: 3, name: "Charlie Day", msg: "Is this item back in stock?", time: "3h ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie" }
        ].map((item) => (
          <div key={item.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none">
            <div className="relative flex-shrink-0 h-10 w-10 rounded-full border border-gray-100 overflow-hidden">
              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
              {item.id === 1 && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{item.msg}</p>
            </div>
            {item.id === 1 && (
                <div className="flex-shrink-0 self-center h-2 w-2 rounded-full bg-blue-600"></div>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-100">
        <Link
          href="/dashboard/messages"
          onClick={onClose}
          className="block w-full py-2 text-center text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors"
        >
          View all messages
        </Link>
      </div>
    </div>
  );
};

export default MessageDropdown;
