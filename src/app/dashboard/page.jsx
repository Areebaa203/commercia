"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import StatsCard from "@/components/dashboard/shared/StatsCard";
import ProfitChart from "@/components/dashboard/charts/ProfitChart";
import ActiveDayChart from "@/components/dashboard/charts/ActiveDayChart";
import CustomerRateChart from "@/components/dashboard/charts/CustomerRateChart";
import ProductTable from "@/components/dashboard/products/ProductTable";
import AIAssistantCard from "@/components/dashboard/shared/AIAssistantCard";
import DatePickerDropdown from "@/components/dashboard/shared/DatePickerDropdown";
import PeriodDropdown from "@/components/dashboard/shared/PeriodDropdown";
import AddWidgetDropdown from "@/components/dashboard/shared/AddWidgetDropdown";

export default function DashboardPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 1, 1)
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  const datePickerRef = useRef(null);
  const periodRef = useRef(null);
  const widgetRef = useRef(null);

  const formatDateRange = (range) => {
    if (range?.from && range?.to) {
        return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
    }
    return "Select Date Range";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={datePickerRef}>
                <button 
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                    <Icon icon="mingcute:calendar-line" width="16" />
                    <span>{selectedDateRange.from ? format(selectedDateRange.from, "MMM d, yyyy") : "Start"} - {selectedDateRange.to ? format(selectedDateRange.to, "MMM d, yyyy") : "End"}</span>
                </button>
                <DatePickerDropdown
                    isOpen={isDatePickerOpen}
                    onClose={() => setIsDatePickerOpen(false)}
                    anchorRef={datePickerRef}
                    onSelect={setSelectedDateRange}
                />
            </div>

            <div className="relative" ref={periodRef}>
                <button 
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                    onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                >
                    <span>{selectedPeriod}</span>
                    <Icon icon="mingcute:down-line" width="16" />
                </button>
                <PeriodDropdown
                    isOpen={isPeriodOpen}
                    onClose={() => setIsPeriodOpen(false)}
                    anchorRef={periodRef}
                    onSelect={setSelectedPeriod}
                />
            </div>

            <div className="relative" ref={widgetRef}>
                <button 
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                    onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                >
                    <Icon icon="mingcute:add-line" width="16" />
                    <span>Add widget</span>
                </button>
                <AddWidgetDropdown
                    isOpen={isWidgetOpen}
                    onClose={() => setIsWidgetOpen(false)}
                    anchorRef={widgetRef}
                />
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30">
                <Icon icon="mingcute:download-2-line" width="16" />
                <span>Export</span>
            </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Page Views"
          value="16,431"
          change="15.5%"
          changeType="positive"
          period="vs. 14,653 last period"
          icon="mingcute:eye-2-line"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Visitors"
          value="6,225"
          change="8.4%"
          changeType="positive"
          period="vs. 5,732 last period"
          icon="mingcute:user-3-line"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Clicks"
          value="2,832"
          change="10.5%"
          changeType="negative"
          period="vs. 3,294 last period"
          icon="mingcute:cursor-line"
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Orders"
          value="1,224"
          change="4.4%"
          changeType="positive"
          period="vs. 1,186 last period"
          icon="mingcute:shopping-bag-3-line"
          iconColor="text-green-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column (Profit & Products) - Takes 2/3 width */}
        <div className="flex flex-col gap-6 xl:col-span-2">
           <ProfitChart />
           <ProductTable />
        </div>

        {/* Right Column (Charts & AI) - Takes 1/3 width */}
        <div className="flex flex-col gap-6">
            <ActiveDayChart />
            <CustomerRateChart />
            <AIAssistantCard />
        </div>
      </div>
    </div>
  );
}
