"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

const LogoutModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing tokens)
    router.push("/");
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
          "relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Icon icon="mingcute:exit-fill" className="text-3xl" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Sign out?</h3>
          <p className="text-gray-500">
            Are you sure you want to sign out of your account? You'll need to sign in again to access your dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 shadow-sm shadow-red-500/20 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
