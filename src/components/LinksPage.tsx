import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiDownload, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CreatePaymentLinkModal, { type CreatePaymentLinkPayload } from './CreatePaymentLinkModal';

interface PaymentLink {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  amount: number;
  receiptId: string | null;
  expiryStatus: 'Active' | 'Expired';
  paymentStatus: 'Paid' | 'Pending' | 'Dropped';
  createdAt: string;
}

const PaymentLinksPage = () => {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load dummy data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy data
        const dummyData: PaymentLink[] = [
          {
            id: 1,
            name: 'Ramneek',
            email: 'md@motifravels.in',
            phone: '999904121',
            amount: 1000,
            receiptId: '12100',
            expiryStatus: 'Active',
            paymentStatus: 'Dropped',
            createdAt: '2023-12-01'
          },
          {
            id: 2,
            name: 'Amit Sharma',
            email: 'amit@example.com',
            phone: '9876543210',
            amount: 2500,
            receiptId: '12101',
            expiryStatus: 'Active',
            paymentStatus: 'Paid',
            createdAt: '2023-12-05'
          },
          {
            id: 3,
            name: 'Priya Patel',
            email: null,
            phone: '8765432109',
            amount: 1500,
            receiptId: null,
            expiryStatus: 'Expired',
            paymentStatus: 'Pending',
            createdAt: '2023-11-20'
          },
        ];

        setPaymentLinks(dummyData);
      } catch (error) {
        console.error('Error loading data:', error);
        setPaymentLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLinks = paymentLinks?.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.email && link.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (link.phone && link.phone.includes(searchQuery))
  ) || null;

  const handleCreateLink = (payload: CreatePaymentLinkPayload) => {
    const newItem: PaymentLink = {
      id: (paymentLinks?.[0]?.id || 0) + Math.floor(Math.random() * 1000) + 1,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      amount: payload.amount,
      receiptId: payload.receiptId,
      expiryStatus: payload.expiry ? 'Active' : 'Active',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setPaymentLinks(prev => (prev ? [newItem, ...prev] : [newItem]));
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Links</h1>
            <p className="text-gray-600">Manage and Create Payment Links</p>
          </div>

          {/* Filters and Pagination */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['Today', 'Last 7 days', '15 days', '30 days'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-teal-500 hover:bg-teal-50 rounded-md whitespace-nowrap"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>


        {/* Search and Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus className="mr-2" />
              Add Payment Link
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <FiDownload className="mr-2" />
              Bulk Create
            </motion.button>
          </div>
        </div>

        {paymentLinks && filteredLinks && filteredLinks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Table Section */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt Id</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((link, index) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{link.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        INR {link.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.receiptId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${link.expiryStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {link.expiryStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${link.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          link.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {link.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Payment Links Found</h2>
              <p className="text-gray-600 mb-6">Create your first payment link to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus className="mr-2" />
                Create Payment Link
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <CreatePaymentLinkModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateLink}
      />
    </>
  );
};

export default PaymentLinksPage;