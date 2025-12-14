import { LoginForm } from '@/components/organisms/LoginForm';
import { AuthLayout } from '@/components/templates/AuthLayout';

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Enter your details to access your account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
