import React from "react";
import { Icon } from "@iconify/react";

const AIAssistantCard = () => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">AI Assistant</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Icon icon="mingcute:fullscreen-line" width="20" />
        </button>
      </div>
      
      <div className="flex h-[200px] flex-col items-center justify-center gap-4">
        {/* Animated AI Sphere */}
        <div className="relative flex h-20 w-20 items-center justify-center">
             <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20"></div>
             <div className="absolute inset-2 animate-pulse rounded-full bg-blue-500/30"></div>
             <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/50"></div>
        </div>
      </div>

      <div className="relative mt-auto">
        <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full rounded-full bg-gray-50 py-3 pl-10 pr-12 text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 outline-none"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
             <Icon icon="mingcute:ai-fill" width="18" />
        </div>
        <button className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">
             <Icon icon="mingcute:arrow-up-line" width="18" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantCard;
