import React, { useState, useEffect } from 'react';
import { Search, List, Grid, Plus, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../API/baseUrl';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Define types
interface Gateway {
  gateway_id: string;
  name: string;
  updated_at: string;
  status?: 'active' | 'inactive'; // Optional as API doesn't provide status
}

interface Pool {
  id: string;
  name: string;
  gateways: Gateway[];
  isDefault: boolean;
}

interface GatewayWithPoolName extends Gateway {
  poolName: string;
}
interface GatewayCardProps {
  gateway: Gateway;
  handleGatewayClick: (gatewayId: string) => void;
}

const GatewayCard: React.FC<GatewayCardProps> = ({ gateway, handleGatewayClick }) => {
  const [imageError, setImageError] = useState(false);

  // Function to get the image path based on gateway name
  const getGatewayImage = (gatewayName: string) => {
    // Convert gateway name to lowercase and remove special characters
    const imageName = gatewayName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return `/src/assets/gateway/${imageName}.png`;
  };

  // Function to format the updated_at timestamp
  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };


  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="max-w-xs mx-auto">
      <div
        key={gateway.gateway_id}
        className="flex flex-col p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer bg-white h-64"
        onClick={() => handleGatewayClick(gateway.gateway_id)}
      >
        {/* Image container with full width */}
        <div className="h-44 mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img
              src={getGatewayImage(gateway.name)}
              alt={`${gateway.name} logo`}
              className="w-full h-full object-cover p-2"
              onError={handleImageError}
            />
          ) : (
            // Fallback to initials if image fails to load
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <span className="text-blue-600 font-bold text-2xl">
                {gateway.name.split(' ').map(w => w[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Gateway name and status - left aligned */}
        <div className="flex flex-col items-start flex-grow justify-end">
          <h3 className="font-semibold text-xl text-gray-900 capitalize line-clamp-1">
            {gateway.name}
          </h3>

          {/* Status and last updated container */}
          <div className="flex items-center justify-between w-full mt-2">
            {/* Status indicator */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${(gateway.status || 'active') === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {gateway.status || 'active'}
            </span>

            {/* Last updated timestamp */}
            {gateway.updated_at && (
              <span className="text-xs text-gray-500 text-right">
                Last updated: {formatLastUpdated(gateway.updated_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PGManagerPage: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showAddPoolModal, setShowAddPoolModal] = useState<boolean>(false);
  const [newPoolName, setNewPoolName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const getAccessToken = () => {
    // Replace this with your actual token storage method
    return Cookies.get('accessToken') || '';
  };

  const handleGatewayClick = (gatewayId: string): void => {
    navigate(`/pg/update/${gatewayId}`);
  };

  // Fetch gateways from API
  useEffect(() => {
    const fetchGateways = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseURL}/vendor/get-vendor-gateways`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        const data = response.data;
        console.log("Fetched gateways:", data);

        if (data.status === 'success') {
          // Create default pool with gateways from API
          const defaultPool: Pool = {
            id: 'default',
            name: 'Default Pool',
            gateways: data.data.map((gateway: any) => ({
              ...gateway,
              status: 'active' // Default status since API doesn't provide it
            })),
            isDefault: true
          };

          setPools([defaultPool]);
        } else {
          console.error('Failed to fetch gateways:', data.message);
          // Initialize with empty default pool if API fails
          setPools([{
            id: 'default',
            name: 'Default Pool',
            gateways: [],
            isDefault: true
          }]);
        }
      } catch (error) {
        console.error('Error fetching gateways:', error);
        // Initialize with empty default pool on error
        setPools([{
          id: 'default',
          name: 'Default Pool',
          gateways: [],
          isDefault: true
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGateways();
  }, []);

  // Handle adding new pool
  const handleAddPool = (): void => {
    if (newPoolName.trim()) {
      const newPool: Pool = {
        id: Date.now().toString(),
        name: newPoolName.trim(),
        gateways: [],
        isDefault: false
      };
      setPools([...pools, newPool]);
      setNewPoolName('');
      setShowAddPoolModal(false);
    }
  };

  // Handle pool selection
  const handlePoolSelect = (poolId: string): void => {
    setSelectedPool(poolId);
  };

  // Get filtered gateways based on selected pool
  const getFilteredGateways = (): GatewayWithPoolName[] => {
    if (selectedPool === 'all') {
      return pools.flatMap(pool =>
        pool.gateways.map(gateway => ({ ...gateway, poolName: pool.name }))
      );
    }
    const pool = pools.find(p => p.id === selectedPool);
    return pool ? pool.gateways.map(gw => ({ ...gw, poolName: pool.name })) : [];
  };

  // Filter gateways based on search
  const filteredGateways = getFilteredGateways().filter(gateway =>
    gateway.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const selectedPoolName = selectedPool === 'all'
    ? 'All PGs'
    : pools.find(p => p.id === selectedPool)?.name || 'Default Pool';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment gateways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Settings</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">PG Manager</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PG Manager</h1>
            <p className="text-gray-600 mt-1">You can edit and manage multiple PG configurations here.</p>
          </div>
          <button
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => window.location.reload()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Pool Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pg Pool</label>
            <div className="relative">
              <select
                value={selectedPool}
                onChange={(e) => handlePoolSelect(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="default">Default Pool</option>
                <option value="all">All PGs</option>
                {pools.filter(pool => !pool.isDefault).map(pool => (
                  <option key={pool.id} value={pool.id}>{pool.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payment gateways..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-end gap-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors`}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors`}
              >
                <Grid className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3 flex-wrap mt-2 sm:mt-0">
            <Link
              to={'/pg/create'}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add new PG
            </Link>
            <button
              onClick={() => setShowAddPoolModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add new pool
            </button>
          </div>
        </div>

        {/* Gateway Display */}
        <div className="bg-white rounded-lg border border-gray-200">
          {filteredGateways.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedPool === 'all' ? 'No gateways found' : 'No gateway added in this pool'}
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedPool === 'all'
                  ? 'Try adjusting your search or add a new payment gateway.'
                  : `The ${selectedPoolName} pool doesn't have any payment gateways configured yet.`
                }
              </p>
              <Link
                to={'/pg/create'}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Payment Gateway
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Gateways {selectedPool !== 'all' && `in ${selectedPoolName}`}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredGateways.length} gateway{filteredGateways.length !== 1 ? 's' : ''}
                </span>
              </div>

              {viewMode === 'list' ? (
                <div className="space-y-3">
                  {filteredGateways.map((gateway) => (
                    <div
                      key={gateway.gateway_id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => handleGatewayClick(gateway.gateway_id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {gateway.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">{gateway.name}</h3>
                          {selectedPool === 'all' && (
                            <p className="text-sm text-gray-500">Pool: {gateway.poolName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${gateway.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {gateway.status || 'active'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGateways.map((gateway) => (
                    // <div 
                    // key={gateway.gateway_id} 
                    // className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    // onClick={() => handleGatewayClick(gateway.gateway_id)}
                    // >
                    //   <div className="flex items-center justify-between mb-3">
                    //     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    //       <span className="text-blue-600 font-semibold text-sm">
                    //         {gateway.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                    //       </span>
                    //     </div>
                    //     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    //       gateway.status === 'active' 
                    //         ? 'bg-green-100 text-green-800' 
                    //         : 'bg-red-100 text-red-800'
                    //     }`}>
                    //       {gateway.status || 'active'}
                    //     </span>
                    //   </div>
                    //   <h3 className="font-medium text-gray-900 mb-1 capitalize">{gateway.name}</h3>
                    //   {selectedPool === 'all' && (
                    //     <p className="text-sm text-gray-500">Pool: {gateway.poolName}</p>
                    //   )}
                    // </div>
                    <GatewayCard gateway={gateway} handleGatewayClick={handleGatewayClick} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Pool Modal */}
      {showAddPoolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Pool</h3>
              <button
                onClick={() => {
                  setShowAddPoolModal(false);
                  setNewPoolName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pool Name
              </label>
              <input
                type="text"
                value={newPoolName}
                onChange={(e) => setNewPoolName(e.target.value)}
                placeholder="Enter pool name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPool()}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddPoolModal(false);
                  setNewPoolName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPool}
                disabled={!newPoolName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Add Pool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGManagerPage;