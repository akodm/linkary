'use client';

import { FolderIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import { LinkGetResponse } from '@/lib/actions/link';
import clsx from 'clsx';
import ListDropdownMenu from 'src/components/user/ListDropdownMenu';

interface ListFolderProps {
  folder: LinkGetResponse['folders'][number];
  selected?: boolean;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ListFolder({
  folder,
  selected,
  onClick,
  onRename,
  onDelete,
}: ListFolderProps) {
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
        <FolderIcon className="size-4" />
        <h5 className="text-sm font-medium text-left line-clamp-1">
          {folder.name || i18n.t('Empty Folder Name')}
        </h5>
        <span className="ml-auto text-xs text-neutral-500">
          {folder.links.length || 0}
        </span>
      </button>
      <ListDropdownMenu
        renameLabel={i18n.t('Rename')}
        deleteLabel={i18n.t('Delete')}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
}

interface ListEmptyFolderProps {
  folder: LinkGetResponse['folders'][number];
  selected?: boolean;
  onClick: () => void;
}

export const ListDefaultFolder = ({
  folder,
  selected,
  onClick,
}: ListEmptyFolderProps) => {
  const { i18n } = useLingui();

  return (
    <div
      className={clsx(
        'flex flex-row items-center gap-x-2 w-full rounded-md',
        selected
          ? 'bg-blue-100 outline outline-blue-500'
          : 'group-hover:bg-blue-50 group-hover:outline group-hover:outline-blue-200',
      )}
    >
      <button
        type="button"
        className="flex flex-row items-center gap-x-2 w-full p-2"
        onClick={onClick}
      >
        <FolderIcon className="size-4" />
        <h5 className="text-sm font-medium text-left line-clamp-1">
          {folder.name || i18n.t('Default Folder')}
        </h5>
        <span className="ml-auto text-xs text-neutral-500">
          {folder.links.length || 0}
        </span>
      </button>
    </div>
  );
};
