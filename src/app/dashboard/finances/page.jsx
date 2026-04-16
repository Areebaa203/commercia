"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import FinanceActionDropdown from "@/components/dashboard/finances/FinanceActionDropdown";
import TransactionDetailsModal from "@/components/dashboard/finances/TransactionDetailsModal";
import WithdrawFundsModal from "@/components/dashboard/finances/WithdrawFundsModal";

// Mock Data
const transactions = [
  { id: "#TRX-9821", customer: "Alice Smith", date: "Oct 24, 2023", time: "14:30", amount: "$129.00", status: "Completed", method: "Credit Card", type: "Sale" },
  { id: "#TRX-9822", customer: "Bob Jones", date: "Oct 24, 2023", time: "13:15", amount: "$45.50", status: "Completed", method: "PayPal", type: "Sale" },
  { id: "#TRX-9823", customer: "Charlie Day", date: "Oct 23, 2023", time: "09:45", amount: "$89.99", status: "Pending", method: "Credit Card", type: "Sale" },
  { id: "#TRX-9824", customer: "David Miller", date: "Oct 23, 2023", time: "16:20", amount: "-$24.00", status: "Refunded", method: "Credit Card", type: "Refund" },
  { id: "#TRX-9825", customer: "Eva Green", date: "Oct 22, 2023", time: "11:00", amount: "$210.00", status: "Completed", method: "Apple Pay", type: "Sale" },
  { id: "#TRX-9826", customer: "Frank White", date: "Oct 22, 2023", time: "10:30", amount: "$59.99", status: "Failed", method: "Credit Card", type: "Sale" },
];

const stats = [
  { label: "Total Revenue", value: "$45,231.89", change: "+12%", trend: "up", icon: "mingcute:wallet-3-fill", color: "bg-blue-500" },
  { label: "Net Profit", value: "$12,450.00", change: "+8%", trend: "up", icon: "mingcute:chart-pie-fill", color: "bg-green-500" },
  { label: "Pending", value: "$1,240.50", change: "-2%", trend: "down", icon: "mingcute:time-fill", color: "bg-yellow-500" },
  { label: "Refunds", value: "$320.00", change: "+1.2%", trend: "down", icon: "mingcute:back-2-fill", color: "bg-red-500" },
];

export default function FinancesPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [openActionId, setOpenActionId] = useState(null);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const actionRefs = useRef({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700 ring-green-600/20";
      case "Pending": return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
      case "Refunded": return "bg-gray-100 text-gray-700 ring-gray-600/20";
      case "Failed": return "bg-red-100 text-red-700 ring-red-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
            <p className="text-sm text-gray-500 mt-1">Track your revenue, expenses, and transaction history.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Icon icon="mingcute:file-export-line" width="18" />
                Export Report
             </button>
             <button 
                onClick={() => setIsWithdrawOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
             >
                <Icon icon="mingcute:card-pay-line" width="18" />
                Withdraw Funds
             </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm", stat.color)}>
                <Icon icon={stat.icon} width="24" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={clsx("flex items-center text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
                    <Icon icon={stat.trend === "up" ? "mingcute:arrow-up-fill" : "mingcute:arrow-down-fill"} width="16" />
                    {stat.change}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table Section */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
                    {["All", "Completed", "Pending", "Refunded"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedStatus(tab)}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                                selectedStatus === tab ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Icon icon="mingcute:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <Icon icon="mingcute:filter-line" width="18" />
                        Filters
                    </button>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
                    <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {transactions.map((trx) => (
                        <tr key={trx.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-gray-900">{trx.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{trx.customer}</td>
                            <td className="px-6 py-4 text-gray-500">{trx.date} <span className="text-xs text-gray-400 ml-1">{trx.time}</span></td>
                            <td className={clsx("px-6 py-4 font-bold", trx.amount.startsWith("-") ? "text-red-600" : "text-green-600")}>
                                {trx.amount}
                            </td>
                            <td className="px-6 py-4">
                                <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(trx.status))}>
                                    {trx.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{trx.method}</td>
                            <td className="px-6 py-4 text-right relative">
                                <button 
                                    ref={(el) => (actionRefs.current[trx.id] = el)}
                                    onClick={() => setOpenActionId(openActionId === trx.id ? null : trx.id)}
                                    className={clsx(
                                        "rounded-lg p-2 transition-colors",
                                        openActionId === trx.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    )}
                                >
                                    <Icon icon="mingcute:more-2-fill" width="20" />
                                </button>
                                <FinanceActionDropdown 
                                    isOpen={openActionId === trx.id} 
                                    onClose={() => setOpenActionId(null)}
                                    anchorRef={{ current: actionRefs.current[trx.id] }}
                                    transaction={trx}
                                    onView={(t) => setViewTransaction(t)}
                                    onDownload={(t) => console.log("Download", t)}
                                    onRefund={(t) => console.log("Refund", t)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">6</span> of <span className="font-medium text-gray-900">1,248</span> results
            </div>
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
                <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0">
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    <button className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 border border-blue-100 shrink-0">
                        1
                    </button>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0">
                        2
                    </button>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0 hidden sm:block">
                        3
                    </button>
                    <span className="text-gray-400 shrink-0">...</span>
                    <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0 hidden sm:block">
                        12
                    </button>
                </div>
                <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 shrink-0">
                    Next
                </button>
            </div>
        </div>
      </div>

      {/* Modals */}
      <TransactionDetailsModal 
        isOpen={!!viewTransaction} 
        onClose={() => setViewTransaction(null)} 
        transaction={viewTransaction} 
      />
      <WithdrawFundsModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
      />
    </div>
  );
}
