import React from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const StatsCard = ({ title, value, change, changeType, period, icon, iconColor }) => {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        <div className={clsx("flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50", iconColor)}>
          <Icon icon={icon} width="20" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs font-medium">
             <span
                className={clsx(
                  "flex items-center gap-0.5 rounded px-1.5 py-0.5",
                  changeType === "positive"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                )}
              >
                <Icon
                  icon={changeType === "positive" ? "mingcute:arrow-up-fill" : "mingcute:arrow-down-fill"}
                  width="12"
                />
                {change}
              </span>
              <span className="text-gray-400">{period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
