'use client';

import { useEffect, useState } from 'react';
import { useLingui } from '@lingui/react';
import { useCallback } from 'react';
import { LOCAL_USER_KEY } from '@/consts/keys';
import { toast } from 'sonner';
import { sentryCaptureException } from '@/lib/utils';
import UserSideForm from 'src/components/user/SideForm';
import UserViewer from 'src/components/user/Viewer';
import { GetUserActionResponse } from '@/lib/actions/user';

interface UserLoaderProps {
  user?: GetUserActionResponse | null;
  recovery?: boolean;
}

export default function UserLoader({ user = null, recovery }: UserLoaderProps) {
  const [userData, setUserData] = useState<
    GetUserActionResponse | null | undefined
  >(user);
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

  useEffect(() => {
    if (mounted && recovery) {
      toast(i18n.t('Welcome back!'), {
        description: i18n.t(
          'If you restore your account within 30 days, your previous data will remain intact.',
        ),
        closeButton: true,
        position: 'top-center',
      });
    }
  }, [mounted, recovery, i18n]);

  return (
    <div className="flex flex-row justify-center gap-x-6 w-full h-full">
      <UserSideForm />
      <UserViewer />
    </div>
  );
}
