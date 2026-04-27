"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import SearchPopup from "@/components/dashboard/shared/SearchPopup";
import NotificationDropdown from "@/components/dashboard/shared/NotificationDropdown";
import ProfileDropdown from "@/components/dashboard/shared/ProfileDropdown";
import MessageDropdown from "@/components/dashboard/shared/MessageDropdown";
import LogoutModal from "@/components/dashboard/shared/LogoutModal";
import { useSidebar } from "@/contexts/SidebarContext";
import { createClient } from "@/utils/supabase/client";

const TopBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { toggleMobileSidebar } = useSidebar();

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
        <div className="flex w-full max-w-xl items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Icon icon="mingcute:menu-line" width="24" />
          </button>

          <div
            className="relative w-full cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon icon="mingcute:search-line" width="20" />
            </div>
            <div className="w-full rounded-xl border-none bg-gray-50 py-2.5 pl-10 pr-12 text-sm font-medium text-gray-400 outline-none ring-1 ring-gray-100 hover:bg-gray-100 transition-colors">
              <span className="hidden sm:inline">Search anything...</span>
              <span className="sm:hidden">Search...</span>
            </div>
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-400 shadow-sm ring-1 ring-gray-200">
              <Icon icon="mingcute:command-line" width="12" />
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={messageRef}>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              onClick={() => setIsMessageOpen(!isMessageOpen)}
            >
              <Icon icon="mingcute:message-3-line" width="24" />
            </button>
            <MessageDropdown
              isOpen={isMessageOpen}
              onClose={() => setIsMessageOpen(false)}
              anchorRef={messageRef}
            />
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Icon icon="mingcute:notification-line" width="24" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              anchorRef={notificationRef}
            />
          </div>

          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-3 pl-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.user_metadata?.full_name || user?.user_metadata?.fullName || user?.email || 'Felix'}`}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              anchorRef={profileRef}
              onLogoutClick={() => setIsLogoutModalOpen(true)}
              user={user}
            />
          </div>
        </div>
      </header>

      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
};

export default TopBar;
