// src/pages/PaymentGatewayForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe, Loader2, Check, X, Info, CreditCard, MapPin, Building2
} from 'lucide-react';
import apiClient from '../API/apiClient';
import Cookies from 'js-cookie';
import axios from 'axios';
import baseURL from '../API/baseUrl';

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
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
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
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  icon: Icon = Info,
}: {
  title: string;
  description: string;
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (value: string) => void;
  gridCols?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-blue-600" />} {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>

    <div className={`grid ${gridCols} gap-4`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <label
            key={option.id}
            htmlFor={`option-${option.id}`}
            className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-blue-400"
              }`}
          >
            <span className="text-sm font-medium text-gray-700">
              {option.name}
            </span>
            <input
              id={`option-${option.id}`}
              type="checkbox"
              checked={isSelected}
              onChange={() => onChange(option.id)}
              className="hidden"
            />
            <span
              className={`h-5 w-5 flex items-center justify-center rounded-md border 
                ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400"
                }`}
            >
              {isSelected && "✓"}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);


// Reusable SectionHeader component
const SectionHeader = ({ title, description, icon: Icon = CreditCard }: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
    <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
      {Icon && <Icon className="h-5 w-5 text-blue-600" />} {title}
    </h2>
    <p className="mt-1 text-sm text-gray-600">{description}</p>
  </div>
);

// Country type definition
interface Country {
  countryId: string;
  name: string;
}

// Main component
const PaymentGatewayForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!id);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [gateway, setGateway] = useState({
    name: '',
    primaryCountryId: '',
    countryIds: [] as string[],
  });

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const response = await apiClient.get('/country/list');
        const data = response.data;

        if (data.status === 'success') {
          setCountries(data.data);
          if (!gateway.primaryCountryId && data.data.length > 0) {
            setGateway(prev => ({ ...prev, primaryCountryId: data.data[0].countryId }));
          }
        } else {
          console.error('Failed to fetch countries');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        setGateway({
          name: 'Stripe',
          primaryCountryId: 'ffa171bc-5da5-4a17-a234-b1fb2e269096',
          countryIds: ['ffa171bc-5da5-4a17-a234-b1fb2e269096'],
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
    const token = Cookies.get("accessToken");
      console.log("Gateway data to send:", gateway);

      const response = await axios.post(`${baseURL}/pg/new`,  gateway, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response from server:", response.data);
    navigate('/payment-gateways');
  };

  const toggleArrayItem = (arrayName: string, item: string) => {
    setGateway(prev=> ({
      ...prev,
      [arrayName]: ((prev as any)[arrayName]).includes(item)
        ? (prev as any)[arrayName].filter((i: string) => i !== item)
        : [...(prev as any)[arrayName], item]
    }));
  };

  if (isLoading || isLoadingCountries) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-blue-600" />
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
            icon={Building2}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <FloatingInput
              id="name"
              label="Gateway Name"
              value={gateway.name}
              onChange={(val) => updateNestedState(['name'], val)}
              required
              className="sm:col-span-3"
              leftIcon={<Building2 className="h-4 w-4 text-gray-400" />}
              placeholder="Enter gateway name"
            />

            <div className="sm:col-span-3">
              <label
                htmlFor="primaryCountryId"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                Primary Country
              </label>

              <div className="relative">
                <select
                  id="primaryCountryId"
                  value={gateway.primaryCountryId}
                  onChange={(e) =>
                    updateNestedState(['primaryCountryId'], e.target.value)
                  }
                  className="
                    block w-full rounded-lg border border-gray-300 bg-white 
                    py-2.5 pl-10 pr-10 text-sm shadow-sm
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                    hover:border-gray-400 transition-colors
                  "
                  required
                >
                  {countries.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Countries */}
        <div className="pt-8">
          <CheckboxGroup
            title="Supported Countries"
            description="Select all countries where this gateway can process payments."
            options={countries.map(c => ({ id: c.countryId, name: c.name }))}
            selectedValues={gateway.countryIds}
            onChange={(val) => toggleArrayItem('countryIds', val)}
            gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            icon={MapPin}
          />
        </div>

        <div className="pt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/payment-gateways')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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