'use client';

import { LinkAndFolderCommunityResponse } from '@/lib/actions/link';
import Image from 'next/image';
import { useLingui } from '@lingui/react';
import LinkVerifedBadge from 'src/components/user/LinkVerifedBadge';
import { useMemo } from 'react';
import useLinkSafety, { SafetyIcon } from '@/hooks/useLinkSafety';
import { OctagonAlertIcon, VerifiedIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

interface LinkCardProps {
  link: LinkAndFolderCommunityResponse['data'][number];
}

export default function LinkCard({ link }: LinkCardProps) {
  const { i18n } = useLingui();
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

  return (
    <Link
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-y-2 rounded-md shadow-sm overflow-hidden"
    >
      <div className="w-full h-auto aspect-[1.6/1] relative border-b border-gray-100">
        <Image
          fill
          sizes="(max-width: 768px) 50vw, 297px"
          src={link?.image || '/default.webp'}
          alt={link?.title || i18n.t('Default Image')}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = '/default.webp';
            event.currentTarget.alt = i18n.t('Default Image');
            event.currentTarget.sizes = '';
            event.currentTarget.srcset = '';
            event.currentTarget.onerror = null;
          }}
        />
        {link?.verified && (
          <LinkVerifedBadge
            createdAt={link?.linkSafety?.[0]?.createdAt}
            trigger={safetyStatus.element}
            tooltip={safetyStatus.tooltip}
          />
        )}
      </div>
      <div className="flex flex-col gap-y-2 min-h-30 p-2">
        <h4 className="text-sm font-medium line-clamp-2">{link.title}</h4>
        <p className="text-sm text-neutral-500 line-clamp-3">
          {link.description}
        </p>
      </div>
    </Link>
  );
}
