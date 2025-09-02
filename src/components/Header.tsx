import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Settings, User, LogOut, Bell, Code, Layers, ChevronDown } from "lucide-react";
import ModeToggle from "./ModeToggle";
import { useUser } from "../store/slices/userSlice";

interface HeaderProps {
  className?: string;
  userInitial?: string;
  userAvatarColor?: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  className = "",
  userAvatarColor = "bg-gradient-to-r from-indigo-500 to-purple-600",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { logout, user } = useUser();

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm px-6 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            MotifPe
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <ModeToggle />
          
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-sm relative">
            <BellIcon className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Avatar with dropdown */}
          <div className="flex items-center space-x-2">
            <div
              onClick={() => setOpen(!open)}
              className={`w-10 h-10 ${userAvatarColor} rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:shadow-lg`}
            >
              <span className="text-white font-semibold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 cursor-pointer transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              onClick={() => setOpen(!open)}
            />
          </div>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            {/* User Info */}
            <div className="flex flex-col items-center py-5 px-4 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2 border-white shadow-md">
                <div className={`w-14 h-14 ${userAvatarColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-lg uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500 mt-1">{user?.email || 'user@example.com'}</p>
            </div>

            {/* Menu Items */}
            <ul className="py-2">
              <li>
                <Link
                  to="/settings/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 text-indigo-500" /> 
                  <span>Edit Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings/pg"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                  onClick={() => setOpen(false)}
                >
                  <Layers className="w-4 h-4 mr-3 text-indigo-500" /> 
                  <span>PG Manager</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings/webhooks"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                  onClick={() => setOpen(false)}
                >
                  <Bell className="w-4 h-4 mr-3 text-indigo-500" /> 
                  <span>Webhooks</span>
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                  onClick={() => setOpen(false)}
                >
                  <Code className="w-4 h-4 mr-3 text-indigo-500" /> 
                  <span>SDK & API</span>
                </button>
              </li>
            </ul>

            {/* Logout */}
            <div className="border-t border-gray-100">
              <Link
                to='/login'
                className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}

              >
                <LogOut className="w-4 h-4 mr-2" /> 
                <span>Sign out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;