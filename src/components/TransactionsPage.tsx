import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  CalendarIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
  CheckIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('Date');
  const [selectedOrder, setSelectedOrder] = useState<string>('Descending');
  const [dateFilter, setDateFilter] = useState<string>('All Time');

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

  // Single open dropdown key and outside click handling
  const [openDropdown, setOpenDropdown] = useState<
    null | 'method' | 'gateway' | 'status' | 'date' | 'sort' | 'order' | 'view'
  >(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (key: NonNullable<typeof openDropdown>) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!filtersRef.current) return;
      if (!filtersRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Options for dropdowns
  const paymentMethods = ['All Methods', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet', 'Cash on Delivery'];
  const gateways = ['All Gateways', 'Razorpay', 'Paytm', 'Stripe', 'PayPal', 'CCAvenue'];
  const statuses = ['All Statuses', 'Success', 'Failed', 'Pending', 'Refunded'];
  const sortOptions = ['Date', 'Amount', 'Customer'];
  const orderOptions = ['Ascending', 'Descending'];
  const dateOptions = ['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

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
    {
      id: 'txn_6',
      receiptId: 'rcpt_12350',
      customer: 'emily.davis@example.com',
      date: '2023-05-12 12:30',
      amount: 750.00,
      method: 'UPI',
      gateway: 'Razorpay',
      status: 'Success'
    },
    {
      id: 'txn_7',
      receiptId: 'rcpt_12351',
      customer: 'david.wilson@example.com',
      date: '2023-05-11 15:45',
      amount: 2100.00,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'Success'
    },
  ];

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction => {
        if (selectedFilter === 'Receipt ID') {
          return transaction.receiptId.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (selectedFilter === 'Transaction ID') {
          return transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          return transaction.customer.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }
    
    // Apply method filter
    if (selectedMethod && selectedMethod !== 'All Methods') {
      filtered = filtered.filter(transaction => transaction.method === selectedMethod);
    }
    
    // Apply gateway filter
    if (selectedGateway && selectedGateway !== 'All Gateways') {
      filtered = filtered.filter(transaction => transaction.gateway === selectedGateway);
    }
    
    // Apply status filter
    if (selectedStatus && selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }
    
    // Apply date filter (simplified for demo)
    if (dateFilter === 'Today') {
      filtered = filtered.filter(transaction => transaction.date.includes('2023-05-15'));
    } else if (dateFilter === 'Yesterday') {
      filtered = filtered.filter(transaction => transaction.date.includes('2023-05-14'));
    } else if (dateFilter === 'Last 7 Days') {
      // This would be more complex with actual date logic
      filtered = filtered.filter(transaction => 
        transaction.date.includes('2023-05-15') || 
        transaction.date.includes('2023-05-14') ||
        transaction.date.includes('2023-05-13') ||
        transaction.date.includes('2023-05-12') ||
        transaction.date.includes('2023-05-11')
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (selectedSort === 'Date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else if (selectedSort === 'Amount') {
        aValue = a.amount;
        bValue = b.amount;
      } else {
        aValue = a.customer.toLowerCase();
        bValue = b.customer.toLowerCase();
      }
      
      if (selectedOrder === 'Ascending') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [
    transactions, 
    searchQuery, 
    selectedFilter, 
    selectedMethod, 
    selectedGateway, 
    selectedStatus, 
    selectedSort, 
    selectedOrder,
    dateFilter
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMethod(null);
    setSelectedGateway(null);
    setSelectedStatus(null);
    setSelectedSort('Date');
    setSelectedOrder('Descending');
    setDateFilter('All Time');
    setCurrentPage(1);
  };

  // Toggle view option
  const toggleViewOption = (option: keyof typeof viewOptions) => {
    setViewOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Check if any filters are active
  const isFilterActive = searchQuery || 
    (selectedMethod && selectedMethod !== 'All Methods') || 
    (selectedGateway && selectedGateway !== 'All Gateways') || 
    (selectedStatus && selectedStatus !== 'All Statuses') ||
    dateFilter !== 'All Time';

  return (
    <>
      {/* Page Title and Stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and review all transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'Success').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'Failed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div ref={filtersRef} className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                placeholder={`Search by ${selectedFilter}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            disabled={!isFilterActive}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md ${isFilterActive 
              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
              : 'text-gray-400 cursor-not-allowed'}`}
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* Filter Button (Mobile) */}
          <button className="lg:hidden flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300">
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Active Filters */}
        {isFilterActive && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">Active filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {selectedFilter}: {searchQuery}
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedMethod && selectedMethod !== 'All Methods' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Method: {selectedMethod}
                <button 
                  onClick={() => setSelectedMethod(null)}
                  className="ml-1 text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedGateway && selectedGateway !== 'All Gateways' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Gateway: {selectedGateway}
                <button 
                  onClick={() => setSelectedGateway(null)}
                  className="ml-1 text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedStatus && selectedStatus !== 'All Statuses' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Status: {selectedStatus}
                <button 
                  onClick={() => setSelectedStatus(null)}
                  className="ml-1 text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {dateFilter !== 'All Time' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Date: {dateFilter}
                <button 
                  onClick={() => setDateFilter('All Time')}
                  className="ml-1 text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Filter Options and Actions (merged into one box) */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Method Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('method')}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedMethod || 'All Methods'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {openDropdown === 'method' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {paymentMethods.map((method) => (
                      <li key={method}>
                        <button
                          onClick={() => {
                            setSelectedMethod(method === 'All Methods' ? null : method);
                            setOpenDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedMethod === method || (method === 'All Methods' && !selectedMethod))
                            ? 'bg-teal-50 text-teal-700'
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
                onClick={() => toggleDropdown('gateway')}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedGateway || 'All Gateways'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {openDropdown === 'gateway' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {gateways.map((gateway) => (
                      <li key={gateway}>
                        <button
                          onClick={() => {
                            setSelectedGateway(gateway === 'All Gateways' ? null : gateway);
                            setOpenDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedGateway === gateway || (gateway === 'All Gateways' && !selectedGateway))
                            ? 'bg-teal-50 text-teal-700'
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
                onClick={() => toggleDropdown('status')}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <span>{selectedStatus || 'All Statuses'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {openDropdown === 'status' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {statuses.map((status) => (
                      <li key={status}>
                        <button
                          onClick={() => {
                            setSelectedStatus(status === 'All Statuses' ? null : status);
                            setOpenDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${(selectedStatus === status || (status === 'All Statuses' && !selectedStatus))
                            ? 'bg-teal-50 text-teal-700'
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

            {/* Date Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('date')}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{dateFilter}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {openDropdown === 'date' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 right-0">
                  <ul className="py-1">
                    {dateOptions.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => {
                            setDateFilter(option);
                            setOpenDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${dateFilter === option
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {option}
                          {dateFilter === option && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sort and Order */}
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('sort')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
                >
                  <ArrowsUpDownIcon className="w-4 h-4" />
                  <span>{selectedSort}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {openDropdown === 'sort' && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="py-1">
                      {sortOptions.map((option) => (
                        <li key={option}>
                          <button
                            onClick={() => {
                              setSelectedSort(option);
                              setOpenDropdown(null);
                            }}
                            className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${selectedSort === option
                              ? 'bg-teal-50 text-teal-700'
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

              <div className="relative">
                <button
                  onClick={() => toggleDropdown('order')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
                >
                  <ArrowsUpDownIcon className="w-4 h-4" />
                  <span>{selectedOrder}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {openDropdown === 'order' && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="py-1">
                      {orderOptions.map((option) => (
                        <li key={option}>
                          <button
                            onClick={() => {
                              setSelectedOrder(option);
                              setOpenDropdown(null);
                            }}
                            className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${selectedOrder === option
                              ? 'bg-teal-50 text-teal-700'
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

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* View Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('view')}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span>View</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {openDropdown === 'view' && (
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
                            {value && <CheckIcon className="w-4 h-4 text-teal-500" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300">
              <CloudArrowDownIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {viewOptions.receiptId && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt ID
                  </th>
                )}
                {viewOptions.transactionId && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                )}
                {viewOptions.customer && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                )}
                {viewOptions.date && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                )}
                {viewOptions.amount && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                )}
                {viewOptions.method && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                )}
                {viewOptions.gateway && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gateway
                  </th>
                )}
                {viewOptions.status && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    {viewOptions.receiptId && (
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {transaction.receiptId}
                      </td>
                    )}
                    {viewOptions.transactionId && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.id}
                      </td>
                    )}
                    {viewOptions.customer && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.customer}
                      </td>
                    )}
                    {viewOptions.date && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.date}
                      </td>
                    )}
                    {viewOptions.amount && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        ₹{transaction.amount.toFixed(2)}
                      </td>
                    )}
                    {viewOptions.method && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.method}
                      </td>
                    )}
                    {viewOptions.gateway && (
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.gateway}
                      </td>
                    )}
                    {viewOptions.status && (
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                          }`}>
                          {transaction.status}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">More</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={
                      Object.values(viewOptions).filter(v => v).length + 1
                    } 
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}
          </span> of{' '}
          <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm ${currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-md text-sm text-gray-600 hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </>
  );
};

export default TransactionsPage;