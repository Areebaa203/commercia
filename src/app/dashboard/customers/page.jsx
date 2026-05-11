"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import DatePickerDropdown from "@/components/dashboard/shared/DatePickerDropdown";
import CustomerFilterDropdown from "@/components/dashboard/customers/CustomerFilterDropdown";
import AddCustomerModal from "@/components/dashboard/customers/AddCustomerModal";
import ViewCustomerModal from "@/components/dashboard/customers/ViewCustomerModal";
import EditCustomerModal from "@/components/dashboard/customers/EditCustomerModal";
import DeleteCustomerModal from "@/components/dashboard/customers/DeleteCustomerModal";
import CustomerActionDropdown from "@/components/dashboard/customers/CustomerActionDropdown";
import { formatDistanceToNow, format } from "date-fns";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownFilters, setDropdownFilters] = useState({ status: "All", sortBy: "created_at", sortOrder: "desc", minSpent: "0", minOrders: "0" });
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);

  const dateBtnRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [stats, setStats] = useState([
    { label: "Total Customers", value: "0", change: "0%", trend: "up", icon: "mingcute:user-3-fill", color: "bg-blue-500" },
    { label: "Active Users", value: "0", change: "0%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
    { label: "New Signups", value: "0", change: "0%", trend: "up", icon: "mingcute:user-add-fill", color: "bg-purple-500" },
    { label: "Blocked Users", value: "0", change: "0%", trend: "down", icon: "mingcute:close-circle-fill", color: "bg-red-500" },
  ]);
  
  // Modal States
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  const actionRefs = useRef({});

  const fetchCustomers = useCallback(async (page = 1, filter = "All", q = "", dFilters = {}, dRange = {}) => {
    try {
      setLoading(true);
      let url = `/api/dashboard/customers?page=${page}&pageSize=${pageSize}&filter=${filter}&q=${encodeURIComponent(q)}`;
      
      if (dFilters.sortBy) url += `&sortBy=${dFilters.sortBy}`;
      if (dFilters.sortOrder) url += `&sortOrder=${dFilters.sortOrder}`;
      if (dFilters.minSpent && dFilters.minSpent !== "0") url += `&minSpent=${dFilters.minSpent}`;
      if (dFilters.minOrders && dFilters.minOrders !== "0") url += `&minOrders=${dFilters.minOrders}`;
      if (dRange.from) url += `&startDate=${dRange.from.toISOString()}`;
      if (dRange.to) url += `&endDate=${dRange.to.toISOString()}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        const mapped = json.data.map(c => ({
          id: `#CUST-${c.id.slice(0, 5).toUpperCase()}`,
          rawId: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || "N/A",
          location: c.location || "N/A",
          orders: c.total_orders || 0,
          spent: `$${parseFloat(c.total_spent || 0).toLocaleString()}`,
          status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
          lastOrder: c.last_order_at ? formatDistanceToNow(new Date(c.last_order_at), { addSuffix: true }) : "Never",
          avatar: c.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${c.id}`,
          original: c
        }));
        setCustomers(mapped);
        setTotalResults(json.totalCount);

        const s = json.stats;
        setStats([
          { label: "Total Customers", value: s.total.toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:user-3-fill", color: "bg-blue-500" },
          { label: "Active Users", value: s.active.toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
          { label: "New Signups", value: s.newSignups.toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:user-add-fill", color: "bg-purple-500" },
          { label: "Blocked Users", value: s.blocked.toLocaleString(), change: "0%", trend: "down", icon: "mingcute:close-circle-fill", color: "bg-red-500" },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard customers:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchCustomers(currentPage, selectedStatus, searchQuery, dropdownFilters, dateRange);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers, currentPage, selectedStatus, searchQuery, dropdownFilters, dateRange]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setDropdownFilters(prev => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterApply = (filters) => {
    setDropdownFilters(filters);
    setSelectedStatus(filters.status);
    setCurrentPage(1);
  };

  const handleDateSelect = (range) => {
    setDateRange(range);
    setCurrentPage(1);
  };

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
                onSuccess={() => fetchCustomers(currentPage, selectedStatus, searchQuery, dropdownFilters, dateRange)}
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
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 min-h-[450px]">
        {/* Filters */}
        <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
                    {["All", "Active", "Blocked"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleStatusChange(tab)}
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
                            type="search" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search customers..." 
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
                            onSelect={handleDateSelect}
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
                        <CustomerFilterDropdown 
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            anchorRef={filterBtnRef}
                            onApply={handleFilterApply}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Table */}
        <div>
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
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <Icon icon="line-md:loading-twotone-loop" className="size-8 text-blue-600" />
                                    <p className="text-sm font-medium text-gray-500">Loading customers...</p>
                                </div>
                            </td>
                        </tr>
                    ) : customers.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                                No customers found.
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.rawId} className="group hover:bg-gray-50/50 transition-colors">
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
                                        ref={(el) => (actionRefs.current[customer.rawId] = el)}
                                        onClick={() => setOpenActionId(openActionId === customer.rawId ? null : customer.rawId)}
                                        className={clsx(
                                            "rounded-lg p-2 transition-colors",
                                            openActionId === customer.rawId ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        )}
                                    >
                                        <Icon icon="mingcute:more-2-fill" width="20" />
                                    </button>
                                    <CustomerActionDropdown 
                                        isOpen={openActionId === customer.rawId} 
                                        onClose={() => setOpenActionId(null)}
                                        anchorRef={{ current: actionRefs.current[customer.rawId] }}
                                        customer={customer}
                                        onView={(c) => setViewCustomer(c)}
                                        onEdit={(c) => setEditCustomer(c)}
                                        onDelete={(c) => setDeleteCustomer(c)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, totalResults)}</span> of <span className="font-medium text-gray-900">{totalResults.toLocaleString()}</span> results
            </div>
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
                <button 
                    disabled={currentPage === 1 || loading}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
                >
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(totalResults / pageSize) }).map((_, i) => {
                        const page = i + 1;
                        if (
                            page === 1 || 
                            page === Math.ceil(totalResults / pageSize) || 
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={clsx(
                                        "rounded-lg px-3 py-1 text-sm font-medium shrink-0 transition-colors",
                                        currentPage === page 
                                            ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        }
                        if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="text-gray-400 shrink-0">...</span>;
                        }
                        return null;
                    })}
                </div>
                <button 
                    disabled={currentPage === Math.ceil(totalResults / pageSize) || loading}
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalResults / pageSize), prev + 1))}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
                >
                    Next
                </button>
            </div>
        </div>
      </div>

      {/* Modals */}
      <ViewCustomerModal 
        isOpen={!!viewCustomer} 
        onClose={() => setViewCustomer(null)} 
        customer={viewCustomer?.original} 
      />
      <EditCustomerModal 
        isOpen={!!editCustomer} 
        onClose={() => setEditCustomer(null)} 
        customer={editCustomer?.original} 
        onSuccess={() => fetchCustomers(currentPage, selectedStatus, searchQuery, dropdownFilters, dateRange)}
      />
      <DeleteCustomerModal 
        isOpen={!!deleteCustomer} 
        onClose={() => setDeleteCustomer(null)} 
        customer={deleteCustomer?.original} 
        onSuccess={() => fetchCustomers(currentPage, selectedStatus, searchQuery, dropdownFilters, dateRange)}
      />
    </div>
  );
}
