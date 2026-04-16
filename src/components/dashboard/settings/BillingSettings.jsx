"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const BillingSettings = () => {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-500">You are currently on the <span className="font-medium text-gray-900">Pro Plan</span>.</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
             <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shrink-0">Active</span>
             <button className="flex-1 sm:flex-none rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                Cancel Plan
             </button>
             <Link 
                href="/dashboard/upgrade"
                className="flex-1 sm:flex-none text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
             >
                Upgrade Plan
             </Link>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Billing Cycle</p>
                <p className="mt-1 text-lg font-bold text-gray-900">Monthly</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Next Payment</p>
                <p className="mt-1 text-lg font-bold text-gray-900">Nov 24, 2024</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Amount</p>
                <p className="mt-1 text-lg font-bold text-gray-900">$29.00</p>
            </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Add New</button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-gray-200 p-4 gap-4">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-white shadow-sm border border-gray-100">
                    <Icon icon="mingcute:visa-line" className="text-3xl text-blue-900" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/2025</p>
                </div>
            </div>
            <button className="self-end sm:self-auto rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <Icon icon="mingcute:more-2-fill" className="text-xl" />
            </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Download All</button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { id: "#INV-001", date: "Oct 24, 2024", amount: "$29.00", status: "Paid" },
                        { id: "#INV-002", date: "Sep 24, 2024", amount: "$29.00", status: "Paid" },
                        { id: "#INV-003", date: "Aug 24, 2024", amount: "$29.00", status: "Paid" },
                    ].map((invoice, index) => (
                        <tr key={index}>
                            <td className="py-3 font-medium text-gray-900">{invoice.id}</td>
                            <td className="py-3 text-gray-500">{invoice.date}</td>
                            <td className="py-3 text-gray-900">{invoice.amount}</td>
                            <td className="py-3">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    {invoice.status}
                                </span>
                            </td>
                            <td className="py-3 text-right">
                                <button className="text-gray-400 hover:text-blue-600">
                                    <Icon icon="mingcute:download-2-line" className="text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
