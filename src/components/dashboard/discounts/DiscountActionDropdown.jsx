"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DiscountActionDropdown = ({ onEdit, onDelete, onDuplicate, onDeactivate }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none">
          <Icon icon="mingcute:more-2-fill" className="text-xl" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50 rounded-xl bg-white shadow-lg ring-1 ring-gray-100 p-1">
        <DropdownMenuItem 
          onClick={onEdit} 
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-900 focus:text-gray-900 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:edit-2-line" className="text-lg" />
          Edit Discount
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onDuplicate} 
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-900 focus:text-gray-900 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:copy-2-line" className="text-lg" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={onDeactivate} 
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-900 focus:text-gray-900 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:close-circle-line" className="text-lg" />
          Deactivate
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
        
        <DropdownMenuItem 
          onClick={onDelete} 
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer text-left focus:outline-none"
        >
          <Icon icon="mingcute:delete-2-line" className="text-lg" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DiscountActionDropdown;
