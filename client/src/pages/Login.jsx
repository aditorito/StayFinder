
import { AuthLayout } from '../components/AuthLayout';
import { LogoHeader } from '../components/LogoHeader';
import { LoginForm } from '../components/LoginFrom';


// Main Login Page Component
export const Login = () => {
  return (
    <AuthLayout>
      <LogoHeader />
      <LoginForm />
    </AuthLayout>
  );
};

