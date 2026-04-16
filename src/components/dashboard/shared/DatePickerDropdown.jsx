"use client";
import React, { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerDropdown = ({ isOpen, onClose, anchorRef, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowCustom(false);
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

  const handlePresetSelect = (range) => {
    const today = new Date();
    let from, to;

    switch (range) {
      case "Today":
        from = today;
        to = today;
        break;
      case "Yesterday":
        from = subDays(today, 1);
        to = subDays(today, 1);
        break;
      case "Last 7 Days":
        from = subDays(today, 6);
        to = today;
        break;
      case "Last 30 Days":
        from = subDays(today, 29);
        to = today;
        break;
      case "This Month":
        from = startOfMonth(today);
        to = today;
        break;
      case "Last Month":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(subMonths(today, 1));
        break;
      default:
        return;
    }

    onSelect({ from, to });
    onClose();
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const applyCustomRange = () => {
    if (startDate && endDate) {
        onSelect({ from: startDate, to: endDate });
        onClose();
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute left-0 top-full mt-2 z-50 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none",
        showCustom ? "w-auto" : "w-64"
      )}
    >
      {!showCustom ? (
        <div className="p-3">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Select Range</div>
            <div className="space-y-1">
                {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"].map((range) => (
                    <button 
                        key={range} 
                        onClick={() => handlePresetSelect(range)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                        {range}
                    </button>
                ))}
            </div>
            <div className="mt-2 border-t border-gray-100 pt-2">
                <button 
                    onClick={() => setShowCustom(true)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                    Custom Range...
                </button>
            </div>
        </div>
      ) : (
        <div className="p-4">
            <style jsx global>{`
                .react-datepicker {
                    font-family: inherit;
                    border: none;
                }
                .react-datepicker__header {
                    background-color: white;
                    border-bottom: none;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--in-selecting-range,
                .react-datepicker__day--in-range {
                    background-color: #2563eb !important;
                    color: white !important;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: #dbeafe !important;
                    color: #1e40af !important;
                }
                .react-datepicker__day:hover {
                    background-color: #f3f4f6 !important;
                }
            `}</style>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={2}
            />
             <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button 
                    onClick={() => setShowCustom(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    Back
                </button>
                <button 
                    onClick={applyCustomRange}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Apply
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerDropdown;
