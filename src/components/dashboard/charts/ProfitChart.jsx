"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";

const data = [
  { name: "1 Jan", value: 4000 },
  { name: "5 Jan", value: 3000 },
  { name: "8 Jan", value: 5000 },
  { name: "12 Jan", value: 2780 },
  { name: "15 Jan", value: 1890 },
  { name: "18 Jan", value: 2390 },
  { name: "22 Jan", value: 3490 },
  { name: "25 Jan", value: 4200 },
  { name: "29 Jan", value: 3800 },
];

const ProfitChart = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Total Profit</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900">$446.7K</h2>
            <span className="flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
              <Icon icon="mingcute:arrow-up-fill" width="12" />
              24.4%
            </span>
            <span className="text-xs text-gray-400">vs. last period</span>
          </div>
        </div>
        <div className="flex gap-2">
           {/* Legend or other controls could go here */}
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon icon="mingcute:store-2-fill" width="20" />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500">Retailers</p>
                <p className="text-lg font-bold text-gray-900">2,884</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Icon icon="mingcute:truck-fill" width="20" />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500">Distributors</p>
                <p className="text-lg font-bold text-gray-900">1,432</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Icon icon="mingcute:building-3-fill" width="20" />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500">Wholesalers</p>
                <p className="text-lg font-bold text-gray-900">562</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitChart;
