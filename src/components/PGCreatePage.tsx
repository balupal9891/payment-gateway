import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Save,
  X,
  ChevronRight,
  Home,
  Settings,
  CreditCard,
  Info,
  AlertCircle,
  User
} from 'lucide-react';
import baseURL from '../API/baseUrl';
import { Link, useParams } from 'react-router-dom';
import Cookies from "js-cookie";

interface PaymentGateway {
  gatewayId: string;
  name: string;
  created_at: string;
}

interface FormData {
  gatewayId: string;
  prodApiKey: string;
  prodApiSecret: string;
  prodMid: string;
  pgPriority: string;
  testApiKey: string;
  testApiSecret: string;
  testMid: string;
}

interface Errors {
  gatewayId: string;
  prodApiKey: string;
  prodApiSecret: string;
  prodMid: string;
  testApiKey: string;
  testApiSecret: string;
  testMid: string;
}

interface VendorCredentialsData {
  gatewayId: string;
  prodApiKey: string;
  prodApiSecret: string;
  prodMid: string;
  pgPriority: number;
  testApiKey: string;
  testApiSecret: string;
  testMid: string;
}

const VendorCredentialsPage: React.FC = () => {
  const { gatewayId: urlGatewayId } = useParams<{ gatewayId: string }>(); // Get gateway ID from URL if provided
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [existingCredentialId, setExistingCredentialId] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    gatewayId: '',
    prodApiKey: '',
    prodApiSecret: '',
    prodMid: '',
    pgPriority: '1',
    testApiKey: '',
    testApiSecret: '',
    testMid: ''
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [errors, setErrors] = useState<Errors>({
    gatewayId: '',
    prodApiKey: '',
    prodApiSecret: '',
    prodMid: '',
    testApiKey: '',
    testApiSecret: '',
    testMid: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get access token from localStorage or wherever you store it
  const getAccessToken = () => {
    // Replace this with your actual token storage method
    return Cookies.get('accessToken') || '';
  };

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const res = await axios.get(`${baseURL}/vendorInfo/get-vendor-unmapped-gateways`,{
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        });
        if (res.data?.status === "success") {
          setPaymentGateways(res.data.data);
          console.log("gateways", res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch payment gateways", err);
      }
    };
    fetchGateways();

    if (urlGatewayId) {
      setIsEditMode(true);
      setFormData(prev => ({ ...prev, gatewayId: urlGatewayId }));
      fetchExistingCredentials(urlGatewayId);
    }

  }, [urlGatewayId]);

  const fetchExistingCredentials = async (gatewayId: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/vendorInfo/get-vendor-credentials/${gatewayId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
          }
        }
      );
      console.log("Fetch existing credentials response:", response.data);

      if (response.data.status === "success") {
        const credentials = response.data.data;
        console.log("Existing credentials:", credentials);
        setExistingCredentialId(credentials.vendorCredentialId || '');
        setFormData({
          gatewayId: credentials.gatewayId || gatewayId,
          prodApiKey: credentials.prodApiKey || '',
          prodApiSecret: credentials.prodApiSecret || '',
          prodMid: credentials.prodMid || '',
          pgPriority: credentials.pgPriority?.toString() || '1',
          testApiKey: credentials.testApiKey || '',
          testApiSecret: credentials.testApiSecret || '',
          testMid: credentials.testMid || ''
        });
      }
    } catch (err) {
      console.error("Failed to fetch existing credentials", err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`Field changed: ${field}, New value: ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if ((errors as any)[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {
      gatewayId: !formData.gatewayId ? 'Please select a Payment Gateway' : '',
      prodApiKey: !formData.prodApiKey ? 'Production API Key is required' : '',
      prodApiSecret: !formData.prodApiSecret ? 'Production API Secret is required' : '',
      prodMid: !formData.prodMid ? 'Production MID is required' : '',
      testApiKey: !formData.testApiKey ? 'Test API Key is required' : '',
      testApiSecret: !formData.testApiSecret ? 'Test API Secret is required' : '',
      testMid: !formData.testMid ? 'Test MID is required' : ''
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const vendorData = {
          prodApiKey: formData.prodApiKey,
          prodApiSecret: formData.prodApiSecret,
          prodMid: formData.prodMid,
          pgPriority: parseInt(formData.pgPriority) || 1,
          testApiKey: formData.testApiKey,
          testApiSecret: formData.testApiSecret,
          testMid: formData.testMid
        };

        let response;
        if (isEditMode && existingCredentialId) {
          // Update existing credentials
          response = await axios.post(
            `${baseURL}/vendorInfo/update-vendor-credentials/${urlGatewayId}`,
            vendorData,
            {
              headers: {
                'Authorization': `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } else {
          // Create new credentials
          response = await axios.post(
            `${baseURL}/vendorInfo/add-vendor-credentials/${formData.gatewayId}`,
            vendorData,
            {
              headers: {
                'Authorization': `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        if (response.data.status === "success") {
          setSubmitSuccess(true);
          // Don't reset form in edit mode
          if (!isEditMode) {
            setFormData({
              gatewayId: '',
              prodApiKey: '',
              prodApiSecret: '',
              prodMid: '',
              pgPriority: '1',
              testApiKey: '',
              testApiSecret: '',
              testMid: ''
            });
          }
        }
      } catch (err) {
        console.error("Failed to submit vendor credentials", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Update the page title and button text based on mode
  const pageTitle = isEditMode ? "Update Vendor Credentials" : "Add Vendor Credentials";
  const submitButtonText = isEditMode ? "Update Vendor Credentials" : "Submit Vendor Credentials";

  const renderInputField = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    type = 'text',
    required = false,
    infoText = ''
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
        {infoText && (
          <span className="text-gray-400 text-xs font-normal ml-1" title={infoText}>
            <Info size={14} className="inline" />
          </span>
        )}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${(errors as any)[field] ? 'border-red-500 pr-10' : 'border-gray-300 focus:border-blue-500'
          }`}
        placeholder={placeholder}
        min={type === 'number' ? '1' : undefined}
      />
      {(errors as any)[field] && (
        <div className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center pointer-events-none">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
      {(errors as any)[field] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle size={14} className="mr-1" /> {(errors as any)[field]}
        </p>
      )}
    </div>
  );

  const renderSelectField = (
    label: string,
    field: keyof FormData,
    options: { gatewayId: string; name: string }[],
    required = false
  ) => (
    console.log("options", options),
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${(errors as any)[field] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.gatewayId} value={option.gatewayId}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronRight className="h-4 w-4 transform rotate-90" />
        </div>
      </div>
      {(errors as any)[field] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle size={14} className="mr-1" /> {(errors as any)[field]}
        </p>
      )}
    </div>
  );

  const renderCredentialsSection = (title: string, isTest = false) => (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
      <div className="flex items-center mb-4">
        <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-medium text-blue-900">{title}</h3>
        {isTest && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Test Environment
          </span>
        )}
        {!isTest && (
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Production Environment
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField(
          `${isTest ? 'Test ' : 'Production '}API Key`,
          isTest ? 'testApiKey' : 'prodApiKey',
          `Enter ${isTest ? 'Test ' : 'Production '}API Key`,
          'text',
          true,
          'Provided by your payment gateway provider'
        )}
        {renderInputField(
          `${isTest ? 'Test ' : 'Production '}API Secret`,
          isTest ? 'testApiSecret' : 'prodApiSecret',
          `Enter ${isTest ? 'Test ' : 'Production '}API Secret`,
          'password',
          true,
          'Keep this secure and never share it publicly'
        )}
        {renderInputField(
          `${isTest ? 'Test ' : 'Production '}MID`,
          isTest ? 'testMid' : 'prodMid',
          `Enter ${isTest ? 'Test ' : 'Production '}Merchant ID`,
          'text',
          true,
          'Your merchant identification number'
        )}
        {!isTest && renderInputField(
          'PG Priority',
          'pgPriority',
          'Enter priority number (default: 1)',
          'number',
          false,
          'Lower numbers have higher priority'
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-gray-700 flex items-center">
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/settings" className="hover:text-gray-700 flex items-center">
          Settings
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/settings/pg" className="hover:text-gray-700">
          PG Manager
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-gray-900">{pageTitle}</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="mr-2 h-7 w-7" />
          {pageTitle}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update your payment gateway credentials for an existing gateway."
            : "Provide your payment gateway credentials for an existing gateway configured by the admin."
          }
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <div className="flex-shrink-0">
            <div className="h-5 w-5 text-green-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Vendor credentials successfully submitted!
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* Gateway Selection */}
          <div className="mb-6">
            {renderSelectField('Payment Gateway', 'gatewayId', paymentGateways, true)}
          </div>

          {/* Gateway Selection Info */}
          {formData.gatewayId && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Selected Gateway</h3>
              </div>
              <p className="text-sm text-blue-700">
                You are providing credentials for the selected payment gateway.
                The gateway has been pre-configured by the admin.
              </p>
            </div>
          )}

          {/* Credentials Sections */}
          {formData.gatewayId && (
            <>
              {renderCredentialsSection('Production Credentials')}
              {renderCredentialsSection('Test Credentials', true)}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end mt-8 space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/settings/pg"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <X size={18} className="mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.gatewayId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{submitButtonText}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Important:</strong> All credentials are encrypted and stored securely.
              Ensure you have the correct credentials from your payment service provider before submitting.
            </p>
            <p className="mb-2">
              <strong>Requirements:</strong> You must provide both production and test environment credentials.
              The priority value determines the order in which this gateway will be used (lower numbers = higher priority).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCredentialsPage;