import React, { useState } from 'react';
import Layout from './Layout';
import { PlusIcon } from '@heroicons/react/24/outline';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleCreateNotification = () => {
    // Add your create notification logic here
    console.log('Creating new notification...');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/dashboard" className="text-gray-700 hover:text-teal-500 text-sm font-medium">
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <a href="/settings" className="text-gray-700 hover:text-teal-500 text-sm font-medium">
                      Settings
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-900 text-sm font-bold">Notifications</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600 text-lg">
                  Add Email IDs to get notified for every action happening on your dashboard, manage who can receive certain notifications
                </p>
              </div>
              <button
                onClick={handleCreateNotification}
                className="inline-flex items-center px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                + Create Notification
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                {/* No Data Found Illustration */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {/* First Clipboard */}
                    <div className="w-24 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 relative">
                      <div className="absolute top-2 left-2 right-2 h-1 bg-gray-400 rounded"></div>
                      <div className="absolute top-6 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-8 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-10 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-12 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-14 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-16 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-18 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-20 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-22 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-24 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-26 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-28 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                    </div>
                    
                    {/* Second Clipboard (overlapping) */}
                    <div className="absolute -top-2 -right-2 w-24 h-32 bg-gray-100 rounded-lg border-2 border-gray-300 transform rotate-6">
                      <div className="absolute top-2 left-2 right-2 h-1 bg-gray-400 rounded"></div>
                      <div className="absolute top-6 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-8 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-10 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-12 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-14 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-16 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-18 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-20 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-22 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-24 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-26 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="absolute top-28 left-3 right-3 h-0.5 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* No Data Found Message */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h2>
                <p className="text-gray-500 text-lg">Please check back later</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* This would show the list of notifications when they exist */}
                {notifications.map((notification, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    {/* Notification item content would go here */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;

