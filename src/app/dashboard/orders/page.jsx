"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import DatePickerDropdown from "@/components/dashboard/shared/DatePickerDropdown";
import FilterDropdown from "@/components/dashboard/shared/FilterDropdown";
import CreateOrderModal from "@/components/dashboard/orders/CreateOrderModal";
import OrderActionDropdown from "@/components/dashboard/orders/OrderActionDropdown";
import ViewOrderModal from "@/components/dashboard/orders/ViewOrderModal";
import EditOrderModal from "@/components/dashboard/orders/EditOrderModal";
import DeleteOrderModal from "@/components/dashboard/orders/DeleteOrderModal";
import { format } from "date-fns";

// Mock Data for Orders
const orders = [
  { id: "#ORD-7352", date: "Oct 24, 2023", customer: { name: "Alice Smith", email: "alice@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice" }, payment: "Paid", status: "Delivered", total: "$124.00", items: 2 },
  { id: "#ORD-7351", date: "Oct 23, 2023", customer: { name: "Bob Jones", email: "bob@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob" }, payment: "Pending", status: "Processing", total: "$54.50", items: 1 },
  { id: "#ORD-7350", date: "Oct 23, 2023", customer: { name: "Charlie Day", email: "charlie@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie" }, payment: "Paid", status: "Shipped", total: "$230.00", items: 3 },
  { id: "#ORD-7349", date: "Oct 22, 2023", customer: { name: "David Miller", email: "david@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David" }, payment: "Failed", status: "Cancelled", total: "$89.99", items: 1 },
  { id: "#ORD-7348", date: "Oct 21, 2023", customer: { name: "Eva Green", email: "eva@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva" }, payment: "Paid", status: "Delivered", total: "$45.00", items: 1 },
  { id: "#ORD-7347", date: "Oct 20, 2023", customer: { name: "Frank White", email: "frank@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Frank" }, payment: "Refunded", status: "Returned", total: "$120.00", items: 2 },
  { id: "#ORD-7346", date: "Oct 19, 2023", customer: { name: "Grace Lee", email: "grace@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Grace" }, payment: "Paid", status: "Delivered", total: "$67.50", items: 1 },
  { id: "#ORD-7345", date: "Oct 18, 2023", customer: { name: "Henry Ford", email: "henry@example.com", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Henry" }, payment: "Paid", status: "Shipped", total: "$310.00", items: 4 },
];

const stats = [
  { label: "Total Orders", value: "1,248", change: "+12%", trend: "up", icon: "mingcute:shopping-bag-3-fill", color: "bg-blue-500" },
  { label: "Pending", value: "45", change: "-5%", trend: "down", icon: "mingcute:time-fill", color: "bg-yellow-500" },
  { label: "Completed", value: "1,180", change: "+18%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
  { label: "Refunded", value: "23", change: "+2%", trend: "up", icon: "mingcute:refresh-2-fill", color: "bg-red-500" },
];

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  
  // Modal States
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);

  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const dateBtnRef = useRef(null);
  const filterBtnRef = useRef(null);
  const actionRefs = useRef({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 ring-green-600/20";
      case "Shipped": return "bg-blue-100 text-blue-700 ring-blue-600/20";
      case "Processing": return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
      case "Cancelled": return "bg-red-100 text-red-700 ring-red-600/20";
      case "Returned": return "bg-gray-100 text-gray-700 ring-gray-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid": return "text-green-600";
      case "Pending": return "text-yellow-600";
      case "Failed": return "text-red-600";
      case "Refunded": return "text-gray-500 line-through";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Icon icon="mingcute:file-export-line" width="18" />
                Export
             </button>
             <button 
                onClick={() => setIsCreateOrderOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
             >
                <Icon icon="mingcute:add-line" width="18" />
                Create Order
             </button>
             <CreateOrderModal 
                isOpen={isCreateOrderOpen}
                onClose={() => setIsCreateOrderOpen(false)}
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

      {/* Orders Table Section */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
                    {["All", "Paid", "Pending", "Cancelled", "Returns"].map((tab) => (
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
                            placeholder="Search order ID or customer..." 
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div className="relative" ref={dateBtnRef}>
                         <button 
                            onClick={() => setIsDateOpen(!isDateOpen)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            <Icon icon="mingcute:calendar-line" width="18" />
                            {dateRange.from && dateRange.to 
                                ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}` 
                                : "Select Dates"}
                         </button>
                         <DatePickerDropdown 
                            isOpen={isDateOpen} 
                            onClose={() => setIsDateOpen(false)} 
                            anchorRef={dateBtnRef}
                            onSelect={setDateRange}
                         />
                    </div>
                    <div className="relative" ref={filterBtnRef}>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <Icon icon="mingcute:filter-line" width="18" />
                            Filters
                        </button>
                        <FilterDropdown 
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            anchorRef={filterBtnRef}
                            onApply={(filters) => console.log(filters)}
                        />
                    </div>
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
                                <span>Order ID</span>
                            </div>
                        </th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Payment</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Total</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span>{order.id}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{order.date}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={order.customer.avatar} alt={order.customer.name} className="h-8 w-8 rounded-full bg-gray-100 object-cover" />
                                    <div>
                                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Icon icon={order.payment === "Paid" ? "mingcute:check-circle-fill" : "mingcute:time-fill"} className={clsx("w-4 h-4", getPaymentColor(order.payment))} />
                                    <span className={clsx("font-medium", getPaymentColor(order.payment))}>{order.payment}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusColor(order.status))}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                {order.total}
                                <span className="ml-1 text-xs text-gray-400 font-normal">({order.items} items)</span>
                            </td>
                            <td className="px-6 py-4 text-right relative">
                                <button 
                                    ref={(el) => (actionRefs.current[order.id] = el)}
                                    onClick={() => setOpenActionId(openActionId === order.id ? null : order.id)}
                                    className={clsx(
                                        "rounded-lg p-2 transition-colors",
                                        openActionId === order.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    )}
                                >
                                    <Icon icon="mingcute:more-2-fill" width="20" />
                                </button>
                                <OrderActionDropdown 
                                     isOpen={openActionId === order.id} 
                                     onClose={() => setOpenActionId(null)}
                                     anchorRef={{ current: actionRefs.current[order.id] }}
                                     order={order}
                                     onView={(o) => setViewOrder(o)}
                                     onEdit={(o) => setEditOrder(o)}
                                     onDelete={(o) => setDeleteOrder(o)}
                                 />
                             </td>
                         </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modals */}
        <ViewOrderModal 
            isOpen={!!viewOrder} 
            onClose={() => setViewOrder(null)} 
            order={viewOrder} 
        />
        <EditOrderModal 
            isOpen={!!editOrder} 
            onClose={() => setEditOrder(null)} 
            order={editOrder} 
        />
        <DeleteOrderModal 
            isOpen={!!deleteOrder} 
            onClose={() => setDeleteOrder(null)} 
            order={deleteOrder} 
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">10</span> of <span className="font-medium text-gray-900">1,248</span> results
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
    </div>
  );
}