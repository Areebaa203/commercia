"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import AddCustomerModal from "@/components/dashboard/customers/AddCustomerModal";
import ViewCustomerModal from "@/components/dashboard/customers/ViewCustomerModal";
import EditCustomerModal from "@/components/dashboard/customers/EditCustomerModal";
import DeleteCustomerModal from "@/components/dashboard/customers/DeleteCustomerModal";
import CustomerActionDropdown from "@/components/dashboard/customers/CustomerActionDropdown";

// Mock Data for Customers
const customers = [
  { id: "#CUST-001", name: "Alice Smith", email: "alice@example.com", phone: "+1 (555) 123-4567", location: "New York, USA", orders: 12, spent: "$1,240.00", status: "Active", lastOrder: "2 days ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice" },
  { id: "#CUST-002", name: "Bob Jones", email: "bob@example.com", phone: "+1 (555) 987-6543", location: "London, UK", orders: 5, spent: "$450.50", status: "Active", lastOrder: "1 week ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob" },
  { id: "#CUST-003", name: "Charlie Day", email: "charlie@example.com", phone: "+1 (555) 456-7890", location: "Toronto, Canada", orders: 24, spent: "$3,120.00", status: "Active", lastOrder: "3 hours ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie" },
  { id: "#CUST-004", name: "David Miller", email: "david@example.com", phone: "+1 (555) 234-5678", location: "Sydney, Australia", orders: 1, spent: "$89.99", status: "Blocked", lastOrder: "1 month ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David" },
  { id: "#CUST-005", name: "Eva Green", email: "eva@example.com", phone: "+1 (555) 876-5432", location: "Paris, France", orders: 8, spent: "$760.00", status: "Active", lastOrder: "5 days ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva" },
  { id: "#CUST-006", name: "Frank White", email: "frank@example.com", phone: "+1 (555) 345-6789", location: "Berlin, Germany", orders: 3, spent: "$210.00", status: "Active", lastOrder: "2 weeks ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Frank" },
  { id: "#CUST-007", name: "Grace Lee", email: "grace@example.com", phone: "+1 (555) 654-3210", location: "Tokyo, Japan", orders: 15, spent: "$1,890.00", status: "Active", lastOrder: "1 day ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Grace" },
  { id: "#CUST-008", name: "Henry Ford", email: "henry@example.com", phone: "+1 (555) 789-0123", location: "Dubai, Australia", orders: 6, spent: "$540.00", status: "Blocked", lastOrder: "3 weeks ago", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Henry" },
];

const stats = [
  { label: "Total Customers", value: "2,450", change: "+15%", trend: "up", icon: "mingcute:user-3-fill", color: "bg-blue-500" },
  { label: "Active Users", value: "1,890", change: "+8%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
  { label: "New Signups", value: "145", change: "+24%", trend: "up", icon: "mingcute:user-add-fill", color: "bg-purple-500" },
  { label: "Blocked Users", value: "25", change: "-5%", trend: "down", icon: "mingcute:close-circle-fill", color: "bg-red-500" },
];

export default function CustomersPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  
  // Modal States
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  const actionRefs = useRef({});

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your customer base and view their details.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Icon icon="mingcute:file-export-line" width="18" />
                Export
             </button>
             <button 
                onClick={() => setIsAddCustomerOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
             >
                <Icon icon="mingcute:user-add-line" width="18" />
                Add Customer
             </button>
             <AddCustomerModal 
                isOpen={isAddCustomerOpen}
                onClose={() => setIsAddCustomerOpen(false)}
             />
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

      {/* Customers Table Section */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
                    {["All", "Active", "Blocked"].map((tab) => (
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
                            placeholder="Search customers..." 
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
                        <th className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span>Customer</span>
                            </div>
                        </th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-right">Orders</th>
                        <th className="px-6 py-4 text-right">Spent</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                                    <div>
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-xs text-gray-400">{customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{customer.phone}</td>
                            <td className="px-6 py-4 text-gray-500">{customer.location}</td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">{customer.orders}</td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">{customer.spent}</td>
                            <td className="px-6 py-4">
                                <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", 
                                    customer.status === "Active" ? "bg-green-100 text-green-700 ring-green-600/20" : "bg-red-100 text-red-700 ring-red-600/20"
                                )}>
                                    {customer.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right relative">
                                <button 
                                    ref={(el) => (actionRefs.current[customer.id] = el)}
                                    onClick={() => setOpenActionId(openActionId === customer.id ? null : customer.id)}
                                    className={clsx(
                                        "rounded-lg p-2 transition-colors",
                                        openActionId === customer.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    )}
                                >
                                    <Icon icon="mingcute:more-2-fill" width="20" />
                                </button>
                                <CustomerActionDropdown 
                                    isOpen={openActionId === customer.id} 
                                    onClose={() => setOpenActionId(null)}
                                    anchorRef={{ current: actionRefs.current[customer.id] }}
                                    customer={customer}
                                    onView={(c) => setViewCustomer(c)}
                                    onEdit={(c) => setEditCustomer(c)}
                                    onDelete={(c) => setDeleteCustomer(c)}
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
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">8</span> of <span className="font-medium text-gray-900">2,450</span> results
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
      <ViewCustomerModal 
        isOpen={!!viewCustomer} 
        onClose={() => setViewCustomer(null)} 
        customer={viewCustomer} 
      />
      <EditCustomerModal 
        isOpen={!!editCustomer} 
        onClose={() => setEditCustomer(null)} 
        customer={editCustomer} 
      />
      <DeleteCustomerModal 
        isOpen={!!deleteCustomer} 
        onClose={() => setDeleteCustomer(null)} 
        customer={deleteCustomer} 
      />
    </div>
  );
}
