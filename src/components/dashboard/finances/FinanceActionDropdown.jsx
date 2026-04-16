"use client";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const FinanceActionDropdown = ({ isOpen, onClose, anchorRef, transaction, onView, onDownload, onRefund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: "100%", right: 0, transformOrigin: "top right" });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && anchorRef?.current && dropdownRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (rect.bottom + dropdownHeight + 50 > windowHeight) {
            setPosition({ bottom: "100%", right: 40, marginBottom: "-24px", transformOrigin: "bottom right" });
        } else {
            setPosition({ top: "100%", right: 40, marginTop: "-24px", transformOrigin: "top right" });
        }
    }
  }, [isOpen, anchorRef]);

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

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute w-48 z-50 rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      )}
      style={position} 
    >
      <div className="p-1">
        <button 
            onClick={() => { onClose(); onView && onView(transaction); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
        >
          <Icon icon="mingcute:eye-2-line" width="18" />
          View Details
        </button>
        <button 
            onClick={() => { onClose(); onDownload && onDownload(transaction); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
        >
          <Icon icon="mingcute:download-2-line" width="18" />
          Download Invoice
        </button>
        {transaction?.status === "Completed" && (
            <>
                <div className="my-1 border-t border-gray-100"></div>
                <button 
                    onClick={() => { onClose(); onRefund && onRefund(transaction); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                <Icon icon="mingcute:back-2-line" width="18" />
                Refund
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default FinanceActionDropdown;
