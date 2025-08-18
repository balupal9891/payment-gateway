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
  TruckIcon
} from '@heroicons/react/24/outline';
import Layout from './Layout';
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
  id: string;
  status: 'success' | 'failed' | 'dropped' | 'pending';
  amount: number;
  date: string;
  time: string;
  paymentMethod: 'card' | 'netbanking' | 'upi' | 'wallet' | 'cod';
  currency: 'INR' | 'USD';
};

type DashboardData = {
  totalTransactions: number;
  successfulTransactions: number;
  totalGTV: number;
  totalRefunds: number;
  conversionRate: number;
  activeGateway: string;
  transactionVolume: {
    date: string;
    card: number;
    netbanking: number;
    upi: number;
    wallet: number;
    cod: number;
  }[];
  recentTransactions: Transaction[];
};

// Mock data with more realistic values
const dashboardData: DashboardData = {
  totalTransactions: 1242,
  successfulTransactions: 1028,
  totalGTV: 584200,
  totalRefunds: 32450,
  conversionRate: 86.668188,
  activeGateway: "Razorpay",
  transactionVolume: [
    { date: "2023-07-01", card: 12000, netbanking: 8000, upi: 25000, wallet: 5000, cod: 3000 },
    { date: "2023-07-02", card: 15000, netbanking: 9000, upi: 28000, wallet: 6000, cod: 3500 },
    { date: "2023-07-03", card: 18000, netbanking: 12000, upi: 32000, wallet: 7000, cod: 4000 },
    { date: "2023-07-04", card: 14000, netbanking: 10000, upi: 27000, wallet: 5500, cod: 3200 },
    { date: "2023-07-05", card: 16000, netbanking: 11000, upi: 30000, wallet: 6500, cod: 3800 },
    { date: "2023-07-06", card: 20000, netbanking: 15000, upi: 35000, wallet: 8000, cod: 4500 },
    { date: "2023-07-07", card: 22000, netbanking: 18000, upi: 40000, wallet: 9000, cod: 5000 },
  ],
  recentTransactions: [
    {
      id: "791373446846577644",
      status: "success",
      amount: 1000,
      date: "31/07/2023",
      time: "02:43:40",
      paymentMethod: "card",
      currency: "INR"
    },
    {
      id: "791373446846577645",
      status: "failed",
      amount: 2500,
      date: "31/07/2023",
      time: "03:15:22",
      paymentMethod: "upi",
      currency: "INR"
    },
    {
      id: "791373446846577646",
      status: "pending",
      amount: 1800,
      date: "30/07/2023",
      time: "14:32:10",
      paymentMethod: "netbanking",
      currency: "INR"
    },
    {
      id: "791373446846577647",
      status: "success",
      amount: 3500,
      date: "30/07/2023",
      time: "11:45:33",
      paymentMethod: "wallet",
      currency: "INR"
    },
    {
      id: "791373446846577648",
      status: "dropped",
      amount: 4200,
      date: "29/07/2023",
      time: "09:12:55",
      paymentMethod: "cod",
      currency: "INR"
    },
  ]
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
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    dropped: {
      color: 'text-red-800',
      bg: 'bg-red-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    },
    pending: {
      color: 'text-yellow-800',
      bg: 'bg-yellow-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, { icon: React.ReactNode; color: string }> = {
    card: { icon: <CreditCardIcon className="w-5 h-5" />, color: 'text-blue-600' },
    netbanking: { icon: <BanknotesIcon className="w-5 h-5" />, color: 'text-green-600' },
    upi: { icon: <QrCodeIcon className="w-5 h-5" />, color: 'text-purple-600' },
    wallet: { icon: <WalletIcon className="w-5 h-5" />, color: 'text-teal-600' },
    cod: { icon: <TruckIcon className="w-5 h-5" />, color: 'text-orange-600' }
  };

  return icons[method] || { icon: <CurrencyDollarIcon className="w-5 h-5" />, color: 'text-gray-600' };
};

const DashboardHome: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('30 days');
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Prepare data for charts
  const transactionVolumeData = {
    labels: dashboardData.transactionVolume.map(item =>
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Card',
        data: dashboardData.transactionVolume.map(item => item.card),
        backgroundColor: '#1e40af',
        borderRadius: 4
      },
      {
        label: 'Net Banking',
        data: dashboardData.transactionVolume.map(item => item.netbanking),
        backgroundColor: '#16a34a',
        borderRadius: 4
      },
      {
        label: 'UPI',
        data: dashboardData.transactionVolume.map(item => item.upi),
        backgroundColor: '#9333ea',
        borderRadius: 4
      },
      {
        label: 'Wallet',
        data: dashboardData.transactionVolume.map(item => item.wallet),
        backgroundColor: '#0d9488',
        borderRadius: 4
      },
      {
        label: 'COD',
        data: dashboardData.transactionVolume.map(item => item.cod),
        backgroundColor: '#c026d3',
        borderRadius: 4
      }
    ]
  };

  const paymentMethodDistribution = {
    labels: ['Card', 'Net Banking', 'UPI', 'Wallet', 'COD'],
    datasets: [
      {
        data: [
          dashboardData.transactionVolume.reduce((sum, item) => sum + item.card, 0),
          dashboardData.transactionVolume.reduce((sum, item) => sum + item.netbanking, 0),
          dashboardData.transactionVolume.reduce((sum, item) => sum + item.upi, 0),
          dashboardData.transactionVolume.reduce((sum, item) => sum + item.wallet, 0),
          dashboardData.transactionVolume.reduce((sum, item) => sum + item.cod, 0)
        ],
        backgroundColor: [
          '#1e40af',
          '#16a34a',
          '#9333ea',
          '#0d9488',
          '#c026d3'
        ],
        borderWidth: 1
      }
    ]
  };

  const successRate = (dashboardData.successfulTransactions / dashboardData.totalTransactions) * 100;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
              (Showing data of past 30 days) - Conversion: 1 USD = {dashboardData.conversionRate} INR
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard
                icon={<DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />}
                value={dashboardData.totalTransactions.toString()}
                label="Total Transactions"
                iconBg="bg-blue-100"
                trend="up"
                trendValue="12%"
              />

              <StatCard
                icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
                value={dashboardData.successfulTransactions.toString()}
                label="Successful Transactions"
                iconBg="bg-green-100"
                trend={successRate > 80 ? 'up' : 'down'}
                trendValue={`${successRate.toFixed(1)}%`}
              />

              <StatCard
                icon={<CurrencyDollarIcon className="w-6 h-6 text-purple-600" />}
                value={formatCurrency(dashboardData.totalGTV)}
                label="Total GTV"
                iconBg="bg-purple-100"
                trend="up"
                trendValue="18%"
              />

              <StatCard
                icon={<ArrowPathIcon className="w-6 h-6 text-orange-600" />}
                value={formatCurrency(dashboardData.totalRefunds)}
                label="Total Refunds"
                iconBg="bg-orange-100"
                trend="down"
                trendValue="5%"
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
                  <p className="text-xl font-bold text-gray-900">{dashboardData.activeGateway}</p>
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
              {['Today', 'Last 7 days', '15 days', '30 days'].map((filter) => (
                <motion.button
                  key={filter}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeFilter === filter.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  onClick={() => setActiveFilter(filter.toLowerCase())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {/* Payment Method Distribution */}
            <div className="h-48 mb-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="h-full">
                  <Line
                    data={{
                      labels: paymentMethodDistribution.labels,
                      datasets: [{
                        ...paymentMethodDistribution.datasets[0],
                        type: 'line' as const,
                        borderColor: paymentMethodDistribution.datasets[0].backgroundColor,
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
                </div>
                <div className="flex flex-col justify-between">
                  {paymentMethodDistribution.labels.map((label, index) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: paymentMethodDistribution.datasets[0].backgroundColor[index]
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalGTV)}</p>
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
              {dashboardData.recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TransactionCard transaction={transaction} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
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
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  const { icon, color } = getPaymentMethodIcon(transaction.paymentMethod);

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 bg-opacity-20 ${color.replace('text-', 'bg-')} rounded-full flex items-center justify-center`}>
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          { className: `w-5 h-5 ${color}` }
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">ID: {transaction.id}</p>
        <div className="flex items-center space-x-2 mt-1">
          {getStatusBadge(transaction.status)}
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {transaction.date} • {transaction.time}
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;