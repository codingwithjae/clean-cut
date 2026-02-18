import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { type ResetPasswordFormData, resetPasswordSchema } from '@/schemas/auth.schema';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    setValue('token', token);
  }, [setValue, token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await AuthService.resetPassword(data);
      const successMessage = response.message || 'Password reset successfully. You can now log in.';
      setStatus('success');
      setMessage(successMessage);
      toast.success(successMessage);
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'Password reset failed. Your link may be invalid or expired.',
      );
      setStatus('error');
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasToken = token.length > 0;

  return (
    <AuthLayout title="Reset your password" subtitle="Create a new password for your account">
      {status === 'success' ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
            <FaCheckCircle className="h-10 w-10" />
          </div>
          <p className="rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-2 text-sm text-neon-green">
            {message}
          </p>
          <Link to="/login" className="block">
            <Button className="w-full font-bold">Continue to Sign in</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register('token')} />

          {!hasToken && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              Missing reset token. Request a new password reset link.
            </p>
          )}

          {status === 'error' && message && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {message}
            </p>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={<FaLock className="h-4 w-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={<FaLock className="h-4 w-4" />}
            error={errors.confirmPassword?.message || errors.token?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            className="w-full font-bold"
            isLoading={isLoading}
            disabled={!hasToken}
          >
            Reset Password
          </Button>

          <p className="text-center text-sm text-text-secondary">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 font-semibold text-cyber-blue hover:text-cyber-blue-hover transition-colors"
            >
              <FaArrowLeft className="h-3 w-3" />
              Request a new reset link
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
