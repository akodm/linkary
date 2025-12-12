'use client';

import { LinkGetResponse } from '@/lib/actions/link';
import { LinkIcon, OctagonAlertIcon, VerifiedIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useLingui } from '@lingui/react';
import { useMemo, useState } from 'react';
import useLinkSafety, { SafetyIcon } from '@/hooks/useLinkSafety';
import LinkVerifedBadge from 'src/components/user/LinkVerifedBadge';

interface ThumbnailProps {
  link: LinkGetResponse['links'][number];
}

export default function Thumbnail({ link }: ThumbnailProps) {
  const { i18n } = useLingui();
  const [error, setError] = useState(false);

  const { getSafetyStatus } = useLinkSafety({ link });

  const safetyStatus = useMemo(() => {
    const status = getSafetyStatus();

    const element: Record<SafetyIcon, React.ReactNode> = {
      default: <></>,
      unsafe: <XIcon className="text-destructive size-4!" />,
      warn: <OctagonAlertIcon className="text-yellow-500 size-4!" />,
      verified: <VerifiedIcon className="text-blue-500 size-4!" />,
    };
    const tooltip: Record<SafetyIcon, string> = {
      default: '',
      unsafe: i18n.t('Unsafe Link'),
      warn: i18n.t('Warning link (over 1 year old)'),
      verified: i18n.t('Verified Link'),
    };

    return {
      element: element[status],
      tooltip: tooltip[status],
    };
  }, [getSafetyStatus, i18n]);

  if (!link?.image) {
    return (
      <div className="w-full max-w-150 aspect-square mx-auto bg-black/30 rounded-sm mt-2.5 md:mt-8 relative">
        <Image
          fill
          src="/default.webp"
          alt={link?.title || i18n.t('Default Image')}
          className="object-contain object-center border border-neutral-200 rounded-sm"
        />
        {link?.verified && (
          <LinkVerifedBadge
            createdAt={link?.linkSafety?.[0]?.createdAt}
            trigger={safetyStatus.element}
            tooltip={safetyStatus.tooltip}
          />
        )}
      </div>
    );
  }

  return (
    <a
      className="w-full max-w-150 aspect-square mx-auto bg-black/30 rounded-sm mt-2.5 md:mt-8 group relative disabled:cursor-default!"
      href={link?.image ?? ''}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        fill
        src={error ? '/default.webp' : link?.image}
        alt={link?.title || i18n.t('Default Image')}
        className="object-contain object-center"
        onError={() => setError(true)}
      />
      <div className="justify-center items-center absolute inset-0 bg-black/15 hidden group-hover:flex group-disabled:hidden cursor-pointer">
        <LinkIcon className="size-4 md:size-6" />
      </div>
      {link?.verified && (
        <LinkVerifedBadge
          createdAt={link?.linkSafety?.[0]?.createdAt}
          trigger={safetyStatus.element}
          tooltip={safetyStatus.tooltip}
        />
      )}
    </a>
  );
}
