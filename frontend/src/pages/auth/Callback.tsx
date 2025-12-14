import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        handleGoogleCallback(token, {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        });
        navigate('/dashboard');
      } catch (_error) {
        toast.error('Invalid token received');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [token, navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
      <p className="text-white font-display">Completing login...</p>
    </div>
  );
};
