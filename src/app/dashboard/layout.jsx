"use client";
import React from "react";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopBar from "@/components/dashboard/layout/TopBar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { clsx } from "clsx";

const DashboardContent = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div
        className={clsx(
          "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300",
          // Mobile: no margin (sidebar is fixed/overlay)
          "ml-0",
          // Desktop: margin based on collapsed state
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <TopBar />
        <main className="w-full grow p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
