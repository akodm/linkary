'use client';

import { LOCAL_USER_KEY } from '@/consts/keys';
import { SelectUser } from '@/db/schemas/users';
import { sentryCaptureException } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLingui } from '@lingui/react';
import Header from 'src/components/common/Header';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';

interface UserLayoutProps {
  user?: SelectUser | null;
}

export default function UserLayout({ user = null }: UserLayoutProps) {
  const [userData, setUserData] = useState<SelectUser | null>(user);
  const [isLoading, setIsLoading] = useState(Boolean(user));
  const [mounted, setMounted] = useState(false);
  const { i18n } = useLingui();

  const handleGetLocalUser = useCallback(() => {
    const localUser = localStorage.getItem(LOCAL_USER_KEY);

    try {
      if (!localUser) {
        return;
      }

      setUserData(JSON.parse(localUser));
    } catch (err) {
      toast(i18n.t('Failed to get user data'), {
        description: i18n.t('Please try reloading the page'),
        closeButton: true,
        position: 'bottom-right',
      });

      sentryCaptureException(err, 'handleGetLocalUser', { user: localUser });

      localStorage.removeItem(LOCAL_USER_KEY);
    } finally {
      setIsLoading(true);
    }
  }, [i18n]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userData && !isLoading && mounted) {
      handleGetLocalUser();
    }
  }, [userData, isLoading, mounted, handleGetLocalUser]);

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <div>{'UserLayout'}</div>
      </MainProvider>
      <Footer />
    </div>
  );
}
