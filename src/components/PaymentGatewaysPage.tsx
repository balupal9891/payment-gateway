import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentGatewayCard from './PaymentGatewayCard';

// Extended Payment Gateway type
interface PaymentGateway {
  id: number;
  name: string;
  shortName: string;
  identifier: string;
  status: 'active' | 'inactive' | 'maintenance';
  isDefault: boolean;
  logo?: string;
  type: string;
  description: string;
  website: string;
  primaryCountry: string;
  supportedCountries: string[];
  supportedPaymentMethods: string[];
  features: string[];
  sandbox: {
    apiKey: string;
    secretKey: string;
    endpoints: {
      auth: string;
      payments: string;
      refunds: string;
      webhook: string;
    };
  };
  production: {
    apiKey: string;
    secretKey: string;
    endpoints: {
      auth: string;
      payments: string;
      refunds: string;
      webhook: string;
    };
  };
  isLive: boolean;
  settlementPeriod: string;
  feeStructure: {
    percentage: number;
    fixedFee: number;
    chargebackFee: number;
  };
}

const PaymentGatewaysPage: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - replace with API call later
  const paymentGateways: PaymentGateway[] = [
    {
      id: 1,
      name: 'Stripe Payments',
      shortName: 'Stripe',
      identifier: 'stripe',
      status: 'active',
      isDefault: true,
      logo: './src/assets/gateway/stripe.png',
      type: 'credit_card',
      description: 'Online payment processing for internet businesses',
      website: 'https://stripe.com',
      primaryCountry: 'US',
      supportedCountries: ['US', 'GB', 'CA', 'AU', 'JP'],
      supportedPaymentMethods: ['credit_card', 'debit_card', 'bank_transfer'],
      features: ['3ds', 'recurring_payments', 'tokenization'],
      sandbox: {
        apiKey: 'pk_test_123',
        secretKey: 'sk_test_123',
        endpoints: {
          auth: 'https://api.sandbox.stripe.com/auth',
          payments: 'https://api.sandbox.stripe.com/payments',
          refunds: 'https://api.sandbox.stripe.com/refunds',
          webhook: 'https://api.sandbox.stripe.com/webhook',
        },
      },
      production: {
        apiKey: '',
        secretKey: '',
        endpoints: {
          auth: 'https://api.stripe.com/auth',
          payments: 'https://api.stripe.com/payments',
          refunds: 'https://api.stripe.com/refunds',
          webhook: 'https://api.stripe.com/webhook',
        },
      },
      isLive: false,
      settlementPeriod: 'T+2',
      feeStructure: { percentage: 2.9, fixedFee: 0.3, chargebackFee: 15 },
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
      description: 'Popular Indian payment gateway',
      website: 'https://payu.in',
      primaryCountry: 'IN',
      supportedCountries: ['IN'],
      supportedPaymentMethods: ['upi', 'netbanking', 'cards'],
      features: ['refunds', 'settlement_reports'],
      sandbox: {
        apiKey: '',
        secretKey: '',
        endpoints: { auth: '', payments: '', refunds: '', webhook: '' },
      },
      production: {
        apiKey: '',
        secretKey: '',
        endpoints: { auth: '', payments: '', refunds: '', webhook: '' },
      },
      isLive: false,
      settlementPeriod: 'T+1',
      feeStructure: { percentage: 2.0, fixedFee: 0.0, chargebackFee: 10 },
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
      description: 'Modern Indian payments platform',
      website: 'https://razorpay.com',
      primaryCountry: 'IN',
      supportedCountries: ['IN'],
      supportedPaymentMethods: ['upi', 'wallets', 'cards'],
      features: ['subscriptions', 'webhooks', 'settlements'],
      sandbox: {
        apiKey: '',
        secretKey: '',
        endpoints: { auth: '', payments: '', refunds: '', webhook: '' },
      },
      production: {
        apiKey: '',
        secretKey: '',
        endpoints: { auth: '', payments: '', refunds: '', webhook: '' },
      },
      isLive: false,
      settlementPeriod: 'T+2',
      feeStructure: { percentage: 2.5, fixedFee: 0.0, chargebackFee: 20 },
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

      {/* Grid of gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentGateways.map((gateway) => (
          <PaymentGatewayCard
            key={gateway.id}
            gateway={gateway}
            viewMode="cards"
            onEdit={() => navigate(`/payment-gateways/${gateway.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewaysPage;
