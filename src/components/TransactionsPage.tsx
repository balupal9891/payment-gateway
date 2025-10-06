import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  RotateCcw,
  ArrowUpDown,
  Grid3X3,
  Calendar,
  Download,
  ChevronDown,
  Check,
  Filter,
  Receipt,
  Hash,
  User,
  CalendarDays,
  DollarSign,
  CreditCard,
  Building,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';
import baseURL from '../API/baseUrl';
import { useUser } from '../store/slices/userSlice';
import axios from 'axios';


interface Transaction {
  txnId: string;
  amount: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded';
  paymentSource: string;
  fullName: string;
  email: string;
  mobile: string;
  createdAt: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selected: string | null;
  placeholder: string;
  onSelect: (value: string | null) => void;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, placeholder, onSelect, icon, isOpen, onToggle }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 transition-all duration-200 hover:shadow-sm bg-white whitespace-nowrap"
    >
      {icon}
      <span className="truncate">{selected || placeholder}</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && (
      <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 animate-dropdown-open">
        <ul className="py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => {
                  onSelect(option.value === 'all' ? null : option.value);
                  onToggle();
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                  (selected === option.value || (option.value === 'all' && !selected))
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {(selected === option.value || (option.value === 'all' && !selected)) && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Transaction ID');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // API states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('Date');
  const [selectedOrder, setSelectedOrder] = useState<string>('Descending');
  const [dateFilter, setDateFilter] = useState<string>('All Time');
  
  const { user } = useUser();

  // View options state
  const [viewOptions, setViewOptions] = useState({
    txnId: true,
    fullName: true,
    email: true,
    mobile: true,
    amount: true,
    paymentSource: true,
    paymentStatus: true,
    createdAt: true
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (key: string) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!filtersRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Calculate dynamic column widths based on visible columns
  const visibleColumnsCount = Object.values(viewOptions).filter(v => v).length;
  
  const getColumnWidth = (columnType: string) => {
    // Base widths for different screen sizes
    const baseWidths = {
      mobile: {
        txnId: 'w-20',
        fullName: 'w-24', 
        email: 'w-32',
        mobile: 'w-20',
        amount: 'w-20',
        paymentSource: 'w-20',
        paymentStatus: 'w-20',
        createdAt: 'w-24'
      },
      tablet: {
        txnId: 'w-28',
        fullName: 'w-32',
        email: 'w-40', 
        mobile: 'w-24',
        amount: 'w-24',
        paymentSource: 'w-24',
        paymentStatus: 'w-24',
        createdAt: 'w-32'
      },
      desktop: {
        txnId: visibleColumnsCount > 6 ? 'w-32' : 'w-36',
        fullName: visibleColumnsCount > 6 ? 'w-36' : 'w-40',
        email: visibleColumnsCount > 6 ? 'w-44' : 'w-48',
        mobile: visibleColumnsCount > 6 ? 'w-28' : 'w-32',
        amount: visibleColumnsCount > 6 ? 'w-24' : 'w-28',
        paymentSource: visibleColumnsCount > 6 ? 'w-28' : 'w-32',
        paymentStatus: visibleColumnsCount > 6 ? 'w-24' : 'w-28',
        createdAt: visibleColumnsCount > 6 ? 'w-32' : 'w-36'
      }
    };
    
    return `${baseWidths.mobile[columnType as keyof typeof baseWidths.mobile]} sm:${baseWidths.tablet[columnType as keyof typeof baseWidths.tablet]} lg:${baseWidths.desktop[columnType as keyof typeof baseWidths.desktop]}`;
  };

  // Fetch transactions function
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      
      // Determine endpoint based on user role
      if (user?.role?.roleName === 'Super Admin' || user?.role.roleName === 'Admin') {
        endpoint = `${baseURL}/transaction/all`;
      } else if (user?.vendorId) {
        endpoint = `${baseURL}/transaction/vendor/${user.vendorId}`;
      } else {
        throw new Error('User role or vendor ID not found');
      }
      
      // Mock API call - replace with actual axios call
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      
      // Mock data for demo
      if(response?.data){
        setTransactions(response.data.data);
        setLoading(false);
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Dropdown options
  const dropdownOptions = {
    sources: [
      { value: 'all', label: 'All Sources' },
      { value: 'payu', label: 'PayU' },
      { value: 'razorpay', label: 'Razorpay' },
      { value: 'stripe', label: 'Stripe' },
      { value: 'paytm', label: 'Paytm' },
      { value: 'phonepe', label: 'PhonePe' }
    ],
    statuses: [
      { value: 'all', label: 'All Statuses' },
      { value: 'success', label: 'Success' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' }
    ],
    sorts: [
      { value: 'Date', label: 'Date' },
      { value: 'Amount', label: 'Amount' },
      { value: 'Customer', label: 'Customer' }
    ],
    orders: [
      { value: 'Ascending', label: 'Ascending' },
      { value: 'Descending', label: 'Descending' }
    ],
    dates: [
      { value: 'All Time', label: 'All Time' },
      { value: 'Today', label: 'Today' },
      { value: 'Yesterday', label: 'Yesterday' },
      { value: 'Last 7 Days', label: 'Last 7 Days' },
      { value: 'Last 30 Days', label: 'Last 30 Days' },
      { value: 'Custom Range', label: 'Custom Range' }
    ]
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction => {
        const searchValue = searchQuery.toLowerCase();
        switch (selectedFilter) {
          case 'Transaction ID':
            return transaction.txnId.toLowerCase().includes(searchValue);
          case 'Customer Name':
            return transaction.fullName.toLowerCase().includes(searchValue);
          case 'Email':
            return transaction.email.toLowerCase().includes(searchValue);
          case 'Mobile':
            return transaction.mobile.includes(searchValue);
          default:
            return transaction.txnId.toLowerCase().includes(searchValue);
        }
      });
    }
    
    // Apply filters
    if (selectedSource) filtered = filtered.filter(t => t.paymentSource === selectedSource);
    if (selectedStatus) filtered = filtered.filter(t => t.paymentStatus === selectedStatus);
    
    // Apply date filter (simplified for demo)
    const now = new Date();
    const dateFilters = {
      'Today': () => filtered.filter(t => {
        const txnDate = new Date(t.createdAt);
        return txnDate.toDateString() === now.toDateString();
      }),
      'Yesterday': () => filtered.filter(t => {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const txnDate = new Date(t.createdAt);
        return txnDate.toDateString() === yesterday.toDateString();
      }),
      'Last 7 Days': () => filtered.filter(t => {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const txnDate = new Date(t.createdAt);
        return txnDate >= weekAgo;
      }),
      'Last 30 Days': () => filtered.filter(t => {
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        const txnDate = new Date(t.createdAt);
        return txnDate >= monthAgo;
      })
    };
    
    if (dateFilter !== 'All Time' && dateFilters[dateFilter as keyof typeof dateFilters]) {
      filtered = dateFilters[dateFilter as keyof typeof dateFilters]();
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (selectedSort) {
        case 'Date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'Amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        default:
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
      }
      
      return selectedOrder === 'Ascending' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
    
    return filtered;
  }, [transactions, searchQuery, selectedFilter, selectedSource, selectedStatus, selectedSort, selectedOrder, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSource(null);
    setSelectedStatus(null);
    setSelectedSort('Date');
    setSelectedOrder('Descending');
    setDateFilter('All Time');
    setCurrentPage(1);
    fetchTransactions();
  };

  const toggleViewOption = (option: keyof typeof viewOptions) => {
    setViewOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const isFilterActive = searchQuery || selectedSource || selectedStatus || dateFilter !== 'All Time';

  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      'success': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'refunded': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return `px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full border transition-all duration-200 ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Receipt className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          </div>
          <p className="text-gray-600 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Monitor and analyze all transaction activities</span>
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div ref={filtersRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Transaction ID">Transaction ID</option>
                <option value="Customer Name">Customer Name</option>
                <option value="Email">Email</option>
                <option value="Mobile">Mobile</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              disabled={!isFilterActive && !loading}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md border transition-all duration-200 ${(isFilterActive || loading)
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300' 
                : 'text-gray-400 cursor-not-allowed border-gray-200'}`}
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reset</span>
            </button>
          </div>

          {/* Filter Options and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              options={dropdownOptions.sources}
              selected={selectedSource}
              placeholder="All Sources"
              onSelect={(value) => {
                setSelectedSource(value);
                setCurrentPage(1);
              }}
              isOpen={openDropdown === 'source'}
              onToggle={() => toggleDropdown('source')}
            />

            <Dropdown
              options={dropdownOptions.statuses}
              selected={selectedStatus}
              placeholder="All Statuses"
              onSelect={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
              }}
              isOpen={openDropdown === 'status'}
              onToggle={() => toggleDropdown('status')}
            />

            <Dropdown
              options={dropdownOptions.dates}
              selected={dateFilter}
              placeholder="All Time"
              onSelect={(value) => {
                setDateFilter(value || 'All Time');
                setCurrentPage(1);
              }}
              icon={<Calendar className="w-4 h-4" />}
              isOpen={openDropdown === 'date'}
              onToggle={() => toggleDropdown('date')}
            />

            <Dropdown
              options={dropdownOptions.sorts}
              selected={selectedSort}
              placeholder="Sort by"
              onSelect={(value) => setSelectedSort(value || 'Date')}
              icon={<ArrowUpDown className="w-4 h-4" />}
              isOpen={openDropdown === 'sort'}
              onToggle={() => toggleDropdown('sort')}
            />

            <Dropdown
              options={dropdownOptions.orders}
              selected={selectedOrder}
              placeholder="Order"
              onSelect={(value) => setSelectedOrder(value || 'Descending')}
              isOpen={openDropdown === 'order'}
              onToggle={() => toggleDropdown('order')}
            />

            <div className="flex-grow"></div>

            {/* View Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('view')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 bg-white"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>View</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'view' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'view' && (
                <div className="absolute z-50 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 right-0">
                  <div className="p-3">
                    <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Display Columns
                    </h4>
                    <ul className="py-1">
                      {Object.entries(viewOptions).map(([key, value]) => (
                        <li key={key}>
                          <button
                            onClick={() => toggleViewOption(key as keyof typeof viewOptions)}
                            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            <span className="capitalize">
                              {key === 'txnId' ? 'Transaction ID' : 
                               key === 'fullName' ? 'Customer Name' :
                               key === 'paymentSource' ? 'Payment Source' :
                               key === 'paymentStatus' ? 'Status' :
                               key === 'createdAt' ? 'Date & Time' :
                               key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            {value && <Check className="w-4 h-4 text-blue-500" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 bg-white">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button 
              onClick={fetchTransactions}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 bg-white disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {viewOptions.txnId && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('txnId')}`}>
                      <div className="flex items-center space-x-1">
                        <Hash className="w-3 h-3" />
                        <span className="hidden sm:inline">Txn ID</span>
                        <span className="sm:hidden">ID</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.fullName && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('fullName')}`}>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Customer</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.email && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('email')}`}>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.mobile && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('mobile')}`}>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>Mobile</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.amount && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('amount')}`}>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Amount</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.paymentSource && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('paymentSource')}`}>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>Source</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.paymentStatus && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('paymentStatus')}`}>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Status</span>
                      </div>
                    </th>
                  )}
                  {viewOptions.createdAt && (
                    <th className={`px-2 sm:px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${getColumnWidth('createdAt')}`}>
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="w-3 h-3" />
                        <span>Date</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td 
                      colSpan={Object.values(viewOptions).filter(v => v).length} 
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm">Loading transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td 
                      colSpan={Object.values(viewOptions).filter(v => v).length} 
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <svg className="w-12 h-12 mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm mb-2">{error}</p>
                        <button 
                          onClick={fetchTransactions}
                          className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.txnId} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {viewOptions.txnId && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm font-medium text-gray-900">
                          <div className="truncate">{transaction.txnId}</div>
                        </td>
                      )}
                      {viewOptions.fullName && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-900 font-medium">
                          <div className="truncate">{transaction.fullName}</div>
                        </td>
                      )}
                      {viewOptions.email && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-600">
                          <a href={`mailto:${transaction.email}`} className="hover:text-blue-600 transition-colors truncate block">
                            {transaction.email}
                          </a>
                        </td>
                      )}
                      {viewOptions.mobile && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-600">
                          <a href={`tel:${transaction.mobile}`} className="hover:text-blue-600 transition-colors truncate block">
                            {transaction.mobile}
                          </a>
                        </td>
                      )}
                      {viewOptions.amount && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-900 font-semibold">
                          <div className="truncate">{formatAmount(transaction.amount)}</div>
                        </td>
                      )}
                      {viewOptions.paymentSource && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span className="capitalize truncate">{transaction.paymentSource}</span>
                          </div>
                        </td>
                      )}
                      {viewOptions.paymentStatus && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3">
                          <span className={getStatusBadgeClass(transaction.paymentStatus)}>
                            <span className="capitalize">{transaction.paymentStatus}</span>
                          </span>
                        </td>
                      )}
                      {viewOptions.createdAt && (
                        <td className="px-2 sm:px-3 lg:px-4 py-3 text-sm text-gray-600">
                          <div className="truncate">{formatDate(transaction.createdAt)}</div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={Object.values(viewOptions).filter(v => v).length} 
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No transactions found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}
            </span> of{' '}
            <span className="font-medium text-gray-900">{filteredAndSortedTransactions.length}</span> results
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className={`w-10 h-10 rounded-md text-sm font-medium border transition-all duration-200 ${currentPage === pageNum
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropdown-open {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown-open {
          animation: dropdown-open 0.2s ease-out;
        }
        
        /* Ensure table cells don't expand beyond their set widths */
        table {
          table-layout: fixed;
        }
        
        /* Responsive text truncation */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* Better responsive handling for smaller screens */
        @media (max-width: 640px) {
          .w-20 { width: 5rem; }
          .w-24 { width: 6rem; }
          .w-28 { width: 7rem; }
          .w-32 { width: 8rem; }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .sm\\:w-24 { width: 6rem; }
          .sm\\:w-28 { width: 7rem; }
          .sm\\:w-32 { width: 8rem; }
          .sm\\:w-36 { width: 9rem; }
          .sm\\:w-40 { width: 10rem; }
        }
        
        @media (min-width: 1025px) {
          .lg\\:w-24 { width: 6rem; }
          .lg\\:w-28 { width: 7rem; }
          .lg\\:w-32 { width: 8rem; }
          .lg\\:w-36 { width: 9rem; }
          .lg\\:w-40 { width: 10rem; }
          .lg\\:w-44 { width: 11rem; }
          .lg\\:w-48 { width: 12rem; }
        }
      `}</style>
    </div>
  );
};

export default TransactionsPage;