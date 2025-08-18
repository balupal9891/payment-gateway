// main.tsx or index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import SuccessPage from './components/successPage.tsx'
import CancelledPage from './components/CancelPage.tsx'
import PaymentForm from './components/PayUCheckout.tsx'
import DashboardHome from './components/DashboardHome.tsx'
import TransactionsPage from './components/TransactionsPage.tsx'
import SettlementsPage from './components/SettlementsPage.tsx'
import UsersPage from './components/UsersPage.tsx'
import SettingsPage from './components/SettingsPage.tsx'
import EditUserPage from './components/EditUserPage.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import WebhooksPage from './components/WebhooksPage.tsx';
import NetworkFirewallPage from './components/NetworkFirewallPage.tsx';
import PGManagerPage from './components/PGManagerPage.tsx'
import PGCreatePage from './components/PGCreatePage.tsx'
import { ModeProvider } from './contexts/ModeContext.tsx'
import PaymentLinks from './components/LinksPage.tsx'
import PaymentGatewaysPage from './components/PaymentGatewaysPage';
import PaymentGatewayForm from './components/PaymentGatewayForm';
import Layout from './components/Layout';
// import PayUCheckoutPage from './components/PayUCheckout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<EditUserPage />} />
          <Route path="/settings/notifications" element={<NotificationsPage />} />
          <Route path="/settings/webhooks" element={<WebhooksPage />} />
          <Route path="/settings/network-firewall" element={<NetworkFirewallPage />} />
          
          <Route path="/settings/pg" element={<PGManagerPage />} />
          <Route path="/pg/create" element={<PGCreatePage />} />
          <Route path="/links" element={<PaymentLinks />} />
          <Route path="/payment" element={<App />} />
          <Route path="/payment-gateways" element={<Layout><PaymentGatewaysPage /></Layout>} />
          <Route path="/payment-gateways/new" element={<Layout><PaymentGatewayForm /></Layout>} />
          <Route path="/payment-gateways/:id/edit" element={<Layout><PaymentGatewayForm /></Layout>} />
          <Route path="/payu" element={<PaymentForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelledPage />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </ModeProvider>
  </StrictMode>,
)
