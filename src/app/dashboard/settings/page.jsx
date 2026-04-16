"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { useSearchParams, useRouter } from "next/navigation";
import GeneralSettings from "@/components/dashboard/settings/GeneralSettings";
import ProfileSettings from "@/components/dashboard/settings/ProfileSettings";
import NotificationSettings from "@/components/dashboard/settings/NotificationSettings";
import BillingSettings from "@/components/dashboard/settings/BillingSettings";
import TeamSettings from "@/components/dashboard/settings/TeamSettings";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/dashboard/settings?tab=${tabId}`);
  };

  const tabs = [
    { id: "general", label: "General", icon: "mingcute:settings-3-line" },
    { id: "profile", label: "Profile", icon: "mingcute:user-3-line" },
    { id: "notifications", label: "Notifications", icon: "mingcute:notification-line" },
    { id: "billing", label: "Billing", icon: "mingcute:card-pay-line" },
    { id: "team", label: "Team", icon: "mingcute:group-line" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "profile":
        return <ProfileSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "billing":
        return <BillingSettings />;
      case "team":
        return <TeamSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store preferences and account settings.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={clsx(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              <Icon icon={tab.icon} className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
