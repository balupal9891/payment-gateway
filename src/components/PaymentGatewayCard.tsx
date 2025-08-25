import React from 'react';
import { Cog6ToothIcon, ChevronRightIcon, BoltIcon, GlobeAltIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface PaymentGateway {
  id: number;
  name: string;
  shortName: string;
  identifier: string;
  status: 'active' | 'inactive' | 'maintenance';
  isDefault: boolean;
  logo?: string;
  type: string;
  description: string;
  website: string;
  primaryCountry: string;
  supportedCountries: string[];
  supportedPaymentMethods: string[];
  features: string[];
  sandbox: {
    apiKey: string;
    secretKey: string;
    endpoints: {
      auth: string;
      payments: string;
      refunds: string;
      webhook: string;
    };
  };
  production: {
    apiKey: string;
    secretKey: string;
    endpoints: {
      auth: string;
      payments: string;
      refunds: string;
      webhook: string;
    };
  };
  isLive: boolean;
  settlementPeriod: string;
  feeStructure: {
    percentage: number;
    fixedFee: number;
    chargebackFee: number;
  };
}

interface PaymentGatewayCardProps {
  gateway: PaymentGateway;
  viewMode: 'cards' | 'list';
  onEdit: any
}

const PaymentGatewayCard: React.FC<PaymentGatewayCardProps> = ({ gateway, viewMode, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Enabled';
      case 'inactive':
        return 'Disabled';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          {/* Left side - Gateway info */}
          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {gateway.logo ? (
                <img src={gateway.logo} alt={gateway.name} className="w-8 h-8" />
              ) : (
                <BoltIcon className="w-8 h-8 text-orange-500" />
              )}
            </div>

            {/* Gateway details */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900">{gateway.shortName}</h3>
              <p className="text-sm text-gray-500">{gateway.name}</p>
              <p className="text-xs text-gray-400">{gateway.description}</p>
              <a href={gateway.website} target="_blank" rel="noreferrer" className="text-xs text-teal-600 hover:underline flex items-center space-x-1">
                <GlobeAltIcon className="w-4 h-4" />
                <span>{gateway.website.replace(/^https?:\/\//, '')}</span>
              </a>

              {/* Status & PG Key */}
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(gateway.status)}`} />
                  <span className="text-sm text-gray-600">{getStatusText(gateway.status)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">PG Key:</span>
                  <span className="text-sm font-mono text-gray-900 ml-1">{gateway.identifier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {gateway.isDefault && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Default
              </span>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Card view
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 relative">
      

      {/* PG Logo and Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {gateway.logo ? (
              <img src={gateway.logo} alt={gateway.name} className="w-8 h-8" />
            ) : (
              <BoltIcon className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{gateway.shortName}</h3>
            <p className="text-sm text-gray-500">{gateway.name}</p>
            <p className="text-xs text-gray-400">{gateway.description}</p>
          </div>
        </div>

        {/* Status Indicator */}
        {/* <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(gateway.status)}`} />
          <span className="text-sm text-gray-600 capitalize">{getStatusText(gateway.status)}</span>
        </div> */}
      </div>

      {/* Features & Supported Methods */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Supported Countries:</p>
        <p className="text-xs text-gray-500">{gateway.supportedCountries.join(', ')}</p>

        <p className="text-sm font-medium text-gray-700 mt-2">Payment Methods:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {gateway.supportedPaymentMethods.map((method) => (
            <span key={method} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center space-x-1">
              <CreditCardIcon className="w-3 h-3" />
              <span>{method}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentGatewayCard;
