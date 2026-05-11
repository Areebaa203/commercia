"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const CustomerFilterDropdown = ({ isOpen, onClose, anchorRef, onApply }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Filter States
  const [status, setStatus] = useState("All");
  const [minSpent, setMinSpent] = useState("0");
  const [minOrders, setMinOrders] = useState("0");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const handleApply = () => {
    onApply({ status, sortBy, sortOrder, minSpent, minOrders });
    onClose();
  };

  const handleReset = () => {
    setStatus("All");
    setMinSpent("0");
    setMinOrders("0");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute right-0 top-full mt-2 w-80 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      )}
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button 
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
            Reset
        </button>
      </div>
      
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Status Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Customer Status</label>
            <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
            </select>
        </div>

        {/* Spent Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Total Spent (Min)</label>
            <select 
                value={minSpent} 
                onChange={(e) => setMinSpent(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="0">Any Amount</option>
                <option value="100">Over $100</option>
                <option value="500">Over $500</option>
                <option value="1000">Over $1,000</option>
                <option value="5000">Over $5,000</option>
            </select>
        </div>

        {/* Orders Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Total Orders (Min)</label>
            <select 
                value={minOrders} 
                onChange={(e) => setMinOrders(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="0">Any Number</option>
                <option value="1">1+ Orders</option>
                <option value="5">5+ Orders</option>
                <option value="10">10+ Orders</option>
                <option value="25">25+ Orders</option>
            </select>
        </div>

        {/* Sort By */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Sort By</label>
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="created_at">Joined Date</option>
                <option value="name">Name</option>
                <option value="total_spent">Total Spent</option>
                <option value="total_orders">Order Count</option>
                <option value="last_order_at">Last Order</option>
            </select>
        </div>

        {/* Sort Order */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Sort Order</label>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                <button 
                    onClick={() => setSortOrder("asc")}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all",
                        sortOrder === "asc" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Icon icon="mingcute:sort-ascending-line" width="16" />
                    Ascending
                </button>
                <button 
                    onClick={() => setSortOrder("desc")}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all",
                        sortOrder === "desc" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Icon icon="mingcute:sort-descending-line" width="16" />
                    Descending
                </button>
            </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-100 flex gap-3">
        <button 
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
            Cancel
        </button>
        <button 
            onClick={handleApply}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
            Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CustomerFilterDropdown;
