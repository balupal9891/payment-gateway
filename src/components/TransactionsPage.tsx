import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  CalendarIcon,
  CloudArrowDownIcon,
  
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Layout from './Layout';

interface Transaction {
  id: string;
  receiptId: string;
  customer: string;
  date: string;
  amount: number;
  method: string;
  gateway: string;
  status: 'Success' | 'Failed' | 'Pending' | 'Refunded';
}

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Receipt ID');
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter states
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // View options state
  const [viewOptions, setViewOptions] = useState({
    receiptId: true,
    transactionId: true,
    customer: true,
    date: true,
    amount: true,
    method: true,
    gateway: true,
    status: true
  });

  // Dropdown visibility states
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showGatewayDropdown, setShowGatewayDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Options for dropdowns
  const paymentMethods = ['All Methods', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet', 'Cash on Delivery'];
  const gateways = ['All Gateways', 'Razorpay', 'Paytm', 'Stripe', 'PayPal', 'CCAvenue'];
  const statuses = ['All Statuses', 'Success', 'Failed', 'Pending', 'Refunded'];
  const sortOptions = ['Date', 'Amount', 'Customer'];
  const orderOptions = ['Ascending', 'Descending'];
  const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 'txn_1',
      receiptId: 'rcpt_12345',
      customer: 'john.doe@example.com',
      date: '2023-05-15 10:30',
      amount: 1250.00,
      method: 'Credit Card',
      gateway: 'Razorpay',
      status: 'Success'
    },
    {
      id: 'txn_2',
      receiptId: 'rcpt_12346',
      customer: 'jane.smith@example.com',
      date: '2023-05-15 11:45',
      amount: 899.00,
      method: 'UPI',
      gateway: 'Paytm',
      status: 'Success'
    },
    {
      id: 'txn_3',
      receiptId: 'rcpt_12347',
      customer: 'robert.johnson@example.com',
      date: '2023-05-14 09:15',
      amount: 2450.00,
      method: 'Net Banking',
      gateway: 'CCAvenue',
      status: 'Pending'
    },
    {
      id: 'txn_4',
      receiptId: 'rcpt_12348',
      customer: 'sarah.williams@example.com',
      date: '2023-05-14 14:20',
      amount: 599.00,
      method: 'Debit Card',
      gateway: 'Stripe',
      status: 'Failed'
    },
    {
      id: 'txn_5',
      receiptId: 'rcpt_12349',
      customer: 'michael.brown@example.com',
      date: '2023-05-13 16:50',
      amount: 1299.00,
      method: 'Wallet',
      gateway: 'Paytm',
      status: 'Refunded'
    },
  ];

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMethod(null);
    setSelectedGateway(null);
    setSelectedStatus(null);
    setSelectedSort(null);
    setSelectedOrder(null);
  };

  // Toggle view option
  const toggleViewOption = (option: keyof typeof viewOptions) => {
    setViewOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <Layout>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Receipt ID">Receipt ID</option>
              <option value="Transaction ID">Transaction ID</option>
              <option value="Customer Email">Customer Email</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by ${selectedFilter} ..`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* Filter Dropdowns */}
          <div className="flex space-x-2">
            {/* Method Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedMethod || 'Method'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showMethodDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {paymentMethods.map((method) => (
                      <li key={method}>
                        <button
                          onClick={() => {
                            setSelectedMethod(method === 'All Methods' ? null : method);
                            setShowMethodDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedMethod === method || (method === 'All Methods' && !selectedMethod))
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {method}
                          {(selectedMethod === method || (method === 'All Methods' && !selectedMethod)) && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gateway Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowGatewayDropdown(!showGatewayDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedGateway || 'Gateway'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showGatewayDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {gateways.map((gateway) => (
                      <li key={gateway}>
                        <button
                          onClick={() => {
                            setSelectedGateway(gateway === 'All Gateways' ? null : gateway);
                            setShowGatewayDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedGateway === gateway || (gateway === 'All Gateways' && !selectedGateway))
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {gateway}
                          {(selectedGateway === gateway || (gateway === 'All Gateways' && !selectedGateway)) && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedStatus || 'Status'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showStatusDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {statuses.map((status) => (
                      <li key={status}>
                        <button
                          onClick={() => {
                            setSelectedStatus(status === 'All Statuses' ? null : status);
                            setShowStatusDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedStatus === status || (status === 'All Statuses' && !selectedStatus))
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {status}
                          {(selectedStatus === status || (status === 'All Statuses' && !selectedStatus)) && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sort and Order Dropdowns */}
          <div className="flex space-x-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <ArrowsUpDownIcon className="w-4 h-4" />
                <span>{selectedSort || 'Sort By'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showSortDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {sortOptions.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => {
                            setSelectedSort(option);
                            setShowSortDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${selectedSort === option
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {option}
                          {selectedSort === option && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Order Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowOrderDropdown(!showOrderDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <ArrowsUpDownIcon className="w-4 h-4" />
                <span>{selectedOrder || 'Order By'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showOrderDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {orderOptions.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => {
                            setSelectedOrder(option);
                            setShowOrderDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${selectedOrder === option
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {option}
                          {selectedOrder === option && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
            >
              <Squares2X2Icon className="w-4 h-4" />
              <span>View</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showViewDropdown && (
              <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 right-0">
                <div className="p-2">
                  <h4 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Display Columns
                  </h4>
                  <ul className="py-1">
                    {Object.entries(viewOptions).map(([key, value]) => (
                      <li key={key}>
                        <button
                          onClick={() => toggleViewOption(key as keyof typeof viewOptions)}
                          className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {key.split(/(?=[A-Z])/).join(' ')}
                          {value && <CheckIcon className="w-4 h-4 text-blue-500" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Date and Download Buttons */}
          <div className="flex space-x-2">
            {/* Date Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Date</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {showDateDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 right-0">
                  <ul className="py-1">
                    {dateOptions.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => setShowDateDropdown(false)}
                          className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
              <CloudArrowDownIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
        <div className="max-w-full">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {viewOptions.receiptId && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                    Receipt ID
                  </th>
                )}
                {viewOptions.transactionId && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                    Transaction ID
                  </th>
                )}
                {viewOptions.customer && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">
                    Customer
                  </th>
                )}
                {viewOptions.date && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                    Date
                  </th>
                )}
                {viewOptions.amount && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                    Amount
                  </th>
                )}
                {viewOptions.method && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Method
                  </th>
                )}
                {viewOptions.gateway && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Gateway
                  </th>
                )}
                {viewOptions.status && (
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[6%]">
                    Status
                  </th>
                )}
                <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[6%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  {viewOptions.receiptId && (
                    <td className="px-2 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words">
                      {transaction.receiptId}
                    </td>
                  )}
                  {viewOptions.transactionId && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-words">
                      {transaction.id}
                    </td>
                  )}
                  {viewOptions.customer && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-all">
                      {transaction.customer}
                    </td>
                  )}
                  {viewOptions.date && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-words">
                      {transaction.date}
                    </td>
                  )}
                  {viewOptions.amount && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-words">
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                  )}
                  {viewOptions.method && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-words">
                      {transaction.method}
                    </td>
                  )}
                  {viewOptions.gateway && (
                    <td className="px-2 py-3 text-sm text-gray-500 whitespace-normal break-words">
                      {transaction.gateway}
                    </td>
                  )}
                  {viewOptions.status && (
                    <td className="px-2 py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Failed' ? 'bg-red-100 text-red-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                  )}
                  <td className="px-3 py-3 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">More</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{transactions.length}</span> of{' '}
          <span className="font-medium">{transactions.length}</span> results
        </div>
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
            <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
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

export default TransactionsPage;