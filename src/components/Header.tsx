import React from 'react';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import ModeToggle from './ModeToggle';

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
          <div className={`w-8 h-8 ${userAvatarColor} rounded-full flex items-center justify-center`}>
            <span className="text-pink-700 font-medium text-sm">{userInitial}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;











