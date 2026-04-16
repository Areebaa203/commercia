"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const AddWidgetDropdown = ({ isOpen, onClose, anchorRef }) => {
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
        "absolute right-0 top-full mt-2 w-56 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      )}
    >
      <div className="p-1 space-y-1">
        {[
            { name: "Sales Overview", icon: "mingcute:chart-bar-line" },
            { name: "Traffic Source", icon: "mingcute:world-2-line" },
            { name: "Recent Orders", icon: "mingcute:shopping-bag-3-line" },
            { name: "Top Products", icon: "mingcute:star-line" },
            { name: "Customer Feedback", icon: "mingcute:chat-3-line" }
        ].map((widget) => (
            <button key={widget.name} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Icon icon={widget.icon} width="16" className="text-gray-400" />
                <span>{widget.name}</span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default AddWidgetDropdown;
