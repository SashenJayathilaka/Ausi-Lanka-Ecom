"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiFileText,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPlus,
  FiSearch,
  FiTruck,
  FiBox,
  FiDatabase,
  FiLayers,
  FiAward,
  FiBell,
  FiChevronLeft,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

export default function ResponsiveAdminSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close mobile sidebar if resizing to larger screen
      if (window.innerWidth >= 1024 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileSidebarOpen]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const navItems = [
    {
      icon: <FiHome />,
      label: "Home",
      href: "/",
      color: "text-blue-500",
      priority: 1,
    },
    {
      icon: <MdDashboard />,
      label: "Dashboard",
      href: "/admin",
      color: "text-blue-500",
      priority: 1, // High priority for bottom nav
    },
    {
      icon: <FiUsers />,
      label: "Users",
      href: "/admin/users",
      color: "text-purple-500",
      priority: 1,
    },
    {
      icon: <FiShoppingCart />,
      label: "Products",
      href: "/admin/product",
      color: "text-green-500",
      priority: 1,
    },
    {
      icon: <FiBox />,
      label: "Inventory",
      href: "/admin/inventory",
      color: "text-amber-500",
      priority: 2,
    },
    {
      icon: <FiFileText />,
      label: "Orders",
      href: "/admin/orders",
      color: "text-yellow-500",
      priority: 1,
    },
    {
      icon: <FiTruck />,
      label: "Shipments",
      href: "/admin/shipment",
      color: "text-cyan-500",
      priority: 2,
    },
    {
      icon: <FiPieChart />,
      label: "Analytics",
      href: "/admin/analytics",
      color: "text-red-500",
      priority: 3,
    },
    {
      icon: <FiDatabase />,
      label: "Reports",
      href: "/admin/reports",
      color: "text-indigo-500",
      priority: 3,
    },
    {
      icon: <FiAward />,
      label: "Promotions",
      href: "/admin/promotions",
      color: "text-pink-500",
      priority: 3,
    },
    {
      icon: <FiLayers />,
      label: "Categories",
      href: "/admin/categories",
      color: "text-teal-500",
      priority: 3,
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      href: "/admin/settings",
      color: "text-gray-500",
      priority: 2,
    },
  ];

  // Filter nav items based on search query
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get top priority items for bottom nav (max 5)
  const bottomNavItems = [...navItems]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  // Check if current path matches the nav item
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Determine if we should show collapsed sidebar
  const shouldCollapseSidebar = windowWidth < 1280 && windowWidth >= 1024;
  const isMobile = windowWidth < 1024;

  return (
    <>
      {/* Mobile Header (shown only on sm/md screens) */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileSidebarOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <h1 className="text-lg font-bold text-indigo-800">Admin</h1>
            </div>
            <div className="w-8"></div> {/* Spacer for balance */}
          </div>
        </header>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Desktop Sidebar (lg screens) */}
      <aside
        className={`hidden lg:block fixed top-0 h-screen bg-gradient-to-b from-indigo-50 to-white shadow-lg transition-all duration-300 ease-in-out z-20 border-r border-gray-200
          ${shouldCollapseSidebar ? "w-20" : sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            {!shouldCollapseSidebar && sidebarOpen ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <h2 className="text-lg font-bold text-indigo-800">AdminPro</h2>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
            )}

            {!shouldCollapseSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                <FiChevronLeft
                  className={`transition-transform ${!sidebarOpen && "rotate-180"} text-lg`}
                />
              </button>
            )}
          </div>

          {/* Search Bar (visible when expanded) */}
          {!shouldCollapseSidebar && sidebarOpen && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-sm shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {filteredNavItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all 
                      ${shouldCollapseSidebar ? "px-3 justify-center" : sidebarOpen ? "px-4" : "px-3 justify-center"}
                      ${
                        isActive(item.href)
                          ? `bg-indigo-100 text-indigo-700 font-medium ${item.color}`
                          : "text-gray-600 hover:bg-indigo-50 hover:text-gray-900"
                      }`}
                  >
                    <span
                      className={`text-lg ${isActive(item.href) ? item.color : "text-gray-500"}`}
                    >
                      {item.icon}
                    </span>
                    {!shouldCollapseSidebar && sidebarOpen && (
                      <span className="ml-3">{item.label}</span>
                    )}
                    {isActive(item.href) &&
                      !shouldCollapseSidebar &&
                      sidebarOpen && (
                        <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            {/* Notifications (visible when expanded) */}
            {!shouldCollapseSidebar && sidebarOpen && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg flex items-center">
                <div className="relative">
                  <FiBell className="text-indigo-600 text-lg" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-700">
                    3 new notifications
                  </p>
                </div>
              </div>
            )}

            {/* Create Button */}
            <button
              className={`flex items-center w-full p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md
              ${shouldCollapseSidebar ? "px-3 justify-center" : sidebarOpen ? "px-4" : "px-3 justify-center"}`}
            >
              <FiPlus className="text-lg" />
              {!shouldCollapseSidebar && sidebarOpen && (
                <span className="ml-3 font-medium">Create New</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar (sm/md screens) */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full pt-16">
          {" "}
          {/* pt-16 to account for header */}
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {filteredNavItems.length > 0 ? (
                filteredNavItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`flex items-center p-3 px-4 rounded-lg transition-all
                        ${
                          isActive(item.href)
                            ? `bg-indigo-50 text-indigo-700 font-medium ${item.color}`
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span
                        className={`text-xl ${isActive(item.href) ? item.color : "text-gray-500"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.label}</span>
                      {isActive(item.href) && (
                        <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </a>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  No menu items found
                </li>
              )}
            </ul>
          </nav>
          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            {/* Create Button */}
            <button className="flex items-center justify-center w-full p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md">
              <FiPlus className="text-lg" />
              <span className="ml-3 font-medium">Create New</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation for Mobile (sm/md screens) */}
      {isMobile && !mobileSidebarOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-around items-center p-2">
            {bottomNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive(item.href) ? "text-indigo-600" : "text-gray-600"}`}
              >
                <span
                  className={`text-xl ${isActive(item.href) ? item.color : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
