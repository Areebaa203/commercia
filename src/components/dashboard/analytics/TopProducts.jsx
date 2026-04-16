"use client";
import React from "react";
import { Icon } from "@iconify/react";

const products = [
  {
    id: 1,
    name: "Minimalist Watch",
    category: "Accessories",
    price: "$120.00",
    sales: 124,
    revenue: "$14,880",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    category: "Electronics",
    price: "$240.00",
    sales: 98,
    revenue: "$23,520",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Leather Wallet",
    category: "Accessories",
    price: "$45.00",
    sales: 245,
    revenue: "$11,025",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Smart Speaker",
    category: "Electronics",
    price: "$89.00",
    sales: 156,
    revenue: "$13,884",
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Footwear",
    price: "$110.00",
    sales: 89,
    revenue: "$9,790",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
  },
];

const TopProducts = () => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <p className="text-sm text-gray-500">Best selling products this month</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          View All <Icon icon="mingcute:arrow-right-line" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Sales</th>
              <th className="px-4 py-3 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.sales} sales</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {product.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;
