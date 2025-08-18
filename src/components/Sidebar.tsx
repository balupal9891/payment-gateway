import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  LinkIcon, 
  UserGroupIcon, 
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Home' },
    { path: '/transactions', icon: DocumentTextIcon, label: 'Transactions' },
    { path: '/settlements', icon: CurrencyDollarIcon, label: 'Settlements' },
    { path: '/links', icon: LinkIcon, label: 'Links' },
    { path: '/users', icon: UserGroupIcon, label: 'Users' },
    { path: '/payment-gateways', icon: CurrencyDollarIcon, label: 'Payment Gateways' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <div className={`w-64 bg-teal-700 text-white ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold">motifpe</span>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-6 py-3">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              // Check if item has children (nested navigation)
              if (item.children && Array.isArray(item.children)) {
                return (
                  <div key={item.path}>
                    <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      active 
                        ? 'bg-teal-600 text-white' 
                        : 'text-teal-200 hover:bg-teal-600 hover:text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-1 rounded transition-colors ${
                            isActive(child.path)
                              ? 'bg-teal-500 text-white' 
                              : 'text-teal-100 hover:bg-teal-500 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              // Default (no children)
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    active 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-200 hover:bg-teal-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

