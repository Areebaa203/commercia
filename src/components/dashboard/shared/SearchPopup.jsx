"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const SearchPopup = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Wait for animation
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-start justify-center pt-24 transition-opacity duration-300 px-4",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup Content */}
      <div
        className={clsx(
          "relative w-full max-w-2xl transform rounded-xl bg-white p-4 shadow-2xl ring-1 ring-gray-200 transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
        )}
      >
        <div className="relative flex items-center gap-3 border-b border-gray-100 pb-4">
          <Icon icon="mingcute:search-line" width="24" className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything..."
            className="flex-1 bg-transparent text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            ESC
          </button>
        </div>

        <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">Recent Searches</h4>
            <ul className="space-y-1">
                {["Analytics Report", "New Orders", "Customer Feedback"].map((item, idx) => (
                    <li key={idx} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-gray-900">
                        <Icon icon="mingcute:time-line" width="18" className="text-gray-400" />
                        <span className="text-sm">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="mt-4 border-t border-gray-50 pt-3 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
            <span>Search for pages, orders, customers, and more</span>
            <div className="hidden sm:flex gap-4">
                <span className="flex items-center gap-1"><kbd className="font-sans px-1 rounded bg-gray-100 border border-gray-200">↑</kbd> <kbd className="font-sans px-1 rounded bg-gray-100 border border-gray-200">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-sans px-1 rounded bg-gray-100 border border-gray-200">↵</kbd> to select</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
