import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface PSPCredentials {
  webhookUrl: string;
  apiKey: string;
  mid: string;
  ipsToWhitelist: string;
  apiSecret: string;
  priority: number;
  validationStatus: 'pending' | 'validated' | 'failed';
}

interface PSPFeatures {
  active: boolean;
  tpv: boolean;
  seamless: boolean;
  payins: boolean;
  payouts: boolean;
}

interface PSPConfiguration {
  id: string;
  name: string;
  identifier: string;
  isDefault: boolean;
  logo: string;
  credentials: PSPCredentials;
  features: PSPFeatures;
  supportedCurrencies: string[];
  supportedCountries: string[];
}

const PGConfigurationPage: React.FC = () => {
  const { gatewayId } = useParams<{ gatewayId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PSPConfiguration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  // Mock data for demonstration
  const mockPSPData: PSPConfiguration = {
    id: 'payu-1',
    name: 'PayU',
    identifier: 'payu',
    isDefault: true,
    logo: '/src/assets/gateway/payu.png',
    credentials: {
      webhookUrl: 'https://motifpe-api.paytring.com/api/cb/gateway/webhook/7118090:',
      apiKey: 'RphJQf',
      mid: '8395896',
      ipsToWhitelist: '13.232.107.40,13.127.63.100',
      apiSecret: '********',
      priority: 1,
      validationStatus: 'pending'
    },
    features: {
      active: true,
      tpv: false,
      seamless: false,
      payins: true,
      payouts: false
    },
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
    supportedCountries: ['IN', 'US', 'UK', 'DE']
  };

  const availableCurrencies = [
    { code: 'INR', name: 'Indian Rupee', country: 'India' },
    { code: 'USD', name: 'US Dollar', country: 'United States' },
    { code: 'EUR', name: 'Euro', country: 'European Union' },
    { code: 'GBP', name: 'British Pound', country: 'United Kingdom' },
    { code: 'CAD', name: 'Canadian Dollar', country: 'Canada' },
    { code: 'AUD', name: 'Australian Dollar', country: 'Australia' },
    { code: 'JPY', name: 'Japanese Yen', country: 'Japan' },
    { code: 'SGD', name: 'Singapore Dollar', country: 'Singapore' }
  ];

  useEffect(() => {
    // Simulate API call to fetch gateway configuration
    const fetchGatewayConfig = async () => {
      setLoading(true);
      try {
        // Using mock data for now
        setTimeout(() => {
          setSelectedGateway(mockPSPData);
          setSelectedCurrencies(mockPSPData.supportedCurrencies);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching gateway configuration:', error);
        setLoading(false);
      }
    };

    if (gatewayId) {
      fetchGatewayConfig();
    }
  }, [gatewayId]);

  const handleFeatureToggle = (feature: keyof PSPFeatures) => {
    if (!selectedGateway) return;
    
    setSelectedGateway(prev => prev ? {
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    } : null);
  };

  const handleCredentialChange = (field: keyof PSPCredentials, value: string | number) => {
    if (!selectedGateway) return;
    
    setSelectedGateway(prev => prev ? {
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: value
      }
    } : null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const validateCredentials = async () => {
    if (!selectedGateway) return;
    
    setValidating(true);
    try {
      // Simulate validation
      setTimeout(() => {
        setSelectedGateway(prev => prev ? {
          ...prev,
          credentials: {
            ...prev.credentials,
            validationStatus: 'validated'
          }
        } : null);
        setValidating(false);
      }, 2000);
    } catch (error) {
      console.error('Validation failed:', error);
      setSelectedGateway(prev => prev ? {
        ...prev,
        credentials: {
          ...prev.credentials,
          validationStatus: 'failed'
        }
      } : null);
      setValidating(false);
    }
  };

  const saveConfiguration = async () => {
    if (!selectedGateway) return;
    
    setSaving(true);
    try {
      // Simulate save
      setTimeout(() => {
        setSaving(false);
        // You could add a success notification here
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaving(false);
      // You could add an error notification here
    }
  };

  const filteredCurrencies = availableCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCurrency = (currencyCode: string) => {
    setSelectedCurrencies(prev => 
      prev.includes(currencyCode)
        ? prev.filter(c => c !== currencyCode)
        : [...prev, currencyCode]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!selectedGateway) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Gateway not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configure PSP - {selectedGateway.name} | {selectedGateway.isDefault ? 'Default' : 'Secondary'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter API credentials and validate to enable this PSP in the orchestration layer.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedGateway.credentials.validationStatus === 'validated' 
                ? 'bg-green-100 text-green-800' 
                : selectedGateway.credentials.validationStatus === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {selectedGateway.credentials.validationStatus === 'validated' ? 'Validated' :
               selectedGateway.credentials.validationStatus === 'failed' ? 'Validation Failed' :
               'Not validated'}
            </span>
          </div>
          <button
            onClick={() => setSelectedGateway(prev => prev ? { ...prev, isDefault: !prev.isDefault } : null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Set as default
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* PSP Features Configuration */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">PSP Features Configurations</h2>
            <p className="text-sm text-gray-500 mb-6">Toggle features supported by this PSP on your account.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(selectedGateway.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {feature === 'tpv' ? 'Third Party Validation' :
                       feature === 'seamless' ? 'Seamless/Non Seamless' :
                       feature === 'payins' ? 'Payment Accept' :
                       feature === 'payouts' ? 'Payment Transfers' :
                       'Enable/Disable'}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleFeatureToggle(feature as keyof PSPFeatures)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      enabled ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payins Credentials */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Payins Credentials</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <InformationCircleIcon className="w-4 h-4" />
                <span>PCI-DSS aligned • Encrypted</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              We store credentials encrypted-at-rest. Rotate from here any time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL (set in PSP)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedGateway.credentials.webhookUrl}
                      onChange={(e) => handleCredentialChange('webhookUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedGateway.credentials.webhookUrl)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Api Key
                  </label>
                  <input
                    type="text"
                    value={selectedGateway.credentials.apiKey}
                    onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MID
                  </label>
                  <input
                    type="text"
                    value={selectedGateway.credentials.mid}
                    onChange={(e) => handleCredentialChange('mid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPs To Whitelist (comma separated - whitelist in PSP)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedGateway.credentials.ipsToWhitelist}
                      onChange={(e) => handleCredentialChange('ipsToWhitelist', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedGateway.credentials.ipsToWhitelist)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Api Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showApiSecret ? 'text' : 'password'}
                      value={selectedGateway.credentials.apiSecret}
                      onChange={(e) => handleCredentialChange('apiSecret', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiSecret ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={selectedGateway.credentials.priority}
                    onChange={(e) => handleCredentialChange('priority', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Tip: Click Validate to test credentials and webhook handshake.</span>
                <span className="text-sm text-gray-500">
                  Status: {selectedGateway.credentials.validationStatus === 'validated' ? 'Validated' :
                          selectedGateway.credentials.validationStatus === 'failed' ? 'Validation Failed' :
                          'Pending validation'}
                </span>
              </div>
              <button
                onClick={validateCredentials}
                disabled={validating}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {validating ? (
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Validating...</span>
                  </div>
                ) : (
                  'Validate'
                )}
              </button>
            </div>
          </div>

          {/* Countries/Currencies */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Countries/Currencies</h2>
            <div className="flex items-center space-x-2 mb-4">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Selected Currencies</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Please search below for the country to select.</p>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => toggleCurrency(currency.code)}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCurrencies.includes(currency.code)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-medium text-gray-900">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name} ({currency.country})</div>
                  </div>
                  {selectedCurrencies.includes(currency.code) && (
                    <CheckIcon className="w-5 h-5 text-teal-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Credential Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Rotate secrets quarterly and re-validate
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Whitelist our IPs at your PSP to avoid webhook drops
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Use sandbox keys in staging workspaces
              </li>
            </ul>
          </div>

          {/* Go-live Checklist */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Go-live checklist</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-medium text-gray-900">Enter & validate credentials</div>
                  <div className="text-sm text-gray-500">Key ID / Secret • Webhook</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-medium text-gray-900">Enable payment methods</div>
                  <div className="text-sm text-gray-500">Toggle rails & sub-rails</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-medium text-gray-900">Set supported currencies</div>
                  <div className="text-sm text-gray-500">Match PSP capabilities</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                  4
                </span>
                <div>
                  <div className="font-medium text-gray-900">Save configuration</div>
                  <div className="text-sm text-gray-500">Applies instantly to routing rules</div>
                </div>
              </li>
            </ol>

            <button
              onClick={saveConfiguration}
              disabled={saving}
              className="w-full mt-6 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Changes are saved to your workspace and used by orchestration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGConfigurationPage;
