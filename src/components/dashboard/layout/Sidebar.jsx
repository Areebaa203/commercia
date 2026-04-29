"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "mingcute:grid-fill" },
  { name: "Orders", href: "/dashboard/orders", icon: "mingcute:shopping-bag-3-line", badge: 46 },
  { name: "Products", href: "/dashboard/products", icon: "mingcute:box-3-line" },
  { name: "Customers", href: "/dashboard/customers", icon: "mingcute:user-3-line" },
  { name: "Content", href: "/dashboard/content", icon: "mingcute:file-line" },
  { name: "Online Store", href: "/dashboard/store", icon: "mingcute:store-2-line" },
  { name: "Finances", href: "/dashboard/finances", icon: "mingcute:wallet-3-line" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "mingcute:chart-bar-line" },
  { name: "Discounts", href: "/dashboard/discounts", icon: "mingcute:coupon-line" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar();
  
  // Track open state for nav items
  const [openDropdowns, setOpenDropdowns] = useState({ "Online Store": false });
  // Track premium widget visibility
  const [isPremiumOpen, setIsPremiumOpen] = useState(true);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileSidebar}
      />

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-100 bg-white py-6 transition-all duration-300",
          // Mobile styles
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop styles (width based on collapse state)
          isCollapsed ? "lg:w-20 lg:px-2" : "w-64 px-4"
        )}
      >
        <div className={clsx("mb-8 flex items-center shrink-0", isCollapsed ? "lg:justify-center lg:px-0 gap-2 px-2" : "gap-2 px-2")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
            <Icon icon="mingcute:shopping-bag-2-fill" width="20" />
          </div>
          <span className={clsx("text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden", isCollapsed && "lg:hidden")}>
            Furniqo
          </span>
          
          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <Icon icon="mingcute:close-line" width="24" />
          </button>

          {/* Desktop Toggle Button for Collapsed State */}
          {isCollapsed && (
               <button
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-7 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm hover:text-gray-600"
              >
                  <Icon icon="mingcute:right-line" width="12" />
              </button>
          )}
           {/* Original Toggle Button when expanded */}
           {!isCollapsed && (
              <button
                  onClick={toggleSidebar}
                  className="ml-auto hidden text-gray-400 hover:text-gray-600 lg:block"
              >
                   <Icon icon="mingcute:layout-left-line" width="20" />
              </button>
           )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar overflow-x-hidden">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  title={isCollapsed ? item.name : ""}
                  className={clsx(
                    "relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
                    isCollapsed ? "lg:justify-center lg:px-0 px-3" : "px-3",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon icon={item.icon} width="20" className="shrink-0" />
                  <span className={clsx(isCollapsed && "lg:hidden")}>{item.name}</span>
                  {item.badge && (
                    <span className={clsx("ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600", isCollapsed && "lg:hidden")}>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                     <div className="hidden lg:block absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></div>
                  )}
                </Link>
              );
            })}

            <div className="pt-4">
               {/* Additional links can go here */}
            </div>
          </nav>

          <div className="mt-auto space-y-4 pt-4 pb-4">
              <div className="space-y-1">
                   <Link
                      href="/dashboard/settings"
                      onClick={closeMobileSidebar}
                      title={isCollapsed ? "Settings" : ""}
                      className={clsx(
                          "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors",
                          isCollapsed ? "lg:justify-center lg:px-0 px-3" : "px-3",
                          pathname.includes("/dashboard/settings")
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                   >
                      <Icon icon="mingcute:settings-3-line" width="20" className="shrink-0" />
                      <span className={clsx(isCollapsed && "lg:hidden")}>Settings</span>
                   </Link>
                   <Link
                      href="/dashboard/help"
                      onClick={closeMobileSidebar}
                      title={isCollapsed ? "Help & Support" : ""}
                      className={clsx(
                          "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors",
                          isCollapsed ? "lg:justify-center lg:px-0 px-3" : "px-3",
                          pathname === "/dashboard/help"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                   >
                      <Icon icon="mingcute:question-line" width="20" className="shrink-0" />
                      <span className={clsx(isCollapsed && "lg:hidden")}>Help & Support</span>
                   </Link>
              </div>
          </div>
        </div>

        <div className={clsx("shrink-0 pt-4 border-t border-gray-100 relative", isCollapsed ? "lg:px-2 px-4" : "px-4")}>
              {/* Premium Box Toggle Button */}
              {!isCollapsed && (
                <button
                  onClick={() => setIsPremiumOpen(!isPremiumOpen)}
                  className="absolute right-4 -top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm hover:text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                  title={isPremiumOpen ? "Hide Premium Offer" : "Show Premium Offer"}
                >
                  <Icon 
                    icon="mingcute:down-line" 
                    width="14" 
                    className={clsx("transition-transform duration-300", isPremiumOpen ? "" : "-rotate-90")} 
                  />
                </button>
              )}

              <div className={clsx(
                "grid transition-all duration-300 ease-in-out",
                isPremiumOpen || isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className={clsx("relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white", isCollapsed && "lg:hidden")}>
                      <div className="relative z-10">
                          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                              <Icon icon="mingcute:diamond-line" width="20" />
                          </div>
                          <h4 className="mb-1 text-sm font-bold">Upgrade to Premium!</h4>
                          <p className="mb-3 text-xs text-blue-100">Upgrade your account and unlock all of the benefits.</p>
                          <Link 
                              href="/dashboard/upgrade"
                              onClick={closeMobileSidebar}
                              className="block w-full text-center rounded-lg bg-white/20 py-2 text-xs font-semibold text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                          >
                              Upgrade premium
                          </Link>
                      </div>
                      {/* Decorative Circle */}
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl"></div>
                  </div>
                </div>
              </div>
              
              {isCollapsed && (
                  <div className="hidden lg:flex justify-center mt-2">
                      <Link 
                          href="/dashboard/upgrade"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 cursor-pointer" 
                          title="Upgrade to Premium"
                      >
                          <Icon icon="mingcute:diamond-line" width="20" />
                      </Link>
                  </div>
              )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
