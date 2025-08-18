import React, { useState } from 'react';
import Layout from './Layout';
import { PlusIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const NetworkFirewallPage: React.FC = () => {
  const [whitelistedIPs] = useState<any[]>([]);

  const paytringIPs = [
    '13.232.107.40',
    '13.127.63.100',
    '65.1.14.69',
    '3.7.7.221',
    '40.81.249.138',
    '4.186.12.32'
  ];

  const handleAddNewIP = () => {
    // Add your add new IP logic here
    console.log('Adding new IP...');
  };

  const handleCopyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    alert(`IP address ${ip} copied to clipboard!`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
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
                    <span className="text-gray-900 text-sm font-bold">Network Firewall</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FireWall Settings Section (Left Side) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">FireWall Settings</h2>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                Manages the firewall settings for the application. In order to process refunds and payouts, you must add the required IP addresses to the whitelist.
              </p>
              
              {/* WhiteListed IP's Subsection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">WhiteListed IP's</h3>
                  <button
                    onClick={handleAddNewIP}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Ip
                  </button>
                </div>
                
                {/* Empty State or IP List */}
                {whitelistedIPs.length === 0 ? (
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
                        
                        {/* Paper Clip on Top */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <PaperClipIcon className="w-6 h-6 text-gray-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* No Data Found Message */}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Data Found</h4>
                    <p className="text-gray-500 text-base">Please check back later</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {whitelistedIPs.map((ip, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                        <span className="text-gray-900 font-mono">{ip}</span>
                        <button
                          onClick={() => handleCopyIP(ip)}
                          className="p-1 text-gray-400 hover:text-teal-500 transition-colors"
                          title="Copy IP"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paytring IP's Section (Right Side) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">motifpe IP's</h2>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                These are Paytring IP's that you can whitelist to allow secure transactions within your application.
              </p>
              
              {/* IP List */}
              <div className="space-y-3">
                {paytringIPs.map((ip, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="text-gray-900 font-mono">{ip}</span>
                    <button
                      onClick={() => handleCopyIP(ip)}
                      className="p-1 text-gray-400 hover:text-teal-500 transition-colors"
                      title="Copy IP"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NetworkFirewallPage;

