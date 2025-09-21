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
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMobile}
            className={`flex items-center px-3 py-3 rounded-lg transition-colors duration-200 relative group
              ${collapsed ? "justify-center" : "justify-start space-x-3"}
              ${active 
                ? "bg-teal-500 text-white shadow-lg" 
                : "text-teal-100 hover:bg-teal-500 hover:text-white hover:shadow-md"}`}
            title={collapsed ? item.label : ""}
          >
            <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {item.label}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex h-screen bg-gradient-to-b from-teal-700 to-teal-800 text-white flex-col transition-all duration-300 relative flex-shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        } ${className}`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10 hover:scale-105"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Logo / Branding */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} border-b border-teal-600`}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-teal-500 font-bold text-lg">M</span>
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-xl font-bold">motifpe</span>
              <p className="text-teal-200 text-xs mt-1">Payment Dashboard</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <NavLinks collapsed={isCollapsed} />
        </div>

        {/* User Profile Section (if not collapsed) */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-teal-600">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-600/50">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-teal-200 truncate">
                  {user.role?.roleName || 'Vendor'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div 
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-teal-700 to-teal-800 text-white transition-transform duration-300 shadow-2xl ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8 mt-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-teal-500 font-bold text-xl">M</span>
              </div>
              <div>
                <span className="text-xl font-bold">motifpe</span>
                <p className="text-teal-200 text-sm mt-1">Payment Dashboard</p>
              </div>
            </div>
            <NavLinks collapsed={false} closeMobile={() => setIsMobileMenuOpen(false)} />
            
            {/* Mobile User Profile */}
            {user && (
              <div className="mt-8 p-4 bg-teal-600/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-sm text-teal-200">
                      {user.role?.roleName || 'Vendor'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;