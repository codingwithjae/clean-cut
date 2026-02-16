import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { type ChangePasswordFormData, changePasswordSchema } from '@/schemas/auth.schema';

const AccountPage = () => {
  const navigate = useNavigate();
  const { logout, isLoading: isAuthLoading } = useAuth();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      await AuthService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update password'));
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    setIsDeleteLoading(true);
    try {
      await AuthService.deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete account'));
    } finally {
      setIsDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isAuthLoading) {
    return (
      <DashboardLayout>
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-display font-bold text-white">Account</h1>
            <p className="text-text-secondary">Loading account data...</p>
          </header>
          <Card className="space-y-4">
            <p className="text-sm text-text-secondary">Please wait a moment.</p>
          </Card>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-white">Account</h1>
          <p className="text-text-secondary">Update your password and manage account access</p>
        </header>

        <Card className="space-y-6">
          <section>
            <h2 className="text-lg font-medium text-white mb-1">Change Password</h2>
            <p className="text-sm text-text-secondary mb-4">
              Use a strong password with at least 8 characters.
            </p>

            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                icon={<FaLock className="h-4 w-4" />}
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                icon={<FaLock className="h-4 w-4" />}
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                icon={<FaLock className="h-4 w-4" />}
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}
              />

              <div className="pt-2">
                <Button type="submit" isLoading={isPasswordLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </section>

          <section className="pt-6 border-t border-code-gray/30">
            <h2 className="text-sm font-medium text-white mb-2">Danger Zone</h2>
            <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg gap-4">
              <div>
                <p className="text-sm font-medium text-red-400">Delete Account</p>
                <p className="text-xs text-text-secondary mt-1">
                  Permanently remove your account and all your data.
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                <FaTrashAlt className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </section>
        </Card>
      </section>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteAccount}
        title="Delete Account"
        message="Are you sure? This action is permanent and cannot be undone."
        confirmText="Delete"
        isLoading={isDeleteLoading}
      />
    </DashboardLayout>
  );
};

export default AccountPage;
