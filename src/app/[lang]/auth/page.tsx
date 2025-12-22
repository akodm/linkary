import AuthLayout from '@/components/auth/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthPage() {
  return <AuthLayout />;
}
