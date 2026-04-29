"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";

const Toggle = ({ label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-blue-600" : "bg-gray-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const NotificationSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [prefs, setPrefs] = useState({
    emailOrders: true,
    emailStock: true,
    emailMarketing: false,
    pushOrders: true,
    pushMessages: true,
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/settings/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          setPrefs(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch notification preferences", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, []);

  const handleToggle = (key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Success",
          description: "Notification preferences saved.",
        });
      } else {
        throw new Error(json.message || "Failed to save preferences");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-32 items-center justify-center">
      <Icon icon="mingcute:loading-fill" className="animate-spin text-2xl text-blue-600" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">Email Notifications</h3>
        <p className="mb-4 text-sm text-gray-500">Manage what emails you receive from us.</p>

        <div className="divide-y divide-gray-100">
          <Toggle
            label="Order Confirmation"
            description="Receive an email when a new order is placed."
            checked={prefs.emailOrders}
            onChange={(v) => handleToggle("emailOrders", v)}
            disabled={saving}
          />
          <Toggle
            label="Low Stock Alert"
            description="Get notified when product stock runs low."
            checked={prefs.emailStock}
            onChange={(v) => handleToggle("emailStock", v)}
            disabled={saving}
          />
          <Toggle
            label="Marketing & Updates"
            description="Receive news about new features and updates."
            checked={prefs.emailMarketing}
            onChange={(v) => handleToggle("emailMarketing", v)}
            disabled={saving}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">Push Notifications</h3>
        <p className="mb-4 text-sm text-gray-500">Manage notifications on your desktop.</p>

        <div className="divide-y divide-gray-100">
          <Toggle
            label="New Orders"
            description="Get a push notification for every new order."
            checked={prefs.pushOrders}
            onChange={(v) => handleToggle("pushOrders", v)}
            disabled={saving}
          />
          <Toggle
            label="New Messages"
            description="Get notified when a customer sends a message."
            checked={prefs.pushMessages}
            onChange={(v) => handleToggle("pushMessages", v)}
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Icon icon="mingcute:loading-fill" className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;