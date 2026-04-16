"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={clsx(
          "absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={clsx(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Customer Details</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Content */}
        {customer && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img src={customer.avatar} alt={customer.name} className="h-16 w-16 rounded-full object-cover bg-white ring-2 ring-white" />
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{customer.name}</h4>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <div className="mt-2 flex gap-2">
                            <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", 
                                customer.status === "Active" ? "bg-green-100 text-green-700" : 
                                "bg-red-100 text-red-700"
                            )}>
                                {customer.status}
                            </span>
                             <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                                {customer.id}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-gray-100 bg-white">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Total Orders</span>
                        <div className="mt-1 flex items-center gap-2">
                            <Icon icon="mingcute:shopping-bag-2-line" className="text-blue-500" width="18" />
                            <span className="font-bold text-gray-900 text-lg">{customer.orders}</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-100 bg-white">
                         <span className="text-xs text-gray-500 uppercase font-semibold">Total Spent</span>
                         <div className="mt-1 flex items-center gap-2">
                            <Icon icon="mingcute:wallet-line" className="text-green-500" width="18" />
                            <span className="font-bold text-gray-900 text-lg">{customer.spent}</span>
                         </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Icon icon="mingcute:phone-line" width="16" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                <Icon icon="mingcute:location-line" width="16" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="text-sm font-medium text-gray-900">{customer.location}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                <Icon icon="mingcute:time-line" width="16" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Last Order</p>
                                <p className="text-sm font-medium text-gray-900">{customer.lastOrder}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ViewCustomerModal;
