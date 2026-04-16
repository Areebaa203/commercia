"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const ViewOrderModal = ({ isOpen, onClose, order }) => {
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
          <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Content */}
        {order && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img src={order.customer.avatar} alt={order.customer.name} className="h-16 w-16 rounded-full object-cover bg-white ring-2 ring-white" />
                    <div>
                        <h4 className="font-bold text-gray-900">{order.customer.name}</h4>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                        <div className="mt-2 flex gap-2">
                             <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                                {order.id}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                {order.date}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-gray-100 bg-white">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
                        <div className="mt-1 flex items-center gap-2">
                            <span className={clsx(
                                "h-2 w-2 rounded-full",
                                order.status === "Delivered" ? "bg-green-500" :
                                order.status === "Shipped" ? "bg-blue-500" :
                                order.status === "Processing" ? "bg-yellow-500" : "bg-red-500"
                            )} />
                            <span className="font-medium text-gray-900">{order.status}</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-100 bg-white">
                         <span className="text-xs text-gray-500 uppercase font-semibold">Payment</span>
                         <div className="mt-1 flex items-center gap-2">
                            <Icon icon={order.payment === "Paid" ? "mingcute:check-circle-fill" : "mingcute:time-fill"} className={order.payment === "Paid" ? "text-green-500" : "text-yellow-500"} />
                            <span className="font-medium text-gray-900">{order.payment}</span>
                         </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
                            <span>Item</span>
                            <span>Price</span>
                        </div>
                        <div className="p-3 bg-white">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-900">Product Items ({order.items})</span>
                                <span className="font-medium text-gray-900">{order.total}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-blue-600 text-lg">{order.total}</span>
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

export default ViewOrderModal;
