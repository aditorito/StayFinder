import { AuthLayout } from '../components/AuthLayout';
import { LogoHeader } from '../components/LogoHeader';
import { RegisterForm } from '../components/RegisterForm';

export const Register = () => {
  return (
    <AuthLayout>
      <LogoHeader />
      <RegisterForm />
    </AuthLayout>
  );
};
