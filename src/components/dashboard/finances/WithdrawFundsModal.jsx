"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const WithdrawFundsModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={clsx(
          "absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={clsx(
          "relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Withdraw Funds</h3>
            <p className="text-sm text-gray-500">Available Balance: <span className="font-bold text-gray-900">$12,450.00</span></p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Withdrawal Amount</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">$</span>
                    </div>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 pr-4 text-lg font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                    />
                </div>
                <div className="flex gap-2">
                    {["100", "500", "1000", "Max"].map((val) => (
                        <button 
                            key={val}
                            type="button"
                            onClick={() => setAmount(val === "Max" ? "12450" : val)}
                            className="flex-1 rounded-lg border border-gray-100 bg-gray-50 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-200 transition-colors"
                        >
                            {val === "Max" ? "Max" : `$${val}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Withdraw To</label>
                <div className="space-y-2">
                    <div 
                        onClick={() => setSelectedMethod("bank")}
                        className={clsx(
                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                            selectedMethod === "bank" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20" : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm text-blue-600">
                            <Icon icon="mingcute:bank-card-line" width="20" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">Bank Transfer</p>
                            <p className="text-xs text-gray-500">**** **** **** 4582</p>
                        </div>
                        {selectedMethod === "bank" && <Icon icon="mingcute:check-circle-fill" className="text-blue-500" width="20" />}
                    </div>

                    <div 
                        onClick={() => setSelectedMethod("paypal")}
                        className={clsx(
                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                            selectedMethod === "paypal" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20" : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm text-blue-800">
                            <Icon icon="mingcute:paypal-fill" width="20" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">PayPal</p>
                            <p className="text-xs text-gray-500">user@example.com</p>
                        </div>
                        {selectedMethod === "paypal" && <Icon icon="mingcute:check-circle-fill" className="text-blue-500" width="20" />}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button 
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                    <Icon icon="mingcute:safe-flash-line" width="18" />
                    Confirm Withdrawal
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Icon icon="mingcute:lock-line" width="14" />
                    Secure 256-bit encrypted transaction
                </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawFundsModal;
