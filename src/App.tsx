import { useState } from 'react';
import StripeCheckout from './components/StripeCheckout';
import PaymentGatewayForm from './components/PaymentGatewayForm';
// import GatewaySelector from './components/GatewaySelector';
// import PaymentForm from './components/PaymentForm';
// import TransactionsTable from './components/TransactionTable';
// import StatsOverview from './components/StatsOverview';

// export type Gateway = 'stripe' | 'payu' | 'razorpay';

export default function App() {
  // const [activeGateway, setActiveGateway] = useState<Gateway>('stripe');
  // const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  return (
    <Routes>
      {/* ... other routes ... */}
      <Route path="/payment-gateways/new" element={<PaymentGatewayForm />} />
      <Route path="/payment-gateways/:id/edit" element={<PaymentGatewayForm />} />
    </Routes>
  );
}

// type GatewayStatusCardProps = {
//   name: string;
//   status: 'active' | 'inactive' | 'maintenance';
//   lastSync: string;
// };

// function GatewayStatusCard({ name, status, lastSync }: GatewayStatusCardProps) {
//   const statusColors = {
//     active: 'bg-green-100 text-green-800',
//     inactive: 'bg-red-100 text-red-800',
//     maintenance: 'bg-yellow-100 text-yellow-800',
//   };

//   return (
//     <div className="flex items-center justify-between p-3 border rounded-lg">
//       <div className="flex items-center space-x-3">
//         <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
//           {status.toUpperCase()}
//         </div>
//         <span className="font-medium">{name}</span>
//       </div>
//       <span className="text-sm text-gray-500">Synced {lastSync}</span>
//     </div>
//   );
// }