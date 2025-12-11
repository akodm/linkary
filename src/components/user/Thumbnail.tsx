'use client';

import { LinkGetResponse } from '@/lib/actions/link';
import { LinkIcon, VerifiedIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import { Badge } from 'src/components/ui/badge';
import dayjs from 'dayjs';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

interface ThumbnailProps {
  link: LinkGetResponse['links'][number];
}

export default function Thumbnail({ link }: ThumbnailProps) {
  const { i18n } = useLingui();
  const [error, setError] = useState(false);

  if (!link?.image) {
    return (
      <div className="w-full max-w-150 aspect-square mx-auto bg-black/30 rounded-sm mt-2.5 md:mt-8 relative">
        <Image
          fill
          src="/default.webp"
          alt={link?.title || i18n.t('Default Image')}
          className="object-contain object-center"
        />
        {link?.verified && (
          <div className="flex justify-center items-center right-1 top-1 absolute">
            <Badge className="bg-white space-x-1">
              {link?.linkSafety?.[0]?.createdAt && (
                <span className="text-xs text-neutral-500">
                  {dayjs(link.linkSafety[0].createdAt).format('YYYY-MM-DD')}
                </span>
              )}
              <Tooltip>
                <TooltipTrigger>
                  <VerifiedIcon className="text-blue-500 size-4!" />
                </TooltipTrigger>
                <TooltipContent>{i18n.t('Verified Link')}</TooltipContent>
              </Tooltip>
            </Badge>
          </div>
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
        <div className="flex justify-center items-center right-1 top-1 absolute">
          <Badge className="bg-white space-x-1">
            {link?.linkSafety?.[0]?.createdAt && (
              <span className="text-xs text-neutral-500">
                {dayjs(link.linkSafety[0].createdAt).format('YYYY-MM-DD')}
              </span>
            )}
            <Tooltip>
              <TooltipTrigger>
                {link.linkSafety?.[0]?.safe ? (
                  <VerifiedIcon className="text-blue-500 size-4!" />
                ) : (
                  <XIcon className="text-destructive size-4!" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {link.linkSafety?.[0]?.safe
                  ? i18n.t('Verified Link')
                  : i18n.t('Unsafe Link')}
              </TooltipContent>
            </Tooltip>
          </Badge>
        </div>
      )}
    </a>
  );
}
