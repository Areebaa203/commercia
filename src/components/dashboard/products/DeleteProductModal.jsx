"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import axios from "axios";
const DeleteProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/products/delete/${product.id}`);

      onSuccess?.();
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product.";
      console.error("Error deleting product:", msg);
      alert("Failed to delete product: " + msg);
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="text-lg font-bold text-gray-900">Delete Product?</h3>
            <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{product?.name}</span>? This action cannot be undone and will remove the product from your store.
            </p>

            <div className="mt-6 flex w-full gap-3">
                <button 
                    disabled={loading}
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    disabled={loading}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    onClick={handleDelete}
                >
                    {loading && <Icon icon="mingcute:loading-fill" className="animate-spin" />}
                    Delete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
