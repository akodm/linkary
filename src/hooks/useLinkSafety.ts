import { LinkGetResponse } from '@/lib/actions/link';
import { getTimeDifference } from '@/lib/date';
import { useCallback, useMemo } from 'react';

export type SafetyIcon = 'default' | 'unsafe' | 'warn' | 'verified';

interface UseLinkSafetyProps {
  link: LinkGetResponse['links'][number];
}

export default function useLinkSafety({ link }: UseLinkSafetyProps) {
  const isUnsafe = useMemo(
    () => !link.linkSafety?.[0]?.safe,
    [link.linkSafety],
  );
  const isWarn = useMemo(
    () =>
      getTimeDifference(link.linkSafety[0]?.createdAt, new Date(), 'day') >= 1,
    [link.linkSafety],
  );

  const getSafetyStatus = useCallback((): SafetyIcon => {
    if (!link.linkSafety.length) {
      return 'default';
    }
    if (
      getTimeDifference(link.linkSafety[0].createdAt, new Date(), 'year') >= 1
    ) {
      return 'warn';
    }
    if (link.linkSafety[0].safe) {
      return 'verified';
    }

    return 'unsafe';
  }, [link.linkSafety]);

  return {
    isUnsafe,
    isWarn,
    getSafetyStatus,
  };
}
