"use client";
import React, { useState } from "react";
import { clsx } from "clsx";

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const NotificationSettings = () => {
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailStock, setEmailStock] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushOrders, setPushOrders] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">Email Notifications</h3>
        <p className="mb-4 text-sm text-gray-500">Manage what emails you receive from us.</p>
        
        <div className="divide-y divide-gray-100">
          <Toggle
            label="Order Confirmation"
            description="Receive an email when a new order is placed."
            checked={emailOrders}
            onChange={setEmailOrders}
          />
          <Toggle
            label="Low Stock Alert"
            description="Get notified when product stock runs low."
            checked={emailStock}
            onChange={setEmailStock}
          />
          <Toggle
            label="Marketing & Updates"
            description="Receive news about new features and updates."
            checked={emailMarketing}
            onChange={setEmailMarketing}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">Push Notifications</h3>
        <p className="mb-4 text-sm text-gray-500">Manage notifications on your desktop.</p>
        
        <div className="divide-y divide-gray-100">
          <Toggle
            label="New Orders"
            description="Get a push notification for every new order."
            checked={pushOrders}
            onChange={setPushOrders}
          />
          <Toggle
            label="New Messages"
            description="Get notified when a customer sends a message."
            checked={pushMessages}
            onChange={setPushMessages}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
