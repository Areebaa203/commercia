"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddDiscountModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [discountType, setDiscountType] = useState("percentage"); // percentage, fixed, free_shipping
  const [appliesTo, setAppliesTo] = useState("all_products"); // all_products, specific_collections, specific_products
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [hasEndDate, setHasEndDate] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset or populate form
      if (initialData) {
        setCode(initialData.code);
        setDiscountType(initialData.type);
        setValue(initialData.value);
        // ... populate other fields
      } else {
        // Reset for new
        setCode("");
        setValue("");
        setDiscountType("percentage");
        setStartDate(new Date());
        setEndDate(null);
        setHasEndDate(false);
      }
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, initialData]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Discount" : "Create Discount"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <Icon icon="mingcute:close-line" className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Discount Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Discount Code</label>
              <button
                onClick={generateCode}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Generate random code
              </button>
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER2024"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500">Customers will enter this code at checkout.</p>
          </div>

          {/* Discount Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Discount Type</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: "percentage", label: "Percentage", icon: "mingcute:tag-2-fill" },
                { id: "fixed", label: "Fixed Amount", icon: "mingcute:currency-dollar-fill" },
                { id: "free_shipping", label: "Free Shipping", icon: "mingcute:truck-fill" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setDiscountType(type.id)}
                  className={clsx(
                    "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                    discountType === type.id
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Icon icon={type.icon} className="text-lg" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value Section */}
          {discountType !== "free_shipping" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Discount Value</label>
              <div className="relative">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder={discountType === "percentage" ? "20" : "10.00"}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon
                    icon={discountType === "percentage" ? "mingcute:tag-2-fill" : "mingcute:currency-dollar-fill"}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Dates */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Active Dates</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-gray-500">Start Date</label>
                <div className="relative">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
                    />
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon icon="mingcute:calendar-line" />
                    </div>
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-gray-500">End Date</label>
                    <div className="flex items-center gap-2">
                         <input 
                            type="checkbox" 
                            id="hasEndDate" 
                            checked={hasEndDate} 
                            onChange={(e) => setHasEndDate(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="hasEndDate" className="text-xs text-gray-500 cursor-pointer">Set End Date</label>
                    </div>
                </div>
                <div className={clsx("relative", !hasEndDate && "opacity-50 pointer-events-none")}>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="No expiration"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon icon="mingcute:calendar-line" />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-700">Usage Limits (Optional)</label>
             <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input 
                    type="checkbox" 
                    id="limitUsage" 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="limitUsage" className="text-sm text-gray-600">Limit number of times this discount can be used in total</label>
             </div>
             <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input 
                    type="checkbox" 
                    id="limitOnePerUser" 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="limitOnePerUser" className="text-sm text-gray-600">Limit to one use per customer</label>
             </div>
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-6">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
                // Construct discount object
                const newDiscount = {
                    code,
                    type: discountType,
                    value,
                    startDate,
                    endDate: hasEndDate ? endDate : null,
                    status: 'Active'
                };
                onSave(newDiscount);
                onClose();
            }}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors"
          >
            {initialData ? "Save Changes" : "Create Discount"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountModal;
