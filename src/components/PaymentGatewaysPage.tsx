import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentGatewayCard from './PaymentGatewayCard';
import axios from 'axios';
import baseURL from '../API/baseUrl';
import { 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  CreditCard, 
  BarChart3, 
  Activity,
  DollarSign,
  Shield
} from 'lucide-react';

interface ApiGateway {
  gatewayId: string;
  name: string;
  created_at: string;
  status?: string;
  transactionCount?: number;
  successRate?: number;
}

interface ApiResponse {
  status: string;
  data: ApiGateway[];
}

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  status?: string;
  transactionCount?: number;
  successRate?: number;
  createdAt?: string;
}

const PaymentGatewaysPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  useEffect(() => {
    if (paymentGateways.length > 0) {
      const activeGateways = paymentGateways.filter(gateway => gateway.status === 'active').length;
      const totalTransactions = paymentGateways.reduce((sum, gateway) => 
        sum + (gateway.transactionCount || 0), 0
      );
      
      setStats({
        total: paymentGateways.length,
        active: activeGateways,
        inactive: paymentGateways.length - activeGateways,
        totalTransactions
      });
    }
  }, [paymentGateways]);

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');

      const response = await axios.get<ApiResponse>(`${baseURL}/pg/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        // Transform API data to match our simplified PaymentGateway interface
        const transformedData: PaymentGateway[] = response.data.data.map(apiGateway => {
          return {
            id: apiGateway.gatewayId,
            name: apiGateway.name,
            logo: `./src/assets/gateway/${apiGateway.name.toLowerCase()}.png`,
            status: apiGateway.status || 'active',
            transactionCount: apiGateway.transactionCount || 0,
            successRate: apiGateway.successRate || 0,
            createdAt: apiGateway.created_at
          };
        });
        
        setPaymentGateways(transformedData);
      } else {
        setError('Failed to fetch payment gateways');
      }
    } catch (err) {
      setError('Error fetching payment gateways. Please check your connection and try again.');
      console.error('Error fetching payment gateways:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-8 h-8" />
              Payment Gateways
            </h1>
            <p className="text-gray-600 mt-2">Manage your payment integration services</p>
          </div>
          <Link
            to="/payment-gateways/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Gateway
          </Link>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading payment gateways...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-8 h-8" />
              Payment Gateways
            </h1>
            <p className="text-gray-600 mt-2">Manage your payment integration services</p>
          </div>
          <Link
            to="/payment-gateways/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Gateway
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Unable to load payment gateways</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={fetchPaymentGateways}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Payment Gateways
          </h1>
          <p className="text-gray-600 mt-2">Manage your payment integration services</p>
        </div>
        <Link
          to="/payment-gateways/new"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Gateway
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gateways</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</h3>
            </div>
            <div className="bg-teal-50 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Gateways</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.active}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalTransactions.toLocaleString()}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Status</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">Verified</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gateway List Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Configured Gateways
        </h2>
        <button 
          onClick={fetchPaymentGateways}
          className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Grid of gateways */}
      {paymentGateways.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentGateways.map((gateway) => (
            <PaymentGatewayCard
              key={gateway.id}
              gateway={gateway}
              onEdit={() => navigate(`/payment-gateways/${gateway.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No payment gateways configured</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first payment gateway</p>
          <Link
            to="/payment-gateways/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Your First Gateway
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewaysPage;