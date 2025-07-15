"use client";

import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiFileText,
  FiShoppingCart,
  FiMenu,
  FiChevronLeft,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const navItems = [
    {
      icon: <FiHome className="text-blue-500" />,
      label: "Dashboard",
      href: "#",
    },
    {
      icon: <FiUsers className="text-purple-500" />,
      label: "Users",
      href: "/admin/users",
    },
    {
      icon: <FiShoppingCart className="text-green-500" />,
      label: "Products",
      href: "/admin/product",
    },
    {
      icon: <FiFileText className="text-yellow-500" />,
      label: "Orders",
      href: "/admin/orders",
    },
    {
      icon: <FiPieChart className="text-red-500" />,
      label: "Analytics",
      href: "#",
    },
    {
      icon: <FiSettings className="text-indigo-500" />,
      label: "Settings",
      href: "#",
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ease-in-out z-10 border-r border-gray-100 mt-16
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Search Bar (visible when expanded) */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>
            </div>
          )}

          {/* Collapse Button */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-700">Admin</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <FiChevronLeft
                className={`transition-transform ${!sidebarOpen && "rotate-180"}`}
              />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setActiveItem(item.label)}
                    className={`flex items-center p-3 rounded-lg transition-all ${sidebarOpen ? "px-4" : "px-3 justify-center"}
                      ${activeItem === item.label ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Create Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              className={`flex items-center w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors
              ${sidebarOpen ? "px-4" : "px-3 justify-center"}`}
            >
              <FiPlus className="text-lg" />
              {sidebarOpen && (
                <span className="ml-3 font-medium">Create New</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-16 h-[calc(100vh-4rem)] bg-white shadow-xl transition-all duration-300 ease-in-out z-20
          ${mobileSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Admin Panel</h2>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.label);
                      toggleMobileSidebar();
                    }}
                    className={`flex items-center p-3 px-4 rounded-lg transition-all
                      ${activeItem === item.label ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="ml-3 font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center w-full p-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <FiPlus className="text-lg" />
              <span className="ml-3 font-medium">Create New</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle button */}
      <div className="fixed top-20 left-4 z-10 lg:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-50"
        >
          <FiMenu className="text-lg" />
        </button>
      </div>
    </>
  );
}
