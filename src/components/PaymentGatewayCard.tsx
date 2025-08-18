import React from 'react';
import { Cog6ToothIcon, ChevronRightIcon, BoltIcon } from '@heroicons/react/24/outline';

interface PaymentGateway {
  id: number;
  name: string;
  shortName: string;
  identifier: string;
  status: string;
  isDefault: boolean;
  logo?: string;
  type: string;
}

interface PaymentGatewayCardProps {
  gateway: PaymentGateway;
  viewMode: 'cards' | 'list';
}

const PaymentGatewayCard: React.FC<PaymentGatewayCardProps> = ({ gateway, viewMode }) => {
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
            <div className="flex items-center space-x-6">
              <div>
                <h3 className="font-semibold text-gray-900">{gateway.shortName}</h3>
                <p className="text-sm text-gray-500">{gateway.name}</p>
              </div>
              
              {/* Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(gateway.status)}`}></div>
                <span className="text-sm text-gray-600">{getStatusText(gateway.status)}</span>
              </div>
              
              {/* PG Key */}
              <div>
                <span className="text-sm text-gray-500">PG Key:</span>
                <span className="text-sm font-mono text-gray-900 ml-1">{gateway.identifier}</span>
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

  // Card view (default)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 relative">
      {/* Default Banner */}
      {gateway.isDefault && (
        <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded transform -rotate-12">
          Default
        </div>
      )}

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
            <p className="text-sm text-gray-500">{gateway.identifier}</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(gateway.status)}`}></div>
          <span className="text-sm text-gray-600 capitalize">{getStatusText(gateway.status)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentGatewayCard;










