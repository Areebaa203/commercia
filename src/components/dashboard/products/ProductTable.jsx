import React from "react";
import { Icon } from "@iconify/react";

const products = [
  { id: "#83009", name: "Hybrid Active Noise Cancelling", sold: "2,310 sold", revenue: "$124,839", rating: 5.0, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop" },
  { id: "#83001", name: "Casio G-Shock Shock Resis...", sold: "1,230 sold", revenue: "$92,662", rating: 4.8, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=200&auto=format&fit=crop" },
  { id: "#83004", name: "SAMSUNG Galaxy S25 Ultra...", sold: "812 sold", revenue: "$74,048", rating: 4.7, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200&auto=format&fit=crop" },
  { id: "#83002", name: "Xbox Wireless Gaming Co...", sold: "645 sold", revenue: "$62,820", rating: 4.5, image: "https://images.unsplash.com/photo-1650586044209-a79e6a633d35?q=80&w=200&auto=format&fit=crop" },
  { id: "#83003", name: "Timex Men's Easy Reader...", sold: "572 sold", revenue: "$48,724", rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop" },
];

const ProductTable = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Best Selling Products</h3>
        <button className="text-gray-400 hover:text-gray-600">
           <Icon icon="mingcute:more-2-fill" width="20" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Sold</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-gray-50/50">
                <td className="px-4 py-4 font-medium text-gray-400">{product.id}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">{product.sold}</td>
                <td className="px-4 py-4 text-right font-semibold text-green-600">{product.revenue}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Icon icon="mingcute:star-fill" className="text-yellow-400" width="16" />
                    <span className="font-medium text-gray-900">({product.rating})</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
