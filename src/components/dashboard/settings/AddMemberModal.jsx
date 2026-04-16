"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const AddMemberModal = ({ isOpen, onClose, onSave }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset form
      setEmail("");
      setRole("Viewer");
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

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
          "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:mail-line" className="text-lg" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="Viewer">Viewer (Read-only)</option>
                <option value="Editor">Editor (Can edit content)</option>
                <option value="Admin">Admin (Full access)</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:shield-line" className="text-lg" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="mingcute:down-line" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
                {role === "Viewer" && "Can only view settings and data."}
                {role === "Editor" && "Can edit products, orders, and content."}
                {role === "Admin" && "Has full access to all settings and billing."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ email, role });
              onClose();
            }}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
