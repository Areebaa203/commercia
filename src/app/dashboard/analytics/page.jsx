"use client";
import React, { useState, useRef } from "react";
import StatsCard from "@/components/dashboard/shared/StatsCard";
import DatePickerDropdown from "@/components/dashboard/shared/DatePickerDropdown";
import RevenueChart from "@/components/dashboard/analytics/charts/RevenueChart";
import DeviceChart from "@/components/dashboard/analytics/charts/DeviceChart";
import TrafficChart from "@/components/dashboard/analytics/charts/TrafficChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import { Icon } from "@iconify/react";

const AnalyticsPage = () => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const dateButtonRef = useRef(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">
            Monitor your store performance and business insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <button
              ref={dateButtonRef}
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <Icon icon="mingcute:calendar-line" className="text-lg" />
                <span>Last 30 Days</span>
              </div>
              <Icon icon="mingcute:down-line" className="text-gray-400" />
            </button>
            {isDateOpen && (
              <DatePickerDropdown
                isOpen={isDateOpen}
                onClose={() => setIsDateOpen(false)}
                anchorRef={dateButtonRef}
                onSelect={(range) => console.log(range)}
              />
            )}
          </div>
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap">
            <Icon icon="mingcute:download-2-line" className="text-lg" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$128,430"
          change="12.5%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:wallet-3-line"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Visitors"
          value="45.2k"
          change="5.2%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:user-3-line"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Orders"
          value="1,245"
          change="2.1%"
          changeType="negative"
          period="vs last month"
          icon="mingcute:shopping-bag-3-line"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Conversion Rate"
          value="3.2%"
          change="0.8%"
          changeType="positive"
          period="vs last month"
          icon="mingcute:chart-line-line"
          iconColor="text-orange-600"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="xl:col-span-1">
          <DeviceChart />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <TrafficChart />
        </div>
        <div className="xl:col-span-2">
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
