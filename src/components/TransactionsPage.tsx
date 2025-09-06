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
  Eye
} from 'lucide-react';

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
      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 transition-all duration-200 hover:shadow-sm bg-white"
    >
      {icon}
      <span>{selected || placeholder}</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {(selected === option.value || (option.value === 'all' && !selected)) && (
                  <Check className="w-4 h-4 text-teal-500" />
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

  // Dropdown options
  const dropdownOptions = {
    methods: [
      { value: 'all', label: 'All Methods' },
      { value: 'UPI', label: 'UPI' },
      { value: 'Net Banking', label: 'Net Banking' },
      { value: 'Credit Card', label: 'Credit Card' },
      { value: 'Debit Card', label: 'Debit Card' },
      { value: 'Wallet', label: 'Wallet' },
      { value: 'Cash on Delivery', label: 'Cash on Delivery' }
    ],
    gateways: [
      { value: 'all', label: 'All Gateways' },
      { value: 'Razorpay', label: 'Razorpay' },
      { value: 'Paytm', label: 'Paytm' },
      { value: 'Stripe', label: 'Stripe' },
      { value: 'PayPal', label: 'PayPal' },
      { value: 'CCAvenue', label: 'CCAvenue' }
    ],
    statuses: [
      { value: 'all', label: 'All Statuses' },
      { value: 'Success', label: 'Success' },
      { value: 'Failed', label: 'Failed' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Refunded', label: 'Refunded' }
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
        const searchValue = searchQuery.toLowerCase();
        switch (selectedFilter) {
          case 'Receipt ID':
            return transaction.receiptId.toLowerCase().includes(searchValue);
          case 'Transaction ID':
            return transaction.id.toLowerCase().includes(searchValue);
          default:
            return transaction.customer.toLowerCase().includes(searchValue);
        }
      });
    }
    
    // Apply filters
    if (selectedMethod) filtered = filtered.filter(t => t.method === selectedMethod);
    if (selectedGateway) filtered = filtered.filter(t => t.gateway === selectedGateway);
    if (selectedStatus) filtered = filtered.filter(t => t.status === selectedStatus);
    
    // Apply date filter (simplified for demo)
    const dateFilters = {
      'Today': () => filtered.filter(t => t.date.includes('2023-05-15')),
      'Yesterday': () => filtered.filter(t => t.date.includes('2023-05-14')),
      'Last 7 Days': () => filtered.filter(t => 
        ['2023-05-15', '2023-05-14', '2023-05-13', '2023-05-12', '2023-05-11'].some(date => t.date.includes(date))
      )
    };
    
    if (dateFilter !== 'All Time' && dateFilters[dateFilter as keyof typeof dateFilters]) {
      filtered = dateFilters[dateFilter as keyof typeof dateFilters]();
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (selectedSort) {
        case 'Date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'Amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          aValue = a.customer.toLowerCase();
          bValue = b.customer.toLowerCase();
      }
      
      return selectedOrder === 'Ascending' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
    
    return filtered;
  }, [transactions, searchQuery, selectedFilter, selectedMethod, selectedGateway, selectedStatus, selectedSort, selectedOrder, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const toggleViewOption = (option: keyof typeof viewOptions) => {
    setViewOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const isFilterActive = searchQuery || selectedMethod || selectedGateway || selectedStatus || dateFilter !== 'All Time';

  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      'Success': 'bg-green-100 text-green-800 border-green-200',
      'Failed': 'bg-red-100 text-red-800 border-red-200',
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Refunded': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return `px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border transition-all duration-200 ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Receipt className="w-8 h-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        </div>
        <p className="text-gray-600 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Monitor and analyze all transaction activities</span>
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div ref={filtersRef} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8 relative">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Receipt ID">Receipt ID</option>
              <option value="Transaction ID">Transaction ID</option>
              <option value="Customer Email">Customer Email</option>
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            disabled={!isFilterActive}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm rounded-md border transition-all duration-200 ${isFilterActive 
              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300' 
              : 'text-gray-400 cursor-not-allowed border-gray-200'}`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button className="lg:hidden flex items-center space-x-1 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options and Actions */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown
              options={dropdownOptions.methods}
              selected={selectedMethod}
              placeholder="All Methods"
              onSelect={(value) => {
                setSelectedMethod(value);
                setCurrentPage(1);
              }}
              isOpen={openDropdown === 'method'}
              onToggle={() => toggleDropdown('method')}
            />

            <Dropdown
              options={dropdownOptions.gateways}
              selected={selectedGateway}
              placeholder="All Gateways"
              onSelect={(value) => {
                setSelectedGateway(value);
                setCurrentPage(1);
              }}
              isOpen={openDropdown === 'gateway'}
              onToggle={() => toggleDropdown('gateway')}
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

            <div className="flex space-x-2">
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
            </div>

            <div className="flex-grow"></div>

            {/* View Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('view')}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 bg-white"
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
                            className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            {value && <Check className="w-4 h-4 text-teal-500" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 bg-white">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8 h-[80vh] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-grow">

          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0 z-20">
              <tr>
                {viewOptions.receiptId && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4" />
                      <span>Receipt ID</span>
                    </div>
                  </th>
                )}
                {viewOptions.transactionId && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Transaction ID</span>
                    </div>
                  </th>
                )}
                {viewOptions.customer && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Customer</span>
                    </div>
                  </th>
                )}
                {viewOptions.date && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>Date & Time</span>
                    </div>
                  </th>
                )}
                {viewOptions.amount && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Amount</span>
                    </div>
                  </th>
                )}
                {viewOptions.method && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment Method</span>
                    </div>
                  </th>
                )}
                {viewOptions.gateway && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Gateway</span>
                    </div>
                  </th>
                )}
                {viewOptions.status && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Status</span>
                    </div>
                  </th>
                )}
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index !== paginatedTransactions.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {viewOptions.receiptId && (
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {transaction.receiptId}
                      </td>
                    )}
                    {viewOptions.transactionId && (
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {transaction.id}
                      </td>
                    )}
                    {viewOptions.customer && (
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {transaction.customer}
                      </td>
                    )}
                    {viewOptions.date && (
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {transaction.date}
                      </td>
                    )}
                    {viewOptions.amount && (
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold whitespace-nowrap">
                        ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    )}
                    {viewOptions.method && (
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {transaction.method}
                      </td>
                    )}
                    {viewOptions.gateway && (
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {transaction.gateway}
                      </td>
                    )}
                    {viewOptions.status && (
                      <td className="px-6 py-4">
                        <span className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <button className="text-teal-500 hover:text-teal-700 transition-colors duration-200 flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={Object.values(viewOptions).filter(v => v).length + 1} 
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
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}
          </span> of{' '}
          <span className="font-semibold text-gray-900">{filteredAndSortedTransactions.length}</span> results
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
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    ? 'bg-teal-500 text-white border-teal-500 shadow-md'
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
      `}</style>
    </div>
  );
};

export default TransactionsPage;