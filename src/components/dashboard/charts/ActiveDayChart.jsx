"use client";
import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { Icon } from "@iconify/react";

const data = [
  { name: "Sun", value: 4000 },
  { name: "Mon", value: 3000 },
  { name: "Tue", value: 8162 },
  { name: "Wed", value: 2780 },
  { name: "Thu", value: 1890 },
  { name: "Fri", value: 2390 },
  { name: "Sat", value: 3490 },
];

const ActiveDayChart = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Most Day Active</h3>
        <button className="text-gray-400 hover:text-gray-600">
           <Icon icon="mingcute:more-2-fill" width="20" />
        </button>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={16}
                  textAnchor="middle"
                  fill={payload.value === "Tue" ? "#3b82f6" : "#9ca3af"}
                  fontSize={12}
                  fontWeight={payload.value === "Tue" ? "bold" : "normal"}
                >
                  {payload.value}
                </text>
              )}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 4, 4]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Tue" ? "#3b82f6" : "#e5e7eb"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-center pointer-events-none">
            {/* Optional: Add custom label for the highest bar if needed, 
                but based on image, just the bar color and label color change is enough */}
        </div>
      </div>
    </div>
  );
};

export default ActiveDayChart;
