"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DuplicateDiscountModal = ({ isOpen, onClose, discount, onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Icon icon="mingcute:copy-2-fill" className="text-3xl" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Duplicate Discount?</h3>
          <p className="text-gray-500">
            Are you sure you want to duplicate <span className="font-semibold text-gray-900">"{discount?.code}"</span>? 
            This will create a new discount with the same settings but a different code suffix.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const newDiscountCode = `${discount.code}COPY${Math.floor(Math.random() * 100)}`;
                const newDiscount = {
                  code: newDiscountCode,
                  type: discount.type,
                  value: discount.value,
                  limitUsage: discount.limit !== "Unlimited",
                  limit: discount.limit !== "Unlimited" ? discount.limit : undefined,
                  hasEndDate: false, // Default copy behavior, requires editing to add expiry typically
                  status: "Active",
                  startDate: new Date().toISOString(),
                  endDate: null,
                };
                
                await axios.post("/api/discounts/add", newDiscount);
                
                onSuccess?.();
                onClose();
              } catch (error) {
                const msg =
                  error.response?.data?.message ||
                  (error.response?.data?.errors &&
                    Object.values(error.response.data.errors).flat().join(" ")) ||
                  error.message ||
                  "Failed to duplicate discount.";
                console.error("Error duplicating discount:", msg);
                setErrorDialog({ open: true, message: "Failed to duplicate discount: " + msg });
              } finally {
                setLoading(false);
              }
            }}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon icon="mingcute:loading-fill" className="animate-spin shrink-0" width="18" />
                Duplicating...
              </>
            ) : (
              "Duplicate"
            )}
          </button>
        </div>
      </div>
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="z-[60]">
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ open: false, message: "" })}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DuplicateDiscountModal;
