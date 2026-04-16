"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import Link from "next/link";

const ProfileDropdown = ({ isOpen, onClose, anchorRef, onLogoutClick, user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
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

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute right-0 top-full mt-2 w-56 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-200",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      )}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{user?.user_metadata?.full_name || user?.user_metadata?.fullName || 'User'}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
      </div>
      
      <div className="p-1">
        <Link
          href="/dashboard/settings?tab=profile"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Icon icon="mingcute:user-3-line" width="16" />
          <span>My Profile</span>
        </Link>
        <Link
          href="/dashboard/settings?tab=general"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Icon icon="mingcute:settings-3-line" width="16" />
          <span>Settings</span>
        </Link>
        <Link
          href="/dashboard/settings?tab=billing"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Icon icon="mingcute:card-pay-line" width="16" />
          <span>Billing</span>
        </Link>
      </div>

      <div className="p-1 border-t border-gray-100">
        <button
          onClick={() => {
            onClose();
            if (onLogoutClick) onLogoutClick();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Icon icon="mingcute:exit-line" width="16" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
