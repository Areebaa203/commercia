"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const DiscountActionDropdown = ({ onEdit, onDelete, onDuplicate, onDeactivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Calculate position to prevent overflow
  const [position, setPosition] = useState({ top: "100%", right: 0, transformOrigin: "top right" });

  useLayoutEffect(() => {
    if (isOpen) {
      // Calculate position
      if (buttonRef.current && dropdownRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (rect.bottom + dropdownHeight + 50 > windowHeight) {
            setPosition({ bottom: "100%", right: 40, marginBottom: "-24px", transformOrigin: "bottom right" });
        } else {
            setPosition({ top: "100%", right: 40, marginTop: "-24px", transformOrigin: "top right" });
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            isOpen ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        )}
      >
        <Icon icon="mingcute:more-2-fill" className="text-xl" />
      </button>

      <div 
        ref={dropdownRef}
        className={clsx(
            "absolute z-10 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg shadow-gray-200/50 transition-all duration-200 origin-top-right",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={position}
      >
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Icon icon="mingcute:edit-2-line" className="text-lg" />
            Edit Discount
          </button>
          <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Icon icon="mingcute:copy-2-line" className="text-lg" />
            Duplicate
          </button>
          <button
            onClick={() => {
              onDeactivate();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Icon icon="mingcute:close-circle-line" className="text-lg" />
            Deactivate
          </button>
          <div className="my-1 h-px bg-gray-100" />
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Icon icon="mingcute:delete-2-line" className="text-lg" />
            Delete
          </button>
        </div>
    </div>
  );
};

export default DiscountActionDropdown;
