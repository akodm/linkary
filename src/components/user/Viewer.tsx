'use client';

import useLink from '@/hooks/useLink';
import { GetUserActionResponse } from '@/lib/actions/user';
import { selectedFolderAtom, selectedLinkAtom } from '@/lib/atom';
import { copyToClipboard } from '@/lib/utils';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { LinkIcon, SquaresExclude, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb';

interface UserViewerProps {
  user?: GetUserActionResponse | null;
}

export default function UserViewer({ user }: UserViewerProps) {
  const { i18n } = useLingui();
  const selectedFolder = useAtomValue(selectedFolderAtom);
  const [selectedLink, setSelectedLink] = useAtom(selectedLinkAtom);

  const {
    deleteLinkMutation: { mutate: deleteLink },
  } = useLink({
    sentryErrorGeneralCaptureObj: { user },
  });

  const onCopyToClipboard = async () => {
    const success = await copyToClipboard(selectedLink?.url ?? '');

    if (success) {
      toast.success(i18n.t('Copied to clipboard'));
    } else {
      toast.error(i18n.t('Failed to copy to clipboard'));
    }
  };

  console.log(selectedLink?.image);

  return (
    <section
      className={clsx(
        'flex flex-col md:flex-1 items-start w-full bg-white md:border md:border-neutral-200 md:rounded-md md:drop-shadow-xs p-4',
        selectedLink?.id ? 'flex' : 'hidden md:flex',
      )}
    >
      <Breadcrumb className="block md:hidden w-full h-fit pb-2 md:pb-0">
        <BreadcrumbList className="flex-nowrap whitespace-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{i18n.t('Home')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-7 max-w-30 overflow-hidden">
            {selectedFolder?.name ? (
              <button
                type="button"
                className="truncate"
                onClick={() => setSelectedLink(undefined)}
              >
                {selectedFolder.name}
              </button>
            ) : (
              <BreadcrumbEllipsis />
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="overflow-hidden">
            <span className="truncate">{selectedLink?.title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {selectedLink?.id && (
        <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-hide">
          <div className="flex flex-row justify-end items-center gap-x-1 w-full **:size-8">
            <button
              type="button"
              className="flex justify-center items-center hover:bg-neutral-100 rounded-sm p-2"
              onClick={onCopyToClipboard}
            >
              <SquaresExclude />
            </button>
            <button
              type="button"
              className="flex justify-center items-center hover:bg-neutral-100 rounded-sm p-2"
              onClick={() => deleteLink({ id: selectedLink?.id ?? -1 })}
            >
              <TrashIcon className="text-destructive" />
            </button>
          </div>
          <button
            type="button"
            disabled={!selectedLink?.image}
            className="w-full max-w-150 aspect-square mx-auto bg-black/20 rounded-sm mt-2.5 md:mt-8 group relative disabled:cursor-default!"
            onClick={() => window.open(selectedLink?.image ?? '', '_blank')}
          >
            <Image
              fill
              src={selectedLink?.image || '/default.webp'}
              alt={selectedLink?.title || i18n.t('Default Image')}
              className="object-contain object-center"
            />
            <div className="justify-center items-center absolute inset-0 bg-black/15 hidden group-hover:flex group-disabled:hidden cursor-pointer">
              <LinkIcon className="size-4 md:size-6" />
            </div>
          </button>
        </div>
      )}
    </section>
  );
}
