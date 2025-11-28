'use client';

import { FolderIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import { LinkGetResponse } from '@/lib/actions/link';
import clsx from 'clsx';

interface ListFolderProps {
  folder: LinkGetResponse['folders'][number];
  selectedFolder?: boolean;
  onSelectFolder: () => void;
}

export default function ListFolder({
  folder,
  selectedFolder,
  onSelectFolder,
}: ListFolderProps) {
  const { i18n } = useLingui();

  return (
    <button
      className={clsx(
        'flex flex-row items-center gap-x-2 w-full p-2 rounded-md',
        selectedFolder
          ? 'bg-blue-100 outline outline-blue-500'
          : 'hover:bg-blue-50 hover:outline hover:outline-blue-200',
      )}
      onClick={onSelectFolder}
    >
      <FolderIcon className="size-4" />
      <h5 className="text-sm font-medium">
        {folder.name || i18n.t('Empty Folder Name')}
      </h5>
      <span className="ml-auto text-xs text-neutral-500">
        {folder.links.length || 0}
      </span>
    </button>
  );
}

interface ListEmptyFolderProps {
  folder: LinkGetResponse['folders'][number];
  selectedFolder?: boolean;
  onSelectFolder: () => void;
}

export const ListDefaultFolder = ({
  folder,
  selectedFolder,
  onSelectFolder,
}: ListEmptyFolderProps) => {
  const { i18n } = useLingui();

  return (
    <button
      className={clsx(
        'flex flex-row items-center gap-x-2 w-full p-2 rounded-md',
        selectedFolder
          ? 'bg-blue-100 outline outline-blue-500'
          : 'hover:bg-blue-50 hover:outline hover:outline-blue-200',
      )}
      onClick={onSelectFolder}
    >
      <FolderIcon className="size-4" />
      <h5 className="text-sm font-medium">
        {folder.name || i18n.t('Default Folder')}
      </h5>
      <span className="ml-auto text-xs text-neutral-500">
        {folder.links.length || 0}
      </span>
    </button>
  );
};
