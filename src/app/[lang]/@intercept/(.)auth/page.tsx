import AsideForm from '@/components/auth/AsideForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function InterceptAuthPage() {
  return <AsideForm />;
}
