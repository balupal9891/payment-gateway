import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  ListBulletIcon,
  Squares2X2Icon,
  PlusIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Types
type PaymentGateway = {
  id: number;
  name: string;
  shortName: string;
  identifier: string;
  status: 'active' | 'inactive' | 'maintenance';
  isDefault: boolean;
  logo: string;
  type: string;
  pool: string;
  lastUpdated: string;
};

type ViewMode = 'cards' | 'list';

const PGManagerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPgPool, setSelectedPgPool] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dummy data for payment gateways
  const pgConfigurations: PaymentGateway[] = [
    {
      id: 1,
      name: 'PayU GPO',
      shortName: 'PayU',
      identifier: 'RphJQf',
      status: 'active',
      isDefault: true,
      logo: 'https://www.payu.in/wp-content/uploads/2021/11/PayU_new_logo.svg',
      type: 'payu',
      pool: 'pool1',
      lastUpdated: '2023-05-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Cashfree Payments',
      shortName: 'Cashfree',
      identifier: 'CF6***TG',
      status: 'active',
      isDefault: false,
      logo: 'https://www.cashfree.com/static/images/logo.svg',
      type: 'cashfree',
      pool: 'pool1',
      lastUpdated: '2023-06-20T14:45:00Z'
    },
    {
      id: 3,
      name: 'Stripe Payments',
      shortName: 'Stripe',
      identifier: 'STR***789',
      status: 'active',
      isDefault: false,
      logo: 'https://b.stripecdn.com/docs-statics-srv/assets/e0d3b072527320a6a5b5.png',
      type: 'stripe',
      pool: 'pool2',
      lastUpdated: '2023-07-10T09:15:00Z'
    },
    {
      id: 4,
      name: 'Razorpay Gateway',
      shortName: 'Razorpay',
      identifier: 'RZP***456',
      status: 'maintenance',
      isDefault: false,
      logo: 'https://razorpay.com/assets/razorpay-glyph.svg',
      type: 'razorpay',
      pool: 'pool2',
      lastUpdated: '2023-08-05T16:20:00Z'
    },
    {
      id: 5,
      name: 'Paytm Wallet',
      shortName: 'Paytm',
      identifier: 'PTM***123',
      status: 'inactive',
      isDefault: false,
      logo: 'https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg',
      type: 'paytm',
      pool: 'pool1',
      lastUpdated: '2023-04-30T11:10:00Z'
    },
    {
      id: 6,
      name: 'PhonePe UPI',
      shortName: 'PhonePe',
      identifier: 'PPE***987',
      status: 'active',
      isDefault: false,
      logo: 'https://www.phonepe.com/webstatic/static/images/phonepe_logo.svg',
      type: 'phonepe',
      pool: 'pool2',
      lastUpdated: '2023-09-12T13:25:00Z'
    }
  ];

  const pgPools = [
    { value: 'all', label: 'All PGs' },
    { value: 'pool1', label: 'Pool 1' },
    { value: 'pool2', label: 'Pool 2' }
  ];

  // Filter gateways based on search query and selected pool
  const filteredGateways = useMemo(() => {
    return pgConfigurations.filter(gateway => {
      const matchesSearch = gateway.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gateway.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gateway.identifier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPool = selectedPgPool === 'all' || gateway.pool === selectedPgPool;
      return matchesSearch && matchesPool;
    });
  }, [pgConfigurations, searchQuery, selectedPgPool, refreshKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  const handleMakeDefault = (id: number) => {
    // In a real app, this would call an API
    console.log(`Making gateway ${id} default`);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API
    console.log(`Deleting gateway ${id}`);
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Test Mode Banner */}
      <div className="bg-yellow-400 text-black px-4 py-2 mb-6 rounded-lg flex items-center justify-between">
        <span className="font-medium">You are viewing in test mode</span>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <span className="text-sm">Test Mode</span>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm font-medium">
            Close
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Settings</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">PG Manager</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PG Manager</h1>
          <p className="text-gray-600">You can edit and manage multiple PG configurations here.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* PG Pool Dropdown */}
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pg Pool</label>
            <select
              value={selectedPgPool}
              onChange={(e) => setSelectedPgPool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {pgPools.map((pool) => (
                <option key={pool.value} value={pool.value}>
                  {pool.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search payment gateways..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md border ${
                viewMode === 'list'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="List view"
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-md border ${
                viewMode === 'cards'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="Card view"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end space-x-2">
            <Link 
              to="/pg/create" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add new PG</span>
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Add new pool</span>
            </button>
          </div>
        </div>
      </div>

      {/* PG Pool ID Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredGateways.length} of {pgConfigurations.length} payment gateways
        </div>
        <div className="text-sm text-gray-600">
          PG Pool ID: <span className="font-medium">0</span>
        </div>
      </div>

      {/* Payment Gateway Display */}
      {filteredGateways.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-500 mb-4">No payment gateways found matching your criteria</div>
          <Link 
            to="/pg/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add New Payment Gateway
          </Link>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGateways.map((gateway) => (
            <div key={gateway.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-white border border-gray-200 p-1 flex items-center justify-center">
                      <img 
                        src={gateway.logo} 
                        alt={gateway.name} 
                        className="h-8 w-auto object-contain" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/40?text=PG';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{gateway.shortName}</h3>
                      <p className="text-sm text-gray-500">{gateway.name}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="text-gray-400 hover:text-gray-500">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Identifier</span>
                    <span className="text-sm font-medium">{gateway.identifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColor(gateway.status)}`}>
                      {gateway.status.charAt(0).toUpperCase() + gateway.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pool</span>
                    <span className="text-sm font-medium">{gateway.pool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm font-medium">
                      {new Date(gateway.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to={`/pg/edit/${gateway.id}`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(gateway.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>

                {gateway.isDefault ? (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Default Gateway
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMakeDefault(gateway.id)}
                    className="mt-4 w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identifier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pool
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGateways.map((gateway) => (
                <tr key={gateway.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-white border border-gray-200 p-1 flex items-center justify-center">
                        <img 
                          src={gateway.logo} 
                          alt={gateway.name} 
                          className="h-8 w-auto object-contain" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40?text=PG';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{gateway.shortName}</div>
                        <div className="text-sm text-gray-500">{gateway.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gateway.identifier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeColor(gateway.status)}`}>
                      {gateway.status.charAt(0).toUpperCase() + gateway.status.slice(1)}
                    </span>
                    {gateway.isDefault && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gateway.pool}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(gateway.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/pg/edit/${gateway.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(gateway.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {!gateway.isDefault && (
                        <button
                          onClick={() => handleMakeDefault(gateway.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Set as Default"
                        >
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PGManagerPage;