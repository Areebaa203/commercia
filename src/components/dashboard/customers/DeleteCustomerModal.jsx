"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const DeleteCustomerModal = ({ isOpen, onClose, customer }) => {
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
          "relative w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <Icon icon="mingcute:delete-2-line" width="24" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Customer?</h3>
            <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{customer?.name}</span>? This action cannot be undone and will remove all their data.
            </p>

            <div className="mt-6 flex w-full gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm"
                    onClick={() => {
                        // Handle delete logic here
                        onClose();
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerModal;
