'use client';

import { LinkIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import { LinkGetResponse } from '@/lib/actions/link';
import clsx from 'clsx';
import ListDropdownMenu from 'src/components/user/ListDropdownMenu';

interface ListLinkProps {
  link: LinkGetResponse['links'][number];
  selected?: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function ListLink({
  link,
  selected,
  onClick,
  onDelete,
}: ListLinkProps) {
  const { i18n } = useLingui();

  return (
    <div
      className={clsx(
        'flex flex-row items-center gap-x-2 w-full rounded-md',
        selected
          ? 'bg-blue-100 outline outline-blue-500'
          : 'hover:bg-blue-50 hover:outline hover:outline-blue-200',
      )}
    >
      <button
        type="button"
        className="flex flex-row items-center gap-x-2 w-full p-2"
        onClick={onClick}
      >
        <LinkIcon className="size-4" />
        <h5 className="text-sm text-left font-medium">
          {link.title || i18n.t('Empty Link Title')}
        </h5>
      </button>
      <ListDropdownMenu
        renameLabel={i18n.t('Rename')}
        deleteLabel={i18n.t('Delete')}
        onDelete={onDelete}
      />
    </div>
  );
}
