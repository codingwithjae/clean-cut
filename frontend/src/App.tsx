import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { AuthCallback } from './pages/auth/Callback';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';
import ApiKeysPage from '@/pages/dashboard/ApiKeys';
import LinksPage from '@/pages/dashboard/Links';
import DashboardOverview from '@/pages/dashboard/Overview';
import DevelopersPage from '@/pages/public/Developers';
import LandingPage from '@/pages/public/Landing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<LandingPage />} /> { }
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
