"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const ThemePreviewCard = ({ theme, isActive, onActivate, onCustomize }) => {
  return (
    <div className={clsx(
        "group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md",
        isActive ? "ring-2 ring-blue-500 shadow-md" : ""
    )}>
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
        <img 
            src={theme.thumbnail} 
            alt={theme.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {isActive && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                Active Theme
            </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <button 
                onClick={() => onCustomize(theme)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
                Customize
            </button>
            {!isActive && (
                <button 
                    onClick={() => onActivate(theme)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Activate
                </button>
            )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-gray-900">{theme.name}</h3>
            <span className="text-xs font-medium text-gray-500">{theme.version}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{theme.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>By {theme.author}</span>
            <span>•</span>
            <span>Last updated {theme.updatedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewCard;
