import UserLayout from '@/components/user/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserPage() {
  return <UserLayout />;
}
