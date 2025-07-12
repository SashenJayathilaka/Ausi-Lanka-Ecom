/* eslint-disable @next/next/no-img-element */
"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import {
  FaAddressBook,
  FaBars,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaHome,
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaReceipt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Menu, MenuItem, Sidebar, menuClasses } from "react-pro-sidebar";

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const Item = ({ title, to, icon, selected, setSelected }: ItemProps) => {
  return (
    <MenuItem
      active={selected === title}
      className="text-gray-800 dark:text-gray-200 hover:text-white dark:hover:text-indigo-300"
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link href={to} className="block w-full" />}
    >
      {title}
    </MenuItem>
  );
};

const AppSidebar = () => {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className="h-screen sticky top-0 bg-white dark:bg-gray-900 shadow-md overflow-hidden border-none">
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor="inherit"
        rootStyles={{
          [`.${menuClasses.root}`]: {
            padding: "5px",
            backgroundColor: "inherit",
          },
          [`.${menuClasses.button}`]: {
            "&:hover": {
              backgroundColor: "transparent",
              color: "#a5b4fc",
            },
          },
          [`.${menuClasses.active}`]: {
            color: "#818cf8",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              padding: "5px 35px 5px 20px",
              backgroundColor: "inherit",
            },
          }}
        >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <FaBars /> : undefined}
            className="my-2 text-white dark:text-gray-100"
            component={<div />}
          >
            {!isCollapsed && (
              <div className="flex justify-between items-center ml-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-full hover:bg-indigo-600 dark:hover:bg-gray-700 text-white"
                  >
                    <FaBars />
                  </button>
                </div>
              </div>
            )}
          </MenuItem>

          {!isCollapsed && (
            <div className="mb-6">
              <div className="flex justify-center items-center">
                <img
                  alt="profile-user"
                  className="w-24 h-24 cursor-pointer rounded-full border-4 border-indigo-300 dark:border-indigo-600"
                  src={user?.imageUrl}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  VP Fancy Admin
                </p>
              </div>
            </div>
          )}

          <div className={isCollapsed ? "" : "pl-10"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<FaHome />}
              selected={selected}
              setSelected={setSelected}
            />
            <p className="text-xs mt-4 mb-1 ml-5 text-indigo-900 dark:text-indigo-300">
              Data
            </p>
            <Item
              title="Manage Team"
              to="/team"
              icon={<FaUsers />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contacts Information"
              to="/contacts"
              icon={<FaAddressBook />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<FaReceipt />}
              selected={selected}
              setSelected={setSelected}
            />

            <p className="text-xs mt-4 mb-1 ml-5 text-indigo-900 dark:text-indigo-300">
              Pages
            </p>
            <Item
              title="Profile Form"
              to="/form"
              icon={<FaUser />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<FaCalendarAlt />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<FaQuestionCircle />}
              selected={selected}
              setSelected={setSelected}
            />

            <p className="text-xs mt-4 mb-1 ml-5 text-indigo-900 dark:text-indigo-300">
              Charts
            </p>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<FaChartBar />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<FaChartPie />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<FaChartLine />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<FaMapMarkedAlt />}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
