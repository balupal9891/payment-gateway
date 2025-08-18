import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  userInitial?: string;
  userAvatarColor?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userInitial = 'b',
  userAvatarColor = 'bg-pink-300'
}) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userInitial={userInitial} userAvatarColor={userAvatarColor} />
        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;




