'use client';

import useHasScroll from '@/hooks/useHasScroll';
import { getLinkAndFolder } from '@/lib/actions/link';
import { GetUserActionResponse } from '@/lib/actions/user';
import { useLingui } from '@lingui/react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircleIcon, PlusIcon } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Skeleton } from 'src/components/ui/skeleton';
import ListFolder, { ListDefaultFolder } from 'src/components/user/ListFolder';
import ListLink from 'src/components/user/ListLink';
import { useAtom } from 'jotai';
import { Folder, selectedFolderAtom, selectedLinkAtom } from '@/lib/atom';
import clsx from 'clsx';
import SimpleFieldForm from '@/components/forms/SimpleFieldForm';
import { Spinner } from 'src/components/ui/spinner';
import useFolder from '@/hooks/useFolder';
import useLink from '@/hooks/useLink';
import { getApiLimitAction } from '@/lib/actions/api';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from 'src/components/ui/dialog';

interface UserSideFormProps {
  user?: GetUserActionResponse | null;
}

export default function UserSideForm({ user }: UserSideFormProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [editFolderOpen, setEditFolderOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editFolderState, setEditFolderState] = useState<Folder | undefined>();
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const [selectedLink, setSelectedLink] = useAtom(selectedLinkAtom);
  const refetchRef = useRef(false);
  const { i18n } = useLingui();
  const { data, isLoading } = useQuery({
    queryKey: ['linkAndFolder'],
    queryFn: getLinkAndFolder,
    refetchOnWindowFocus: false,
  });
  const { data: apiLimitData, isLoading: apiLimitLoading } = useQuery({
    queryKey: ['apiLimit'],
    queryFn: getApiLimitAction,
    refetchOnWindowFocus: false,
  });

  const {
    addFolderMutation: { mutate: addFolder },
    editFolderMutation: { mutate: editFolder },
    deleteFolderMutation: { mutate: deleteFolder },
  } = useFolder({
    sentryErrorGeneralCaptureObj: { user },
  });
  const {
    addLinkMutation: { mutate: addLink },
    deleteLinkMutation: { mutate: deleteLink },
  } = useLink({
    sentryErrorGeneralCaptureObj: { user },
  });

  const { isTop: isTopFolder, containerRef: containerRefFolder } =
    useHasScroll();
  const { isTop: isTopLink, containerRef: containerRefLink } = useHasScroll();

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

  const onSelectEditFolder = useCallback(
    (folder: Folder) => {
      setEditFolderState(folder);
      setEditFolderOpen(true);
    },
    [setEditFolderState, setEditFolderOpen],
  );

  const onAddFolder = useCallback(() => {
    startTransition(() => addFolder({ name: i18n.t('New Folder') }));
  }, [addFolder, i18n]);

  const onEditFolder = useCallback(
    (name: string) => {
      startTransition(() => {
        editFolder({ slug: editFolderState?.slug ?? '', name });

        setEditFolderOpen(false);
        setEditFolderState(undefined);
      });
    },
    [editFolder, editFolderState],
  );

  const onAddLink = useCallback(
    (url: string) => {
      startTransition(() => {
        addLink({
          url,
          folderId: selectedFolder?.id ? selectedFolder.id : undefined,
        });

        setAddLinkOpen(false);
      });
    },
    [addLink, selectedFolder],
  );

  useEffect(() => {
    if (refetchRef.current) return;

    setSelectedFolder(defaultFolder);
    setSelectedLink(undefined);

    refetchRef.current = true;
  }, [defaultFolder, setSelectedFolder, setSelectedLink]);

  useEffect(() => {
    setSelectedFolder((prev) => {
      const folder = data?.folders.find((folder) => folder.id === prev?.id);

      return folder ?? defaultFolder;
    });
    setSelectedLink((prev) => {
      const allLinks = data?.folders.flatMap((folder) => folder.links);

      return [...(allLinks ?? []), ...(data?.links ?? [])].find(
        (link) => link.id === prev?.id,
      );
    });
  }, [data, defaultFolder, setSelectedFolder, setSelectedLink]);

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
        <article className="flex flex-col gap-y-2 w-full">
          <div className="flex flex-row items-center gap-x-1">
            <h4 className="text-sm font-medium">{i18n.t('Quota')}</h4>
            <button type="button" onClick={() => setAlertOpen(true)}>
              <HelpCircleIcon className="size-4 text-neutral-500" />
            </button>
          </div>
          {apiLimitLoading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : (
            <>
              <div className="flex flex-row justify-between items-center w-full text-xs text-neutral-800">
                <span>{i18n.t('Link Inspection')}</span>
                <span className="text-[10px]/1.5">{`${apiLimitData?.googleApi.usage}/${apiLimitData?.googleApi.limit}`}</span>
              </div>
              <div className="flex flex-row justify-between items-center w-full text-xs text-neutral-800">
                <span>{i18n.t('AI Link Recommendations')}</span>
                <span className="text-[10px]/1.5">{`${apiLimitData?.tavilyApi.usage}/${apiLimitData?.tavilyApi.limit}`}</span>
              </div>
            </>
          )}
        </article>
        <hr className="my-4 border-neutral-200" />
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
                  selected={selectedFolder?.id === defaultFolder.id}
                  onClick={() => setSelectedFolder(defaultFolder)}
                />
                {data?.folders.map((folder) => {
                  return (
                    <ListFolder
                      key={folder.id}
                      folder={folder}
                      selected={selectedFolder?.id === folder.id}
                      onClick={() => setSelectedFolder(folder)}
                      onRename={() => onSelectEditFolder(folder)}
                      onDelete={() => deleteFolder({ slug: folder.slug })}
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
              onClick={() => setAddLinkOpen(true)}
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
                      selected={selectedLink?.id === link.id}
                      onClick={() => {
                        setSelectedLink(link);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      onDelete={() => deleteLink({ id: link.id })}
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
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <span>{i18n.t('The quota resets on the 1st of every month.')}</span>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <SimpleFieldForm
        field="url"
        title={i18n.t('Add Link')}
        description={i18n.t('write the URL of the link you want to add')}
        submitText={i18n.t('Add')}
        cancelText={i18n.t('Cancel')}
        placeholder={i18n.t('Enter link')}
        open={addLinkOpen}
        setOpen={setAddLinkOpen}
        onSubmit={(data) => onAddLink(data.url)}
      />
      <SimpleFieldForm
        field="name"
        title={i18n.t('Edit Folder')}
        description={i18n.t('write the name of the folder you want to edit')}
        submitText={i18n.t('Edit')}
        cancelText={i18n.t('Cancel')}
        placeholder={i18n.t('Enter folder name')}
        open={editFolderOpen}
        setOpen={setEditFolderOpen}
        onSubmit={(data) => onEditFolder(data.name)}
      />
    </>
  );
}
