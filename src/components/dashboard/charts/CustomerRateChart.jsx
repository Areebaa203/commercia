"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Active", value: 68 },
  { name: "Inactive", value: 32 },
];
const COLORS = ["#10b981", "#e5e7eb"];

const CustomerRateChart = () => {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Repeat Customer Rate</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Icon icon="mingcute:more-2-fill" width="20" />
        </button>
      </div>

      <div className="relative flex h-[160px] w-full items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">68%</span>
            <span className="text-[10px] text-gray-500">On track for 80% target</span>
        </div>
      </div>
      
      <div className="-mt-[2rem] flex justify-center relative z-[1]">
         <button className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Show details
         </button>
      </div>
    </div>
  );
};

export default CustomerRateChart;
