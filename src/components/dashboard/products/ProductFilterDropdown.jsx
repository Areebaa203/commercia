"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const ProductFilterDropdown = ({ isOpen, onClose, anchorRef, onApply }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Filter States
  const [category, setCategory] = useState("All");
  const [stockStatus, setStockStatus] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

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
    onApply && onApply({ category, stockStatus, priceRange });
    onClose();
  };

  const handleReset = () => {
    setCategory("All");
    setStockStatus("All");
    setPriceRange("All");
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute right-0 top-full mt-2 w-72 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
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
      
      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Garden">Home & Garden</option>
            </select>
        </div>

        {/* Stock Status Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Stock Status</label>
            <select 
                value={stockStatus} 
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
            </select>
        </div>

        {/* Price Range Filter */}
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Price Range</label>
            <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="All">All Prices</option>
                <option value="Under $50">Under $50</option>
                <option value="$50 - $100">$50 - $100</option>
                <option value="$100 - $500">$100 - $500</option>
                <option value="Over $500">Over $500</option>
            </select>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <button 
            onClick={handleApply}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilterDropdown;
