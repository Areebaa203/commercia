"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const GeneralSettings = () => {
  const [storeName, setStoreName] = useState("Commercia Store");
  const [supportEmail, setSupportEmail] = useState("support@commercia.com");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Store Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store Name</label>
            <div className="relative">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:store-2-line" className="text-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Support Email</label>
            <div className="relative">
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:mail-line" className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Regional Settings</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Currency</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:currency-dollar-line" className="text-lg" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="mingcute:down-line" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="UTC-8 (PST)">Pacific Time (UTC-8)</option>
                <option value="UTC-5 (EST)">Eastern Time (UTC-5)</option>
                <option value="UTC+0 (GMT)">Greenwich Mean Time (UTC+0)</option>
                <option value="UTC+1 (CET)">Central European Time (UTC+1)</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:time-line" className="text-lg" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon icon="mingcute:down-line" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
