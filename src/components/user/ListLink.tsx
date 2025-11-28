'use client';

import { LinkIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import { LinkGetResponse } from '@/lib/actions/link';
import clsx from 'clsx';

interface ListLinkProps {
  link: LinkGetResponse['links'][number];
  selectedLink?: boolean;
  onSelectLink: () => void;
}

export default function ListLink({
  link,
  selectedLink,
  onSelectLink,
}: ListLinkProps) {
  const { i18n } = useLingui();

  return (
    <button
      className={clsx(
        'flex flex-row items-center gap-x-2 w-full p-2 rounded-md',
        selectedLink
          ? 'bg-blue-100 outline outline-blue-500'
          : 'hover:bg-blue-50 hover:outline hover:outline-blue-200',
      )}
      onClick={onSelectLink}
    >
      <LinkIcon className="size-4" />
      <h5 className="text-sm font-medium">
        {link.title || i18n.t('Empty Link Title')}
      </h5>
    </button>
  );
}
