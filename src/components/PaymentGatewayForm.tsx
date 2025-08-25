// src/pages/PaymentGatewayForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard, Landmark, Wallet, Smartphone, QrCode, Clock, Bitcoin, Gift,
  Loader2, ChevronDown, Check, X, Globe, Link, Info, Settings, Lock
} from 'lucide-react';

// Reusable FloatingInput component
const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  className = '',
  leftIcon,
  rightIcon,
  min,
  max,
  step,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  autoComplete?: string;
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label always on top */}
      <label
        htmlFor={id}
        className={`block mb-1 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            block w-full px-3 py-2.5
            ${leftIcon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'}
            text-gray-900 bg-white border rounded-lg appearance-none
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200 ease-in-out
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'}
          `}
          {...{ required, disabled, min, max, step, placeholder, autoComplete }}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};


// Reusable CheckboxGroup component
const CheckboxGroup = ({
  title,
  description,
  options,
  selectedValues,
  onChange,
  gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  icon: Icon = Info,
}: {
  title: string;
  description: string;
  options: { id: string; name: string; icon?: React.ReactNode }[];
  selectedValues: string[];
  onChange: (value: string) => void;
  gridCols?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-gray-500" />} {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className={`grid ${gridCols} gap-4`}>
      {options.map((option) => (
        <div key={option.id} className="flex items-center">
          <input
            id={`option-${option.id}`}
            type="checkbox"
            checked={selectedValues.includes(option.id)}
            onChange={() => onChange(option.id)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <label htmlFor={`option-${option.id}`} className="ml-2 text-sm text-gray-700 flex items-center">
            {option.icon || option.icon}
            <span className="ml-1">{option.name}</span>
          </label>
        </div>
      ))}
    </div>
  </div>
);

// Reusable SectionHeader component
const SectionHeader = ({ title, description, icon: Icon = Settings }: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div>
    <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
      {Icon && <Icon className="h-5 w-5 text-gray-500" />} {title}
    </h2>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
);

// EndpointFields component
const EndpointFields = ({ prefix, endpoints, onEndpointChange }: {
  prefix: string;
  endpoints: Record<string, string>;
  onEndpointChange: (key: string, value: string) => void;
}) => (
  <>
    {Object.entries(endpoints).map(([key, value]) => (
      <div key={`${prefix}-${key}`} className="sm:col-span-6">
        <FloatingInput
          id={`${prefix}-${key}`}
          label={`${key.replace(/([A-Z])/g, ' $1')} Endpoint`}
          type="url"
          value={value}
          onChange={(val) => onEndpointChange(key, val)}
          className="capitalize"
          leftIcon={<Link className="h-4 w-4 text-gray-400" />}
        />
      </div>
    ))}
  </>
);

// Constants
const CUSTOM_COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }, { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'IN', name: 'India' },
];

const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'debit_card', name: 'Debit Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: <Landmark className="h-4 w-4" /> },
  { id: 'ewallet', name: 'E-Wallet', icon: <Wallet className="h-4 w-4" /> },
  { id: 'mobile_money', name: 'Mobile Money', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'qr_code', name: 'QR Code', icon: <QrCode className="h-4 w-4" /> },
];

// const GATEWAY_FEATURES = [
//   '3ds', 'recurring_payments', 'tokenization', 'chargeback_protection',
//   'multi_currency_settlement', 'fx_conversion', 'dynamic_descriptor'
// ];

// Main component
const PaymentGatewayForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!id);
  const [gateway, setGateway] = useState({
    name: '',
    description: '',
    website: '',
    primaryCountry: 'US',
    supportedCountries: ['US'],
    supportedPaymentMethods: ['credit_card'],
    features: ['3ds'],
    sandbox: { apiKey: '', secretKey: '', endpoints: { auth: '', payments: '', refunds: '', webhook: '' } },
    production: { apiKey: '', secretKey: '', endpoints: { auth: '', payments: '', refunds: '', webhook: '' } },
    isLive: false,
    settlementPeriod: 'T+2',
    feeStructure: { percentage: 2.9, fixedFee: 0.3, chargebackFee: 15 }
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        setGateway({
          name: 'Stripe',
          description: 'Online payment processing for internet businesses',
          website: 'https://stripe.com',
          primaryCountry: 'US',
          supportedCountries: ['US', 'GB', 'CA', 'AU', 'JP'],
          supportedPaymentMethods: ['credit_card', 'debit_card', 'bank_transfer'],
          features: ['3ds', 'recurring_payments', 'tokenization'],
          sandbox: {
            apiKey: 'pk_test_51H...',
            secretKey: 'sk_test_51H...',
            endpoints: { auth: 'https://api.stripe.com/v3/tokens', payments: 'https://api.stripe.com/v3/charges', refunds: 'https://api.stripe.com/v3/refunds', webhook: 'https://api.stripe.com/v3/webhooks' }
          },
          production: {
            apiKey: 'pk_live_51H...',
            secretKey: 'sk_live_51H...',
            endpoints: { auth: 'https://api.stripe.com/v3/tokens', payments: 'https://api.stripe.com/v3/charges', refunds: 'https://api.stripe.com/v3/refunds', webhook: 'https://api.stripe.com/v3/webhooks' }
          },
          isLive: true,
          // webhookSecret: 'whsec_...',
          settlementPeriod: 'T+2',
          feeStructure: { percentage: 2.9, fixedFee: 0.3, chargebackFee: 15 }
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [id]);

  const updateNestedState = (path: string[], value: any) => {
    setGateway(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] = { ...current[path[i]] };
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/payment-gateways');
  };

  const toggleArrayItem = (arrayName: string, item: string) => {
    setGateway(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName]).includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }));
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? `Edit ${gateway.name}` : 'Create New Payment Gateway'}
        </h1>
        <p className="mt-2 text-gray-600">
          {id ? 'Update your payment gateway configuration' : 'Configure a new payment gateway integration'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        {/* Basic Information */}
        <div className="space-y-6">
          <SectionHeader
            title="Basic Information"
            description="General details about the payment gateway provider."
            icon={Info}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <FloatingInput
              id="name"
              label="Gateway Name"
              value={gateway.name}
              onChange={(val) => updateNestedState(['name'], val)}
              required
              className="sm:col-span-3"
              leftIcon={<Settings className="h-4 w-4 text-gray-400" />}
            />

            <FloatingInput
              id="website"
              label="Website URL"
              type="url"
              value={gateway.website}
              onChange={(val) => updateNestedState(['website'], val)}
              required
              className="sm:col-span-3"
              leftIcon={<Link className="h-4 w-4 text-gray-400" />}
            />

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={gateway.description}
                onChange={(e) => updateNestedState(['description'], e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="primaryCountry"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                Primary Country
              </label>

              <div className="relative">
                <select
                  id="primaryCountry"
                  value={gateway.primaryCountry}
                  onChange={(e) =>
                    updateNestedState(['primaryCountry'], e.target.value)
                  }
                  className="
        block w-full rounded-lg border border-gray-300 bg-white 
        py-2 pl-3 pr-10 text-sm shadow-sm
        focus:border-teal-500 focus:ring-2 focus:ring-teal-500
        hover:border-gray-400 transition-colors
      "
                  required
                >
                  {CUSTOM_COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>
        </div>

        {/* Supported Countries */}
        <CheckboxGroup
          title="Supported Countries"
          description="Select all countries where this gateway can process payments."
          options={CUSTOM_COUNTRIES.map(c => ({ id: c.code, name: c.name }))}
          selectedValues={gateway.supportedCountries}
          onChange={(val) => toggleArrayItem('supportedCountries', val)}
          gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          icon={Globe}
        />

        {/* Supported Payment Methods */}
        <CheckboxGroup
          title="Supported Payment Methods"
          description="Select all payment methods supported by this gateway."
          options={PAYMENT_METHODS}
          selectedValues={gateway.supportedPaymentMethods}
          onChange={(val) => toggleArrayItem('supportedPaymentMethods', val)}
        />

        {/* Features */}
        {/* <CheckboxGroup
          title="Gateway Features"
          description="Select all features supported by this gateway."
          options={GATEWAY_FEATURES.map(f => ({ id: f, name: f.replace(/_/g, ' ') }))}
          selectedValues={gateway.features}
          onChange={(val) => toggleArrayItem('features', val)}
        /> */}

        {/* Fee Structure */}
        <div className="pt-8 space-y-6">
          <SectionHeader
            title="Fee Structure"
            description="Configure the default fee structure for this gateway."
            icon={Wallet}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <FloatingInput
              id="feePercentage"
              label="Percentage Fee"
              type="number"
              value={gateway.feeStructure.percentage}
              onChange={(val) => updateNestedState(['feeStructure', 'percentage'], parseFloat(val) || 0)}
              rightIcon={<span className="text-gray-500">%</span>}
              className="sm:col-span-2"
            />

            <FloatingInput
              id="fixedFee"
              label="Fixed Fee"
              type="number"
              value={gateway.feeStructure.fixedFee}
              onChange={(val) => updateNestedState(['feeStructure', 'fixedFee'], parseFloat(val) || 0)}
              leftIcon={<span className="text-gray-500">$</span>}
              className="sm:col-span-2"
            />

            <FloatingInput
              id="chargebackFee"
              label="Chargeback Fee"
              type="number"
              value={gateway.feeStructure.chargebackFee || 0}
              onChange={(val) => updateNestedState(['feeStructure', 'chargebackFee'], parseFloat(val) || 0)}
              leftIcon={<span className="text-gray-500">$</span>}
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Sandbox Configuration */}
        <div className="pt-8 space-y-6">
          <SectionHeader
            title="Sandbox Configuration"
            description="Credentials and endpoints for testing environment."
            icon={Settings}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <FloatingInput
              id="sandboxApiKey"
              label="API Key"
              value={gateway.sandbox.apiKey}
              onChange={(val) => updateNestedState(['sandbox', 'apiKey'], val)}
              className="sm:col-span-3"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            />

            <FloatingInput
              id="sandboxSecretKey"
              label="Secret Key"
              type="password"
              value={gateway.sandbox.secretKey}
              onChange={(val) => updateNestedState(['sandbox', 'secretKey'], val)}
              className="sm:col-span-3"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            />

            <EndpointFields
              prefix="sandbox"
              endpoints={gateway.sandbox.endpoints}
              onEndpointChange={(key, value) => updateNestedState(['sandbox', 'endpoints', key], value)}
            />
          </div>
        </div>

        {/* Production Configuration */}
        <div className="pt-8 space-y-6">
          <SectionHeader
            title="Production Configuration"
            description="Credentials and endpoints for live environment."
            icon={Settings}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <FloatingInput
              id="productionApiKey"
              label="API Key"
              value={gateway.production.apiKey}
              onChange={(val) => updateNestedState(['production', 'apiKey'], val)}
              className="sm:col-span-3"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            />

            <FloatingInput
              id="productionSecretKey"
              label="Secret Key"
              type="password"
              value={gateway.production.secretKey}
              onChange={(val) => updateNestedState(['production', 'secretKey'], val)}
              className="sm:col-span-3"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            />

            <EndpointFields
              prefix="production"
              endpoints={gateway.production.endpoints}
              onEndpointChange={(key, value) => updateNestedState(['production', 'endpoints', key], value)}
            />

            {/* <FloatingInput
              id="webhookSecret"
              label="Webhook Secret"
              type="password"
              value={gateway.webhookSecret || ''}
              onChange={(val) => updateNestedState(['webhookSecret'], val)}
              className="sm:col-span-6"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            /> */}

            <div className="sm:col-span-6 flex items-center">
              <input
                id="isLive"
                type="checkbox"
                checked={gateway.isLive}
                onChange={(e) => updateNestedState(['isLive'], e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="isLive" className="ml-2 block text-sm text-gray-700">
                Activate this gateway for live transactions
              </label>
            </div>
          </div>
        </div>

        <div className="pt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/payment-gateways')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : id ? 'Update Gateway' : 'Create Gateway'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentGatewayForm;