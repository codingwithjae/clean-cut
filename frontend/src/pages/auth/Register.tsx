import { RegisterForm } from '@/components/organisms/RegisterForm';
import { AuthLayout } from '@/components/templates/AuthLayout';

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start shortening links and tracking stats today"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
