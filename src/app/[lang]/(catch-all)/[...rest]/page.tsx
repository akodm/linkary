import { Metadata } from 'next';
import NotFoundLayout from '@/components/not-found/Layout';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CatchAllPage() {
  return <NotFoundLayout />;
}
