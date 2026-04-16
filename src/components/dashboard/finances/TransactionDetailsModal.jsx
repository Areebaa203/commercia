"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
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
          <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Content */}
        {transaction && (
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 mb-3">
                        <Icon icon="mingcute:check-circle-fill" width="24" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">{transaction.amount}</h4>
                    <p className="text-sm text-gray-500 mt-1">{transaction.date} at {transaction.time}</p>
                    <span className={clsx("mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", 
                        transaction.status === "Completed" ? "bg-green-100 text-green-700" : 
                        transaction.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                    )}>
                        {transaction.status}
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Transaction ID</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{transaction.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Customer</span>
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${transaction.customer}`} alt="Avatar" className="h-full w-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{transaction.customer}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Payment Method</span>
                        <div className="flex items-center gap-2">
                            <Icon icon="mingcute:card-pay-line" className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{transaction.method}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                    </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                    <button 
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Icon icon="mingcute:download-2-line" width="18" />
                        Download Invoice
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
