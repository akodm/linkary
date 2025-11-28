'use client';

import useHasScroll from '@/hooks/useHasScroll';
import { addFolderAction } from '@/lib/actions/folder';
import {
  addLinkAction,
  getLinkAndFolder,
  LinkGetResponse,
} from '@/lib/actions/link';
import { GetUserActionResponse } from '@/lib/actions/user';
import { sentryCaptureException } from '@/lib/utils';
import { useLingui } from '@lingui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';
import { Skeleton } from 'src/components/ui/skeleton';
import ListFolder, { ListDefaultFolder } from 'src/components/user/ListFolder';
import ListLink from 'src/components/user/ListLink';
import useSelector from '@/hooks/useSelector';
import { useAtom } from 'jotai';
import { selectedFolderAtom, selectedLinkAtom } from '@/lib/atom';
import clsx from 'clsx';
import AddLinkForm from 'src/components/forms/AddLink';
import { Spinner } from 'src/components/ui/spinner';

interface UserSideFormProps {
  user?: GetUserActionResponse | null;
}

export default function UserSideForm({ user }: UserSideFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const [selectedLink, setSelectedLink] = useAtom(selectedLinkAtom);
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId');
  const linkId = searchParams.get('linkId');
  const { i18n } = useLingui();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<LinkGetResponse>({
    queryKey: ['linkAndFolder'],
    queryFn: getLinkAndFolder,
  });
  const { mutate: addFolder } = useMutation({
    mutationFn: addFolderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Folder added successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to add folder'));

      sentryCaptureException(err, 'onAddFolder', { user });
    },
  });
  const { mutate: addLink } = useMutation({
    mutationFn: addLinkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Link added successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to add link'));

      sentryCaptureException(err, 'onAddLink', { user });
    },
  });

  const { isTop: isTopFolder, containerRef: containerRefFolder } =
    useHasScroll();
  const { isTop: isTopLink, containerRef: containerRefLink } = useHasScroll();
  const { onSelectFolder, onSelectLink } = useSelector();

  const defaultFolder = useMemo(() => {
    return {
      id: 0,
      name: i18n.t('Default Folder'),
      slug: 'default',
      order: 0,
      userId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      links: data?.links ?? [],
    };
  }, [data, i18n]);

  const onAddFolder = useCallback(() => {
    addFolder({ name: i18n.t('New Folder') });
  }, [addFolder, i18n]);

  const onAddLink = useCallback(
    (url: string) => {
      startTransition(() => {
        addLink({
          url,
          folderId: selectedFolder?.id ? selectedFolder.id : undefined,
        });

        setOpen(false);
      });
    },
    [addLink, selectedFolder],
  );

  useEffect(() => {
    if (Number(folderId)) {
      startTransition(() => {
        const folder = data?.folders.find(
          (folder) => folder.id === Number(folderId),
        );

        if (folder) {
          setSelectedFolder(folder);
        }
      });
    } else {
      setSelectedFolder(defaultFolder);
    }
  }, [data, folderId, i18n, defaultFolder, setSelectedFolder]);

  useEffect(() => {
    if (linkId) {
      const folderLink = data?.folders.flatMap((folder) => folder.links);
      const allLinks = [...(folderLink ?? []), ...(data?.links ?? [])];
      const link = allLinks.find((link) => link.id === Number(linkId));

      if (link) {
        setSelectedLink(link);
      }
    } else {
      setSelectedLink(undefined);
    }
  }, [data, linkId, setSelectedLink]);

  return (
    <>
      {isPending && (
        <div
          className={clsx(
            'flex justify-center items-center w-full h-full fixed top-0 left-0 z-999',
            'bg-black/40',
          )}
        >
          <Spinner className="size-6 md:size-10 text-blue-500" />
        </div>
      )}
      <section
        className={clsx(
          'flex-col w-full md:max-w-xs h-full bg-white md:border md:border-neutral-200 md:rounded-md md:drop-shadow-xs p-4',
          selectedLink?.id ? 'hidden md:flex' : 'flex',
        )}
      >
        <article
          ref={containerRefFolder}
          className="flex flex-col h-86 overflow-y-auto scrollbar-hide relative"
        >
          <div className="flex flex-row justify-between items-center w-full pb-2 sticky top-0 bg-white">
            <h4 className="text-base font-medium">{i18n.t('Folder')}</h4>
            <button
              className="flex justify-center items-center w-7 h-7 rounded-sm hover:bg-neutral-100"
              disabled={isLoading}
              onClick={onAddFolder}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-y-2 w-full p-1">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            ) : (
              <>
                <ListDefaultFolder
                  folder={defaultFolder}
                  selectedFolder={selectedFolder?.id === defaultFolder.id}
                  onSelectFolder={() =>
                    onSelectFolder(`/user/${user?.slug}`, defaultFolder)
                  }
                />
                {data?.folders.map((folder) => {
                  return (
                    <ListFolder
                      key={folder.id}
                      folder={folder}
                      selectedFolder={selectedFolder?.id === folder.id}
                      onSelectFolder={() =>
                        onSelectFolder(`/user/${user?.slug}`, folder)
                      }
                    />
                  );
                })}
              </>
            )}
          </div>
          {isTopFolder && (
            <div className="w-full h-15 bg-gradient-to-t from-white to-transparent absolute bottom-0 pointer-events-none" />
          )}
        </article>
        <hr className="my-4 border-neutral-200" />
        <article
          ref={containerRefLink}
          className="flex flex-1 flex-col overflow-y-auto scrollbar-hide relative"
        >
          <div className="flex flex-row justify-between items-center w-full pb-2 sticky top-0 bg-white">
            <h4 className="text-base font-medium">{i18n.t('Link')}</h4>
            <button
              className="flex justify-center items-center w-7 h-7 rounded-sm hover:bg-neutral-100"
              disabled={isLoading}
              onClick={() => setOpen(true)}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-y-2 w-full p-1">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            ) : (
              <>
                {selectedFolder?.links.map((link) => {
                  return (
                    <ListLink
                      key={link.id}
                      link={link}
                      selectedLink={selectedLink?.id === link.id}
                      onSelectLink={() =>
                        onSelectLink(`/user/${user?.slug}`, link)
                      }
                    />
                  );
                })}
              </>
            )}
          </div>
          {isTopLink && (
            <div className="w-full h-15 bg-gradient-to-t from-white to-transparent absolute bottom-0 pointer-events-none" />
          )}
        </article>
      </section>
      <AddLinkForm
        title={i18n.t('Add Link')}
        description={i18n.t('write the URL of the link you want to add')}
        submitText={i18n.t('Add')}
        cancelText={i18n.t('Cancel')}
        open={open}
        setOpen={setOpen}
        onSubmit={(data) => onAddLink(data.url)}
      />
    </>
  );
}
