import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface PaymentGateway {
  id: string;
  name: string;
  shortName: string;
  identifier: string;
  status: 'active' | 'inactive' | 'maintenance';
  isDefault: boolean;
  logo: string;
  description: string;
  supportedCountries: string[];
  supportedPaymentMethods: string[];
  validationStatus: 'pending' | 'validated' | 'failed';
}

const PGGatewaySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);

  // Mock data for demonstration
  const mockGateways: PaymentGateway[] = [
    {
      id: 'payu-1',
      name: 'PayU India',
      shortName: 'PayU',
      identifier: 'payu',
      status: 'active',
      isDefault: true,
      logo: '/src/assets/gateway/payu.png',
      description: 'Popular Indian payment gateway with comprehensive payment solutions',
      supportedCountries: ['IN'],
      supportedPaymentMethods: ['UPI', 'Net Banking', 'Cards', 'Wallets'],
      validationStatus: 'pending'
    },
    {
      id: 'stripe-1',
      name: 'Stripe Payments',
      shortName: 'Stripe',
      identifier: 'stripe',
      status: 'active',
      isDefault: false,
      logo: '/src/assets/gateway/stripe.png',
      description: 'Global payment processing platform for internet businesses',
      supportedCountries: ['US', 'GB', 'CA', 'AU', 'JP'],
      supportedPaymentMethods: ['Credit Cards', 'Debit Cards', 'Bank Transfers'],
      validationStatus: 'validated'
    },
    {
      id: 'razorpay-1',
      name: 'Razorpay',
      shortName: 'Razorpay',
      identifier: 'razorpay',
      status: 'maintenance',
      isDefault: false,
      logo: '/src/assets/gateway/razorpay.png',
      description: 'Modern Indian payments platform with developer-friendly APIs',
      supportedCountries: ['IN'],
      supportedPaymentMethods: ['UPI', 'Wallets', 'Cards', 'Net Banking'],
      validationStatus: 'failed'
    }
  ];

  useEffect(() => {
    const fetchGateways = async () => {
      setLoading(true);
      try {
        // Using mock data for now
        setTimeout(() => {
          setGateways(mockGateways);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching gateways:', error);
        setLoading(false);
      }
    };

    fetchGateways();
  }, []);

  const filteredGateways = gateways.filter(gateway => {
    const matchesSearch = gateway.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gateway.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gateway.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || gateway.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Configure and manage your payment service providers</p>
        </div>
        <Link
          to="/admin/payment-gateways/new"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Add New Gateway
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gateways..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGateways.map((gateway) => (
          <div
            key={gateway.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/admin/payment-gateways/${gateway.id}`)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={gateway.logo}
                      alt={gateway.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {gateway.shortName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    <p className="text-sm text-gray-500">{gateway.shortName}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gateway.status)}`}>
                    {gateway.status}
                  </span>
                  {gateway.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gateway.description}</p>

              {/* Validation Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Validation:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getValidationColor(gateway.validationStatus)}`}>
                  {gateway.validationStatus === 'validated' && <CheckIcon className="w-3 h-3 mr-1" />}
                  {gateway.validationStatus === 'failed' && <XMarkIcon className="w-3 h-3 mr-1" />}
                  {gateway.validationStatus}
                </span>
              </div>

              {/* Supported Methods */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Supported Payment Methods:</p>
                <div className="flex flex-wrap gap-1">
                  {gateway.supportedPaymentMethods.slice(0, 3).map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {method}
                    </span>
                  ))}
                  {gateway.supportedPaymentMethods.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{gateway.supportedPaymentMethods.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Countries */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Supported Countries:</p>
                <div className="flex flex-wrap gap-1">
                  {gateway.supportedCountries.map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Click to configure</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGateways.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gateways found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedStatus !== 'all' 
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first payment gateway.'
            }
          </p>
          {!searchQuery && selectedStatus === 'all' && (
            <Link
              to="/admin/payment-gateways/new"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Add New Gateway
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PGGatewaySelectionPage;
