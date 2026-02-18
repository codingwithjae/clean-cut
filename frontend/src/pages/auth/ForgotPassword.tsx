import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { type ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/auth.schema';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.forgotPassword(data.email);
      const message = response.message || 'If that email exists, we sent a password reset link.';
      setSuccessMessage(message);
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to send password reset email.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={<MdEmail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {successMessage && (
          <p className="rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-2 text-sm text-neon-green">
            {successMessage}
          </p>
        )}

        <Button type="submit" className="w-full font-bold" isLoading={isLoading}>
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-text-secondary">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-semibold text-cyber-blue hover:text-cyber-blue-hover transition-colors"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back to Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
