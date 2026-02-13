import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthService } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { Button } from '@/components/atoms/Button';
import { Logo } from '@/components/atoms/Logo';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token');
        return;
      }

      try {
        const response = await AuthService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(getApiErrorMessage(error, 'Verification failed. The link may be expired.'));
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-6 text-white text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-12">
          <Logo />
        </div>

        <div className="bg-midnight-light border border-code-gray/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className={`absolute top-0 left-0 w-full h-1 opacity-50 ${
              status === 'success'
                ? 'bg-neon-green shadow-[0_0_15px_#39FF14]'
                : status === 'error'
                  ? 'bg-red-500 shadow-[0_0_15px_#EF4444]'
                  : 'bg-cyber-blue shadow-[0_0_15px_#00F0FF]'
            }`}
          />

          {status === 'loading' && (
            <div className="space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mx-auto w-16 h-16 text-cyber-blue"
              >
                <FaSpinner className="w-full h-full" />
              </motion.div>
              <h2 className="text-2xl font-display font-bold">Verifying your email...</h2>
              <p className="text-text-secondary">Please wait while we confirm your identity.</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="mx-auto w-20 h-20 text-neon-green bg-neon-green/10 rounded-full flex items-center justify-center">
                <FaCheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white">Verified!</h2>
              <p className="text-text-secondary text-lg">{message}</p>
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full h-12 text-lg">Continue to Login</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="mx-auto w-20 h-20 text-red-500 bg-red-500/10 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white">Whoops!</h2>
              <p className="text-text-secondary text-lg">{message}</p>
              <div className="pt-4 space-y-3">
                <Link to="/login">
                  <Button variant="secondary" className="w-full h-12 text-lg">
                    Back to Login
                  </Button>
                </Link>
                <p className="text-xs text-text-secondary">
                  If you think this is a mistake, please contact support.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <footer className="mt-12 text-xs text-text-secondary opacity-50">
        © 2026 Clean Cut Inc. All rights reserved.
      </footer>
    </div>
  );
};
