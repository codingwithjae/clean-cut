import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { SeoManager } from '@/shared/seo/SeoManager';
import { AuthCallback } from './pages/auth/Callback';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ResetPasswordPage from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';
import AccountPage from '@/pages/dashboard/Account';
import ApiKeysPage from '@/pages/dashboard/ApiKeys';
import LinksPage from '@/pages/dashboard/Links';
import DashboardOverview from '@/pages/dashboard/Overview';
import DevelopersPage from '@/pages/public/Developers';
import LandingPage from '@/pages/public/Landing';
import NotFound from '@/pages/public/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <SeoManager />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<LandingPage />} /> {}
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/links"
              element={
                <ProtectedRoute>
                  <LinksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/api"
              element={
                <ProtectedRoute>
                  <ApiKeysPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            theme="dark"
            toastClassName="bg-midnight-light border border-code-gray text-white"
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
