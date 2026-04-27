"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ContentActionDropdown = ({ content, viewMode, onView, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={clsx(
            "flex items-center justify-center transition-colors focus:outline-none",
            viewMode === "grid"
              ? "h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm hover:bg-white"
              : "h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-900"
          )}
        >
          <Icon icon="mingcute:more-2-fill" className={viewMode === "grid" ? "text-lg" : "text-xl"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50 rounded-xl bg-white shadow-lg ring-1 ring-gray-100 p-1">
        <DropdownMenuItem 
          onClick={() => onView && onView(content)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-900 focus:text-gray-900 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:eye-2-line" className="text-lg" />
          Preview
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => onEdit && onEdit(content)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-900 focus:text-gray-900 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:edit-2-line" className="text-lg" />
          Edit Content
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
        
        <DropdownMenuItem 
          onClick={() => onDelete && onDelete(content)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:delete-2-line" className="text-lg" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContentActionDropdown;
