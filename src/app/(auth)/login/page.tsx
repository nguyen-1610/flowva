import LoginForm from '@/frontend/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Flowva',
  description: 'Sign in to your Flowva account',
};

export default function LoginPage() {
  return <LoginForm />;
}
