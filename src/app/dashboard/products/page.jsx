"use client";
import { useEffect, useCallback, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import ProductFilterDropdown from "@/components/dashboard/products/ProductFilterDropdown";
import ProductActionDropdown from "@/components/dashboard/products/ProductActionDropdown";
import ViewProductModal from "@/components/dashboard/products/ViewProductModal";
import EditProductModal from "@/components/dashboard/products/EditProductModal";
import DuplicateProductModal from "@/components/dashboard/products/DuplicateProductModal";
import DeleteProductModal from "@/components/dashboard/products/DeleteProductModal";
import AddProductModal from "@/components/dashboard/products/AddProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [filters, setFilters] = useState({ category: "All", stockStatus: "All", priceRange: "All" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Stats State
  const [stats, setStats] = useState([
    { label: "Total Products", value: "0", change: "0%", trend: "up", icon: "mingcute:box-3-fill", color: "bg-blue-500" },
    { label: "In Stock", value: "0", change: "0%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
    { label: "Low Stock", value: "0", change: "0%", trend: "down", icon: "mingcute:alert-fill", color: "bg-yellow-500" },
    { label: "Out of Stock", value: "0", change: "0%", trend: "up", icon: "mingcute:close-circle-fill", color: "bg-red-500" },
  ]);

  // Modal States
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [duplicateProduct, setDuplicateProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const filterBtnRef = useRef(null);
  const actionRefs = useRef({});
  const activeRequestRef = useRef(0);

  const fetchProducts = useCallback(async () => {
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        status: selectedStatus,
        category: filters.category,
        stockStatus: filters.stockStatus,
        priceRange: filters.priceRange,
        page: String(currentPage),
        pageSize: String(pageSize),
      });

      const response = await fetch(`/api/products?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to fetch products");
      }

      if (activeRequestRef.current !== requestId) return;

      const data = payload.data || {};
      const apiStats = data.stats || {};

      setProducts(data.products || []);
      setTotalCount(data.totalCount || 0);
      setStats([
        { label: "Total Products", value: (apiStats.total || 0).toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:box-3-fill", color: "bg-blue-500" },
        { label: "In Stock", value: (apiStats.inStock || 0).toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:check-circle-fill", color: "bg-green-500" },
        { label: "Low Stock", value: (apiStats.lowStock || 0).toLocaleString(), change: "-0%", trend: "down", icon: "mingcute:alert-fill", color: "bg-yellow-500" },
        { label: "Out of Stock", value: (apiStats.outOfStock || 0).toLocaleString(), change: "+0%", trend: "up", icon: "mingcute:close-circle-fill", color: "bg-red-500" },
      ]);
    } catch (error) {
      if (activeRequestRef.current !== requestId) return;
      console.error("Error fetching products:", error.message);
    } finally {
      if (activeRequestRef.current !== requestId) return;
      setLoading(false);
    }
  }, [debouncedSearch, selectedStatus, filters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce: update debouncedSearch 400ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const getStockColor = (status, stock) => {
    if (stock === 0) return "text-red-600 bg-red-50";
    if (stock < 10) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0) return "bg-red-100 text-red-700 ring-red-600/20";
    if (stock < 10) return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";

    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-700 ring-green-600/20";
      case "draft": return "bg-gray-100 text-gray-700 ring-gray-600/20";
      case "archived": return "bg-red-100 text-red-700 ring-red-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory and catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Icon icon="mingcute:file-export-line" width="18" />
            Export
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Icon icon="mingcute:add-line" width="18" />
            Add Product
          </button>
          <AddProductModal
            isOpen={isAddProductOpen}
            onClose={() => setIsAddProductOpen(false)}
            onSuccess={fetchProducts}
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

      {/* Products Table Section */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-fit">
              {["All", "Active", "Draft", "Archived"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedStatus(tab);
                    setCurrentPage(1);
                  }}
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
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-9 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      if (debounceRef.current) clearTimeout(debounceRef.current);
                      setSearchQuery("");
                      setDebouncedSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <Icon icon="mingcute:close-line" width="15" />
                  </button>
                )}
              </div>
              <div className="relative" ref={filterBtnRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Icon icon="mingcute:filter-line" width="18" />
                  {filters.category !== "All" ? filters.category : "Filters"}
                </button>
                <ProductFilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  anchorRef={filterBtnRef}
                  onApply={(newFilters) => {
                    setFilters(newFilters);
                    setCurrentPage(1);
                  }}
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
                    <span>Product</span>
                  </div>
                </th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Stock</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Sales</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Icon icon="mingcute:loading-fill" className="animate-spin text-blue-500" width="24" />
                      <span className="text-gray-400">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", getStatusBadge(product.status, product.stock))}>
                        {product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", getStockColor(product.status, product.stock))}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        ref={(el) => (actionRefs.current[product.id] = el)}
                        onClick={() => setOpenActionId(openActionId === product.id ? null : product.id)}
                        className={clsx(
                          "rounded-lg p-2 transition-colors",
                          openActionId === product.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        )}
                      >
                        <Icon icon="mingcute:more-2-fill" width="20" />
                      </button>
                      <ProductActionDropdown
                        isOpen={openActionId === product.id}
                        onClose={() => setOpenActionId(null)}
                        anchorRef={{ current: actionRefs.current[product.id] }}
                        product={product}
                        onView={(p) => setViewProduct(p)}
                        onEdit={(p) => setEditProduct(p)}
                        onDuplicate={(p) => setDuplicateProduct(p)}
                        onDelete={(p) => setDeleteProduct(p)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <ViewProductModal
          isOpen={!!viewProduct}
          onClose={() => setViewProduct(null)}
          product={viewProduct}
        />
        <EditProductModal
          isOpen={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
          onSuccess={fetchProducts}
        />
        <DuplicateProductModal
          isOpen={!!duplicateProduct}
          onClose={() => setDuplicateProduct(null)}
          product={duplicateProduct}
          onSuccess={fetchProducts}
        />
        <DeleteProductModal
          isOpen={!!deleteProduct}
          onClose={() => setDeleteProduct(null)}
          product={deleteProduct}
          onSuccess={fetchProducts}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-6 py-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium text-gray-900">{Math.min(totalCount, (currentPage - 1) * pageSize + 1)}</span> to <span className="font-medium text-gray-900">{Math.min(totalCount, currentPage * pageSize)}</span> of <span className="font-medium text-gray-900">{totalCount}</span> results
          </div>
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => {
                const pageNum = i + 1;
                // Simple pagination logic: show current, first, last, and neighbors
                if (
                  pageNum === 1 ||
                  pageNum === Math.ceil(totalCount / pageSize) ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={clsx(
                        "rounded-lg px-3 py-1 text-sm font-medium shrink-0",
                        currentPage === pageNum ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-gray-400 shrink-0">...</span>;
                }
                return null;
              })}
            </div>
            <button
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              onClick={() => setCurrentPage(p => p + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}