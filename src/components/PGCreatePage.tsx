import React, { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const PGCreatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    pool: '',
    pg: '',
    apiKey: '',
    apiSecret: '',
    mid: '',
    pgPriority: ''
  });
  const [errors, setErrors] = useState({
    pool: '',
    pg: '',
    apiKey: '',
    apiSecret: '',
    mid: ''
  });
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSeamless, setIsSeamless] = useState(true);
  const [isPayins, setIsPayins] = useState(true);
  const [netBanking, setNetBanking] = useState(true);
  const [card, setCard] = useState(true);
  const [upi, setUpi] = useState(true);
  const [wallets, setWallets] = useState(true);

  const pgPools = [
    { value: 'default', label: 'Default' },
    { value: 'pool1', label: 'Pool 1' },
    { value: 'pool2', label: 'Pool 2' },
    { value: 'pool3', label: 'Pool 3' }
  ];

  const paymentGateways = [
    { value: 'stripe', label: 'Stripe', description: 'International payment processing' },
    { value: 'payu', label: 'PayU', description: 'Indian payment gateway' },
    { value: 'razorpay', label: 'Razorpay', description: 'Unified payments solution' },
    { value: 'cashfree', label: 'Cashfree', description: 'Digital payment platform' },
    { value: 'paytm', label: 'Paytm', description: 'Digital wallet and payments' },
    { value: 'phonepe', label: 'PhonePe', description: 'UPI-based payments' },
    { value: 'amazonpay', label: 'Amazon Pay', description: 'E-commerce payment solution' },
    { value: 'googlepay', label: 'Google Pay', description: 'Digital wallet service' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { 
      pool: '', 
      pg: '',
      apiKey: '',
      apiSecret: '',
      mid: ''
    };
    
    if (!formData.pool) {
      newErrors.pool = 'Please select a PG Pool';
    }
    
    if (!formData.pg) {
      newErrors.pg = 'Please select a PG';
    }

    // Only validate credentials if PG is enabled and payins is checked
    if (isEnabled && isPayins) {
      if (!formData.apiKey) {
        newErrors.apiKey = 'API Key is required';
      }
      if (!formData.apiSecret) {
        newErrors.apiSecret = 'API Secret is required';
      }
      if (!formData.mid) {
        newErrors.mid = 'MID is required';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', {
        ...formData,
        isEnabled,
        isSeamless,
        isPayins,
        paymentMethods: {
          netBanking,
          card,
          upi,
          wallets
        }
      });
      // You can add API call here to create the PG
    }
  };

  return (
    <>
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
          <span>PG Manager</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">PG Create</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add PG</h1>
        <p className="text-gray-600">Add PG and configure it's settings here.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Pool */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pool <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pool}
                onChange={(e) => handleInputChange('pool', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pool ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Select Pool</option>
                {pgPools.map((pool) => (
                  <option key={pool.value} value={pool.value}>
                    {pool.label}
                  </option>
                ))}
              </select>
              {errors.pool && (
                <p className="text-red-500 text-sm mt-1">{errors.pool}</p>
              )}
            </div>

            {/* Select PG */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PG <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pg}
                onChange={(e) => handleInputChange('pg', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pg ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Select PG</option>
                {paymentGateways.map((gateway) => (
                  <option key={gateway.value} value={gateway.value}>
                    {gateway.label}
                  </option>
                ))}
              </select>
              {errors.pg && (
                <p className="text-red-500 text-sm mt-1">{errors.pg}</p>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          {formData.pg && <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">PG Status</h3>
                <p className="text-sm text-gray-500">
                  {isEnabled ? 'This PG will be active and available for transactions' : 'This PG will be disabled and unavailable'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isEnabled} 
                  onChange={() => setIsEnabled(!isEnabled)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>}

          {/* Only show additional options if PG is enabled */}
          {formData.pg && isEnabled && (
            <>
              {/* Features Toggles */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Seamless Payments</h3>
                      <p className="text-sm text-gray-500">
                        Enable if this PG supports seamless payment processing
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSeamless} 
                        onChange={() => setIsSeamless(!isSeamless)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Payins</h3>
                      <p className="text-sm text-gray-500">
                        Enable to configure payment processing credentials
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPayins} 
                        onChange={() => setIsPayins(!isPayins)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payins Section - Only show if payins is enabled */}
              {isPayins && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Payins Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input 
                        type="text" 
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange('apiKey', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.apiKey ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Enter API Key"
                      />
                      {errors.apiKey && (
                        <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                      <input 
                        type="text" 
                        value={formData.apiSecret}
                        onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.apiSecret ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Enter API Secret"
                      />
                      {errors.apiSecret && (
                        <p className="text-red-500 text-sm mt-1">{errors.apiSecret}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MID</label>
                      <input 
                        type="text" 
                        value={formData.mid}
                        onChange={(e) => handleInputChange('mid', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.mid ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Enter Merchant ID"
                      />
                      {errors.mid && (
                        <p className="text-red-500 text-sm mt-1">{errors.mid}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PG Priority</label>
                      <input 
                        type="number" 
                        value={formData.pgPriority}
                        onChange={(e) => handleInputChange('pgPriority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter priority number"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods (Seamless) - Only show if seamless is enabled */}
              {isSeamless && (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="font-medium text-gray-900 mb-3">Supported Payment Methods</h3>
    <div className="flex flex-wrap gap-6">
      
      {/* Net Banking */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={netBanking}
          onChange={() => setNetBanking(!netBanking)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                        peer-focus:ring-4 peer-focus:ring-blue-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
        <span className="ml-3 text-gray-700">Net Banking</span>
      </label>

      {/* Card */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={card}
          onChange={() => setCard(!card)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                        peer-focus:ring-4 peer-focus:ring-blue-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
        <span className="ml-3 text-gray-700">Card</span>
      </label>

      {/* UPI */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={upi}
          onChange={() => setUpi(!upi)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                        peer-focus:ring-4 peer-focus:ring-blue-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
        <span className="ml-3 text-gray-700">UPI</span>
      </label>

      {/* Wallets */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={wallets}
          onChange={() => setWallets(!wallets)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                        peer-focus:ring-4 peer-focus:ring-blue-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
        <span className="ml-3 text-gray-700">Wallets</span>
      </label>

    </div>
  </div>
)}

            </>
          )}

          {/* Payment Gateway Details (shown when PG is selected) */}
          {formData.pg && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Selected Payment Gateway</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                  <span className="text-lg font-bold text-blue-600">
                    {paymentGateways.find(g => g.value === formData.pg)?.label.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {paymentGateways.find(g => g.value === formData.pg)?.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {paymentGateways.find(g => g.value === formData.pg)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end mt-8 space-x-3">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
      </>
  );
};

export default PGCreatePage;