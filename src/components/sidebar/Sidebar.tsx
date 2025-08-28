import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  LinkIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../store/slices/userSlice";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  console.log(user)

  // Role-based nav items
  const role = user?.role?.roleName || "Vendor";
  let navItems = [];

  if(role == "Super Admin" || role == "Admin"){
     navItems = [
      { path: "/dashboard", icon: HomeIcon, label: "Home" },
      { path: "/transactions", icon: DocumentTextIcon, label: "Transactions" },
      { path: "/settlements", icon: CurrencyDollarIcon, label: "Settlements" },
      // { path: "/links", icon: LinkIcon, label: "Links" },
      { path: "/admin/vendors", icon: UserGroupIcon, label: "Vendors" },
      { path: "/payment-gateways", icon: CurrencyDollarIcon, label: "Payment Gateways" },
      // { path: "/settings", icon: Cog6ToothIcon, label: "Settings" },
    ]
  }
  else{
    navItems = [
      { path: "/dashboard", icon: HomeIcon, label: "Home" },
      { path: "/transactions", icon: DocumentTextIcon, label: "Transactions" },
      { path: "/settlements", icon: CurrencyDollarIcon, label: "Settlements" },
      { path: "/links", icon: LinkIcon, label: "Links" },
      { path: "/users", icon: UserGroupIcon, label: "Users" },
      { path: "/settings", icon: Cog6ToothIcon, label: "Settings" },
    ]
  }

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const NavLinks = ({ collapsed, closeMobile }: { collapsed: boolean; closeMobile?: () => void }) => (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMobile}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors relative group
              ${collapsed ? "justify-center" : "justify-start space-x-3"}
              ${active ? "bg-teal-600 text-white" : "text-teal-200 hover:bg-teal-600 hover:text-white"}`}
            title={collapsed ? item.label : ""}
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span>{item.label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-all whitespace-nowrap">
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex h-screen bg-teal-700 text-white flex-col transition-all duration-300 relative ${
          isCollapsed ? "w-16" : "w-64"
        } ${className}`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Logo / Branding */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">M</span>
          </div>
          {!isCollapsed && <span className="text-xl font-bold">motifpe</span>}
        </div>

        {/* Navigation */}
        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <NavLinks collapsed={isCollapsed} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-teal-700 text-white p-4 transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center space-x-3 mb-6 mt-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">motifpe</span>
          </div>
          <NavLinks collapsed={false} closeMobile={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
