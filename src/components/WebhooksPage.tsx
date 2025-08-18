import React, { useState } from 'react';
import Layout from './Layout';
import { PlusIcon, ArrowUpIcon, EyeIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const WebhooksPage: React.FC = () => {
  const [webhooks] = useState([
    {
      id: 1,
      type: 'Payout_success, payout_pending, payout_failed',
      url: 'https://api.motifesim.com/api/payment/webhook'
    }
  ]);

  const handleCreateWebhook = () => {
    // Add your create webhook logic here
    console.log('Creating new webhook...');
  };

  const handleSendBulkWebhook = () => {
    // Add your bulk webhook logic here
    console.log('Sending bulk webhook...');
  };

  const handleViewWebhook = (id: number) => {
    console.log('Viewing webhook:', id);
  };

  const handleEditWebhook = (id: number) => {
    console.log('Editing webhook:', id);
  };

  const handleDeleteWebhook = (id: number) => {
    console.log('Deleting webhook:', id);
  };

  const handleResendWebhook = (id: number) => {
    console.log('Resending webhook:', id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/dashboard" className="text-gray-700 hover:text-teal-500 text-sm font-medium">
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <a href="/settings" className="text-gray-700 hover:text-teal-500 text-sm font-medium">
                      Settings
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-900 text-sm font-bold">Webhooks</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Webhooks</h1>
                <p className="text-gray-600 text-lg">
                  You can specify a webhook to receive data from the specified events to your server.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCreateWebhook}
                  className="inline-flex items-center px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Webhook
                </button>
                <button
                  onClick={handleSendBulkWebhook}
                  className="inline-flex items-center px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm"
                >
                  <ArrowUpIcon className="w-5 h-5 mr-2" />
                  Send Bulk Webhook
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Webhooks Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {webhooks.map((webhook) => (
                    <tr key={webhook.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {webhook.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {webhook.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {webhook.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                                                     <button
                             onClick={() => handleViewWebhook(webhook.id)}
                             className="p-1 text-gray-400 hover:text-teal-500 transition-colors"
                             title="View"
                           >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditWebhook(webhook.id)}
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResendWebhook(webhook.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Re-send/Retry"
                          >
                            <ArrowPathIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    disabled
                    className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
                  >
                    Prev
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  Page 1 of 1
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled
                    className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebhooksPage;

