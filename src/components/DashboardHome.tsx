import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  WalletIcon,
  TruckIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../API/baseUrl';
import { useUser } from '../store/slices/userSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types
type Transaction = {
  paymentId: string;
  paymentStatus: 'success' | 'failed' | 'dropped' | 'pending' | 'refund';
  amount: number;
  paymentSource: string;
  createdAt: string;
};

type GatewayUsage = {
  gateway: string;
  count: number;
  gatewayTotalAmount: number;
};

type DashboardPeriodData = {
  periodStart: string;
  periodEnd: string;
  totalTransactions: number;
  successfulTransactions: number;
  gtv: number;
  totalRefunds: number;
  gatewayUsage: GatewayUsage[] | null;
};

type Comparisons = {
  totalTransactionsGrowth: number;
  successfulTransactionsGrowth: number;
  gtvGrowth: number;
  totalRefundsGrowth: number;
};

type DashboardAPIResponse = {
  status: string;
  message: string;
  data: {
    summary: DashboardPeriodData[];
    recentTransactions: Transaction[];
    comparisons: Comparisons;
  };
};

// Date range options
const DATE_RANGES = {
  'Today': { days: 1, label: 'Today' },
  'Last 7 days': { days: 7, label: 'Last 7 days' },
  '15 days': { days: 15, label: '15 days' },
  '30 days': { days: 30, label: '30 days' },
  '3 months': { days: 90, label: '3 months' },
  '6 months': { days: 180, label: '6 months' },
  '1 year': { days: 365, label: '1 year' }
};

// Gateway colors for consistent visualization
const GATEWAY_COLORS = [
  '#1e40af', // blue
  '#16a34a', // green
  '#9333ea', // purple
  '#0d9488', // teal
  '#c026d3', // magenta
  '#ea580c', // orange
  '#dc2626', // red
  '#059669', // emerald
  '#7c3aed', // violet
  '#0891b2'  // cyan
];

// KYC Verification Component
const KYCVerification = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleCompleteKYC = () => {
    navigate('/vendor/onboarding');
  };

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <IdentificationIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Complete KYC Verification</h3>
            <p className="text-sm text-gray-600">
              Verify your identity to access all features and increase transaction limits.
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={handleCompleteKYC}
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 ${
            isMobile ? 'w-full mt-2' : ''
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Complete KYC</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Helper functions
const formatCurrency = (amount: number, currency: 'INR' | 'USD' = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const getDateRange = (days: number) => {
  const endDate = new Date();
  const startDate = new Date();
  
  // Set end date to end of today (exclusive)
  endDate.setDate(endDate.getDate() + 1);
  
  if (days === 0) {
    // Today - start is beginning of today
    startDate.setHours(0, 0, 0, 0);
  } else {
    // For other ranges, set start date to days ago at beginning of day
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    success: {
      color: 'text-green-800',
      bg: 'bg-green-100',
      icon: <CheckCircleIcon className="w-3 h-3" />
    },
    failed: {
      color: 'text-red-800',
      bg: 'bg-red-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    dropped: {
      color: 'text-red-800',
      bg: 'bg-red-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    },
    pending: {
      color: 'text-yellow-800',
      bg: 'bg-yellow-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    refund: {
      color: 'text-orange-800',
      bg: 'bg-orange-100',
      icon: <ArrowPathIcon className="w-3 h-3" />
    }
  };

  const { color, bg, icon } = statusMap[status] || { color: 'text-gray-800', bg: 'bg-gray-100', icon: null };

  return (
    <span className={`px-2 py-1 ${bg} ${color} text-xs rounded-full capitalize flex items-center space-x-1`}>
      {icon}
      <span>{status}</span>
    </span>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const DashboardHome: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Last 7 days');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardPeriodData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [comparisons, setComparisons] = useState<Comparisons | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });


  // Get vendorId from Redux (replace with your actual selector)
  const { user } = useUser();
  const vendorId = user?.vendorId;
  console.log( "inside",user.formStatus !== "COMPLETED");

  // Fetch dashboard data
  const fetchDashboardData = async (filter: string) => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = getDateRange(DATE_RANGES[filter as keyof typeof DATE_RANGES]?.days || 1);

      const requestBody = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        vendorId: vendorId
      };

      const response = await axios.post<DashboardAPIResponse>(
        `${baseURL}/dashboard/dashboard-summary`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setDashboardData(response.data.data.summary);
        setRecentTransactions(response.data.data.recentTransactions);
        setComparisons(response.data.data.comparisons);
      } else {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Dashboard API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(activeFilter);
  }, [activeFilter, vendorId]);

  // Calculate aggregated data
  const aggregatedData = React.useMemo(() => {
    const totals = dashboardData.reduce((acc, period) => ({
      totalTransactions: acc.totalTransactions + period.totalTransactions,
      successfulTransactions: acc.successfulTransactions + period.successfulTransactions,
      totalGTV: acc.totalGTV + period.gtv,
      totalRefunds: acc.totalRefunds + period.totalRefunds
    }), {
      totalTransactions: 0,
      successfulTransactions: 0,
      totalGTV: 0,
      totalRefunds: 0
    });

    // Aggregate gateway usage
    const gatewayMap = new Map<string, number>();
    dashboardData.forEach(period => {
      if (period.gatewayUsage) {
        period.gatewayUsage.forEach(gateway => {
          const existing = gatewayMap.get(gateway.gateway) || 0;
          gatewayMap.set(gateway.gateway, existing + gateway.gatewayTotalAmount);
        });
      }
    });

    return {
      ...totals,
      gatewayUsage: Array.from(gatewayMap.entries()).map(([gateway, amount]) => ({
        gateway,
        amount
      }))
    };
  }, [dashboardData]);

  // Prepare chart data for gateways
  const transactionVolumeData = React.useMemo(() => {
    const uniqueGateways = Array.from(new Set(
      dashboardData.flatMap(period => 
        period.gatewayUsage?.map(g => g.gateway) || []
      )
    ));

    const datasets = uniqueGateways.map((gateway, index) => ({
      label: gateway.charAt(0).toUpperCase() + gateway.slice(1),
      data: dashboardData.map(period => {
        const gatewayData = period.gatewayUsage?.find(g => g.gateway === gateway);
        return gatewayData ? gatewayData.gatewayTotalAmount : 0;
      }),
      backgroundColor: GATEWAY_COLORS[index % GATEWAY_COLORS.length],
      borderRadius: 4
    }));

    return {
      labels: dashboardData.map(period =>
        new Date(period.periodStart).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets
    };
  }, [dashboardData]);

  // Gateway distribution for the line chart
  const gatewayDistribution = React.useMemo(() => {
    const uniqueGateways = aggregatedData.gatewayUsage.map(g => g.gateway);
    const amounts = aggregatedData.gatewayUsage.map(g => g.amount);

    return {
      labels: uniqueGateways.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
      datasets: [{
        data: amounts,
        backgroundColor: uniqueGateways.map((_, index) => 
          GATEWAY_COLORS[index % GATEWAY_COLORS.length]
        ),
        borderColor: uniqueGateways.map((_, index) => 
          GATEWAY_COLORS[index % GATEWAY_COLORS.length]
        ),
        borderWidth: 2
      }]
    };
  }, [aggregatedData]);

  const successRate = aggregatedData.totalTransactions > 0 
    ? (aggregatedData.successfulTransactions / aggregatedData.totalTransactions) * 100 
    : 0;

  // Get most active gateway
  const mostActiveGateway = aggregatedData.gatewayUsage.length > 0 
    ? aggregatedData.gatewayUsage.reduce((prev, current) => 
        prev.amount > current.amount ? prev : current
      ).gateway 
    : 'N/A';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard data</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchDashboardData(activeFilter)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* KYC Verification Banner */}
      {user?.formStatus !== "COMPLETED" && <KYCVerification />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 pb-4 px-4 sm:px-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Track your Business Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Track your Business</h1>
            <p className="text-gray-600 mb-6">
              (Showing data of {activeFilter}) - Conversion: 1 USD = 86.67 INR
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard
                icon={<DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />}
                value={aggregatedData.totalTransactions.toString()}
                label="Total Transactions"
                iconBg="bg-blue-100"
                trend={comparisons?.totalTransactionsGrowth !== undefined ? (comparisons.totalTransactionsGrowth >= 0 ? 'up' : 'down') : 'up'}
                trendValue={comparisons?.totalTransactionsGrowth !== undefined ? `${Math.abs(comparisons.totalTransactionsGrowth)}%` : '0%'}
              />

              <StatCard
                icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
                value={aggregatedData.successfulTransactions.toString()}
                label="Successful Transactions"
                iconBg="bg-green-100"
                trend={comparisons?.successfulTransactionsGrowth !== undefined ? (comparisons.successfulTransactionsGrowth >= 0 ? 'up' : 'down') : 'up'}
                trendValue={comparisons?.successfulTransactionsGrowth !== undefined ? `${Math.abs(comparisons.successfulTransactionsGrowth)}%` : '0%'}
              />

              <StatCard
                icon={<CurrencyDollarIcon className="w-6 h-6 text-purple-600" />}
                value={formatCurrency(aggregatedData.totalGTV)}
                label="Total GTV"
                iconBg="bg-purple-100"
                trend={comparisons?.gtvGrowth !== undefined ? (comparisons.gtvGrowth >= 0 ? 'up' : 'down') : 'up'}
                trendValue={comparisons?.gtvGrowth !== undefined ? `${Math.abs(comparisons.gtvGrowth)}%` : '0%'}
              />

              <StatCard
                icon={<ArrowPathIcon className="w-6 h-6 text-orange-600" />}
                value={formatCurrency(aggregatedData.totalRefunds)}
                label="Total Refunds"
                iconBg="bg-orange-100"
                trend={comparisons?.totalRefundsGrowth !== undefined ? (comparisons.totalRefundsGrowth >= 0 ? 'up' : 'down') : 'down'}
                trendValue={comparisons?.totalRefundsGrowth !== undefined ? `${Math.abs(comparisons.totalRefundsGrowth)}%` : '0%'}
              />
            </div>

            {/* Most active payment gateway */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Most active payment gateway</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2 text-sm">Current active gateway</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">
                    {mostActiveGateway}
                  </p>
                </div>
                <motion.button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Check Now
                </motion.button>
              </div>
            </motion.div>

            {/* Total Transaction Volume */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Transaction Volume</h2>
              <div className="h-64">
                {transactionVolumeData.datasets.length > 0 && transactionVolumeData.datasets.some(dataset => 
                  dataset.data.some(value => value > 0)
                ) ? (
                  <Bar
                    data={transactionVolumeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              return formatCurrency(Number(value));
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No transaction data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Transaction Records */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Transaction Records</h2>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(DATE_RANGES).map((filter) => (
                <motion.button
                  key={filter}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {/* Gateway Distribution */}
            <div className="h-48 mb-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="h-full">
                  {gatewayDistribution.datasets[0].data.length > 0 && 
                  gatewayDistribution.datasets[0].data.some(value => value > 0) ? (
                    <Line
                      data={{
                        labels: gatewayDistribution.labels,
                        datasets: [{
                          ...gatewayDistribution.datasets[0],
                          type: 'line' as const,
                          borderColor: gatewayDistribution.datasets[0].backgroundColor,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          fill: true,
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            display: false
                          },
                          x: {
                            display: false
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-500">No data</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  {gatewayDistribution.labels.map((label, index) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: gatewayDistribution.datasets[0].backgroundColor[index]
                        }}
                      ></div>
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">TOTAL AMOUNT</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(aggregatedData.totalGTV)}</p>
            </div>
          </motion.div>

          {/* Recent Transaction */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>

            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.paymentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TransactionCard transaction={transaction} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No recent transactions</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Component for Stat Cards
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBg: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}> = ({ icon, value, label, iconBg, trend, trendValue }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
          {trend && trendValue && (
            <div className={`flex items-center text-xs mt-1 ${trendColor}`}>
              {trendIcon}
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Component for Transaction Cards
const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string }> = {
      card: { icon: <CreditCardIcon className="w-5 h-5" />, color: 'text-blue-600' },
      netbanking: { icon: <BanknotesIcon className="w-5 h-5" />, color: 'text-green-600' },
      upi: { icon: <QrCodeIcon className="w-5 h-5" />, color: 'text-purple-600' },
      wallet: { icon: <WalletIcon className="w-5 h-5" />, color: 'text-teal-600' },
      cod: { icon: <TruckIcon className="w-5 h-5" />, color: 'text-orange-600' },
      payu: { icon: <CurrencyDollarIcon className="w-5 h-5" />, color: 'text-indigo-600' },
      authorize: { icon: <CurrencyDollarIcon className="w-5 h-5" />, color: 'text-pink-600' }
    };

    return icons[method] || { icon: <CurrencyDollarIcon className="w-5 h-5" />, color: 'text-gray-600' };
  };

  const { icon, color } = getPaymentMethodIcon(transaction.paymentSource);

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 bg-opacity-20 ${color.replace('text-', 'bg-')} rounded-full flex items-center justify-center`}>
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          { className: `w-5 h-5 ${color}` }
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">ID: {transaction.paymentId}</p>
        <div className="flex items-center space-x-2 mt-1">
          {getStatusBadge(transaction.paymentStatus)}
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(transaction.amount)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(transaction.createdAt)} • {formatTime(transaction.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;