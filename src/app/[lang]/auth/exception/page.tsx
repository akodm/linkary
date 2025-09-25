import { Metadata } from 'next';
import ErrorLayout from '@/components/error/Layout';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthExceptionPage() {
  return <ErrorLayout />;
}
