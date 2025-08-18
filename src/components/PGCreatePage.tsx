import React, { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Layout from './Layout';

const PGCreatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    pool: '',
    pg: ''
  });
  const [errors, setErrors] = useState({
    pool: '',
    pg: ''
  });

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
    const newErrors = { pool: '', pg: '' };
    
    if (!formData.pool) {
      newErrors.pool = 'Please select a PG Pool';
    }
    
    if (!formData.pg) {
      newErrors.pg = 'Please select a PG';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      // You can add API call here to create the PG
    }
  };

  return (
    <Layout>
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
          <div className="flex justify-end mt-8">
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
    </Layout>
  );
};

export default PGCreatePage;

