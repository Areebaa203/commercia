"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { parseProductImageUrls } from "@/lib/product-images";

const ViewProductModal = ({ isOpen, onClose, product }) => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

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
          <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Content */}
        {product && (() => {
          const gallery = parseProductImageUrls(product.image_url);
          const hero = gallery[0];
          return (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white border border-gray-200">
                  {hero ? (
                    <img src={hero} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <Icon icon="mingcute:pic-line" width="28" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                      #{product.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      product.status?.toLowerCase() === "active" ? "bg-green-100 text-green-700" :
                        product.status?.toLowerCase() === "draft" ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                    )}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {gallery.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white"
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Price</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Icon icon="mingcute:tag-line" className="text-blue-500" width="18" />
                    <span className="font-bold text-gray-900 text-lg">{formatPrice(product.price)}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Stock</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Icon icon="mingcute:box-3-line" className={product.stock > 10 ? "text-green-500" : "text-red-500"} width="18" />
                    <span className="font-medium text-gray-900">{product.stock} units</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Total Sales</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Icon icon="mingcute:chart-bar-line" className="text-purple-500" width="18" />
                    <span className="font-medium text-gray-900">{product.sales} sales</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Revenue (Est.)</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Icon icon="mingcute:wallet-line" className="text-green-500" width="18" />
                    <span className="font-medium text-gray-900">
                      {formatPrice(product.price * product.sales)}
                    </span>
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
          );
        })()}
      </div>
    </div>
  );
};

export default ViewProductModal;
