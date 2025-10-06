// main.tsx or index.tsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import SuccessPage from './components/checkout/successPage.tsx';
import CancelledPage from './components/checkout/CancelPage.tsx';
import PaymentForm from './components/checkout/PayUCheckout.tsx';
import DashboardHome from './components/DashboardHome.tsx';
import TransactionsPage from './components/TransactionsPage.tsx';
import SettlementsPage from './components/SettlementsPage.tsx';
import UsersPage from './components/UsersPage.tsx';
import SettingsPage from './components/SettingsPage.tsx';
import EditUserPage from './components/EditUserPage.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import WebhooksPage from './components/WebhooksPage.tsx';
import PGManagerPage from './components/PGManagerPage.tsx';
import VendorCredentialsPage from './components/PGCreatePage.tsx';
import PaymentLinks from './components/LinksPage.tsx';
import PaymentGatewaysPage from './components/PaymentGatewaysPage';
import PaymentGatewayForm from './components/PaymentGatewayForm';
import Layout from './components/layout/Layout.tsx';
import NetworkFirewallPage from './components/NetworkFirewallPage.tsx';
import LoginPage from './components/auth/Login.tsx';
import SignupPage from './components/auth/Signup.tsx';
import NotFound from './components/NotFound.tsx';

import { Provider, useDispatch } from "react-redux";
import { store, type AppDispatch } from "./store/store";
import StripeCheckout from './components/checkout/StripeCheckout.tsx';
import VendorRegistration from './components/admin/vendor/VendorRegistration.tsx';
import VendorManagement from './components/admin/vendor/VendorManagement.tsx';
import ProtectedRoute from './utils/ProtectedRoute.tsx';
import VendorOnboarding from './components/vendor/vendorKycForm.tsx';
import { ToastContainer } from 'react-toastify';
import { validateAndFetchUser } from './store/slices/userSlice.ts';

function Startup() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(validateAndFetchUser());
  }, [dispatch]);

  return null; // invisible
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <Startup />


      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/payu" element={<PaymentForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelledPage />} />
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />

          {/* Protected routes */}
          <Route path='/admin' element={<Layout />}>

            <Route path="vendor-registration" element={<VendorRegistration />} />
            <Route path="vendors" element={<VendorManagement />} />
            {/* <Route path="/admin/vendor/registration" element={<VendorRegistration />} /> */}
          </Route>

          {/* Dashboard (protected) routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
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
            <Route path="/pg/create" element={<VendorCredentialsPage />} />
<Route path="/pg/update/:gatewayId" element={<VendorCredentialsPage />} />
            <Route path="/links" element={<PaymentLinks />} />
            <Route path="/payment-gateways" element={<PaymentGatewaysPage />} />
            <Route path="/payment-gateways/new" element={<PaymentGatewayForm />} />
            <Route path="/payment-gateways/:id" element={<PaymentGatewayForm />} />
          </Route>

          <Route path="/stripecheckout" element={<StripeCheckout />} />


          {/* 404 Not Found (optional) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

