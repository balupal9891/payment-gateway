import React from 'react';
import { Link } from 'react-router-dom';
import PaymentGatewayCard from './PaymentGatewayCard';

const PaymentGatewaysPage: React.FC = () => {
  // Mock data - replace with API call later
  const paymentGateways = [
    {
      id: 1,
      name: 'Stripe Payments',
      shortName: 'Stripe',
      identifier: 'stripe',
      status: 'active',
      isDefault: true,
      logo: './src/assets/gateway/stripe.png',
      type: 'credit_card',
    },
    {
      id: 2,
      name: 'PayU India',
      shortName: 'PayU',
      identifier: 'payu',
      status: 'inactive',
      isDefault: false,
      logo: './src/assets/gateway/payu.png',
      type: 'upi',
    },
    {
      id: 3,
      name: 'Razorpay',
      shortName: 'Razorpay',
      identifier: 'razorpay',
      status: 'maintenance',
      isDefault: false,
      logo: './src/assets/gateway/razorpay.png',
      type: 'wallet',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payment Gateways</h1>
        <Link
          to="/payment-gateways/new"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          Add New
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentGateways.map((gateway) => (
          <PaymentGatewayCard key={gateway.id} gateway={gateway} viewMode="cards" />
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewaysPage;
