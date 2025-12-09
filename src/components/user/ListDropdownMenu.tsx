'use client';

import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';

interface ListDropdownMenuProps {
  renameLabel?: string;
  deleteLabel?: string;
  onRename?: () => void;
  onDelete?: () => void;
}

export default function ListDropdownMenu({
  renameLabel = '',
  deleteLabel = '',
  onRename,
  onDelete,
}: ListDropdownMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center h-full pr-2 cursor-pointer">
          <EllipsisIcon className="size-4 text-neutral-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 md:mr-0">
        {onRename && (
          <DropdownMenuItem asChild>
            <button
              type="button"
              className="flex flex-row items-center justify-between gap-x-2 w-full"
              onClick={onRename}
            >
              <span className="text-xs text-left line-clamp-1">
                {renameLabel}
              </span>
              <PencilIcon className="size-4" />
            </button>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem asChild>
            <button
              type="button"
              className="flex flex-row items-center justify-between gap-x-2 w-full **:text-destructive"
              onClick={onDelete}
            >
              <span className="text-xs text-left line-clamp-1">
                {deleteLabel}
              </span>
              <TrashIcon className="size-4" />
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
