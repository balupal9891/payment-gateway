import React, { useState } from 'react';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import ModeToggle from './ModeToggle';
import { Link } from 'react-router-dom';
import { Settings, User, LogOut, Bell, Code, Layers } from "lucide-react";

interface HeaderProps {
  className?: string;
  userInitial?: string;
  userAvatarColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  userInitial = 'b',
  userAvatarColor = 'bg-pink-300'
}) => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <button className="p-2 rounded-full hover:bg-gray-100">
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div onClick={() => setOpen(!open)} className={`w-8 h-8 ${userAvatarColor} rounded-full flex items-center justify-center`}>
            <span className="text-pink-700 font-medium text-sm">{userInitial}</span>
          </div>

          {/* dropdown  */}
          {open && (
            <div className="absolute right-8 top-16 mt-2 w-64 bg-white shadow-lg rounded-xl overflow-hidden border z-50">
              <div className="flex flex-col items-center py-4 border-b">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="mt-2 font-medium">Motif Travels</h3>
              </div>

              <ul className="py-2">
                <li>
                  <Link
                    to='/settings/profile'
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}   // ✅ close dropdown
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit User
                  </Link>
                </li>
                <li>
                  <Link
                    to='/settings/pg'
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}   // ✅ close dropdown
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    PG Manager
                  </Link>
                </li>
                <li>
                  <Link
                  to='/settings/webhooks'
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}   // ✅ close dropdown
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Webhooks
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}   // ✅ close dropdown
                  >
                    <Code className="w-4 h-4 mr-2" />
                    SDK
                  </button>
                </li>
              </ul>

              <div className="border-t">
                <button
                  className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => setOpen(false)}   // ✅ close dropdown
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

























