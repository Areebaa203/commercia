"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-gray-50 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100 cursor-pointer">
              <Icon icon="mingcute:camera-line" className="text-2xl text-white" />
            </div>
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors whitespace-nowrap">
                Change Photo
              </button>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors whitespace-nowrap">
                Remove
              </button>
            </div>
            <p className="text-xs text-gray-500">
              JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="Alex Johnson"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:user-3-line" className="text-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                defaultValue="alex.j@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:mail-line" className="text-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                defaultValue="+1 (555) 000-0000"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:phone-line" className="text-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="Administrator"
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-gray-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mingcute:shield-line" className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
