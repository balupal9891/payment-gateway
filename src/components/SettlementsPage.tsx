import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  CalendarIcon,
  CloudArrowDownIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import Layout from './Layout';

const SettlementsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);

  return (
    <Layout>
      {/* Page Title */}
      <div className="mb-6">
        <div className="bg-gray-100 inline-block px-4 py-2 rounded-lg">
          <h1 className="text-lg font-semibold text-gray-700">Settlements</h1>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search settlements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset Button */}
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <FunnelIcon className="w-4 h-4" />
              <span>Status</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <FunnelIcon className="w-4 h-4" />
              <span>Gateway</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <FunnelIcon className="w-4 h-4" />
              <span>Amount</span>
            </button>
          </div>

          {/* Sort and Order Buttons */}
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <ArrowsUpDownIcon className="w-4 h-4" />
              <span>Sort By</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <ArrowsUpDownIcon className="w-4 h-4" />
              <span>Order By</span>
            </button>
          </div>

          {/* View Button */}
          <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
            <Squares2X2Icon className="w-4 h-4" />
            <span>View</span>
          </button>

          {/* Date and Download Buttons */}
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <CalendarIcon className="w-4 h-4" />
              <span>Date</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <CloudArrowDownIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* No Data Found */}
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <DocumentDuplicateIcon className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Settlements Found</h3>
          <p className="text-gray-600">No settlement data is available yet. Settlements will appear here once transactions are processed.</p>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettlementsPage;
