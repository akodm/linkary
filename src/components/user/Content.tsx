'use client';

import { useEffect, useState } from 'react';
import { SelectUser } from '@/db/schemas/users';
import { useLingui } from '@lingui/react';
import { useCallback } from 'react';
import { LOCAL_USER_KEY } from '@/consts/keys';
import { toast } from 'sonner';
import { sentryCaptureException } from '@/lib/utils';

interface UserContentProps {
  user?: SelectUser | null;
}

export default function UserContent({ user = null }: UserContentProps) {
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

  return <div>UserContent</div>;
}
