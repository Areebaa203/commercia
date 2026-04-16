"use client";
import React, { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";

const PeriodDropdown = ({ isOpen, onClose, anchorRef, onSelect }) => {
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

  const handleSelect = (period) => {
    onSelect(period);
    onClose();
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute left-0 top-full mt-2 w-48 z-50 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      )}
    >
      <div className="p-1 space-y-1">
        {["Last 7 days", "Last 30 days", "Last 90 days", "This Year", "Last Year"].map((period) => (
            <button 
                key={period} 
                onClick={() => handleSelect(period)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
                {period}
            </button>
        ))}
      </div>
    </div>
  );
};

export default PeriodDropdown;
