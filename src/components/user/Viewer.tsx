'use client';

import { verifyLinkAction } from '@/lib/actions/link';
import { GetUserActionResponse } from '@/lib/actions/user';
import { selectedFolderAtom, selectedLinkAtom } from '@/lib/atom';
import { copyToClipboard, sentryCaptureException } from '@/lib/utils';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { LinkIcon, ShieldIcon, SquaresExclude } from 'lucide-react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import Thumbnail from 'src/components/user/Thumbnail';
import { useMemo, useTransition } from 'react';
import { Spinner } from 'src/components/ui/spinner';
import { Switch } from 'src/components/ui/switch';
import { Label } from 'src/components/ui/label';
import useLink from '@/hooks/useLink';

interface UserViewerProps {
  user?: GetUserActionResponse | null;
}

export default function UserViewer({ user }: UserViewerProps) {
  const { i18n } = useLingui();
  const [isPending, startTransition] = useTransition();
  const selectedFolder = useAtomValue(selectedFolderAtom);
  const [selectedLink, setSelectedLink] = useAtom(selectedLinkAtom);
  const isPossibleToggleShareLink = useMemo(
    () => selectedLink?.linkSafety[0]?.safe,
    [selectedLink?.linkSafety],
  );
  const {
    queryClient,
    editSharedLinkMutation: { mutate: editSharedLink },
  } = useLink({ sentryErrorGeneralCaptureObj: { user, selectedLink } });

  const onCopyToClipboard = async () => {
    const success = await copyToClipboard(selectedLink?.url ?? '');

    if (success) {
      toast.success(i18n.t('Copied to clipboard'));
    } else {
      toast.error(i18n.t('Failed to copy to clipboard'));
    }
  };

  const onVerifyLink = async () => {
    startTransition(async () => {
      try {
        const response = await verifyLinkAction({
          linkId: selectedLink?.id,
        });

        if (response) {
          toast.error(i18n.t('Link is not safe'));
        } else {
          toast.success(i18n.t('Completed verification'));
        }

        queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });
        queryClient.invalidateQueries({ queryKey: ['apiLimit'] });
      } catch (err) {
        console.error(err);

        toast.error(i18n.t('Failed to verify link'));

        sentryCaptureException(err, 'onVerifyLink', {
          user,
          selectedLink,
        });
      }
    });
  };

  const onEditSharedLink = async (toggle: boolean) => {
    if (!selectedLink?.id) return;

    startTransition(async () => {
      editSharedLink({
        id: selectedLink.id,
        shared: toggle,
      });
    });
  };

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
          'flex flex-col md:flex-1 items-start w-full bg-white md:border md:border-neutral-200 md:rounded-md md:drop-shadow-xs p-4',
          selectedLink?.id ? 'flex' : 'hidden md:flex',
        )}
      >
        <Breadcrumb className="block md:hidden w-full h-fit pb-6 md:pb-0">
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
          <article className="flex flex-col w-full h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-row flex-wrap items-center gap-4 w-full">
              <div className="flex items-center min-w-fit text-xs text-left text-neutral-500">
                {`${i18n.t('Updated at')} ${new Date(selectedLink?.updatedAt).toLocaleString()}`}
              </div>
              <div className="flex flex-row items-center gap-x-1 ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-row items-center gap-x-2 ml-auto">
                      <Switch
                        id="share-link"
                        checked={selectedLink?.shared}
                        disabled={!isPossibleToggleShareLink}
                        onCheckedChange={(checked) => onEditSharedLink(checked)}
                      />
                      <Label htmlFor="share-link" className="text-xs">
                        {i18n.t('Share Link')}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-40">
                    {i18n.t(
                      'Decide whether to share this link with other users. (Only links verified as safe can be shared.)',
                    )}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex justify-center items-center hover:bg-neutral-100 rounded-sm p-2 size-8"
                      onClick={onVerifyLink}
                    >
                      <ShieldIcon className="text-blue-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{i18n.t('Verify Link')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex justify-center items-center hover:bg-neutral-100 rounded-sm p-2 size-8"
                      onClick={onCopyToClipboard}
                    >
                      <SquaresExclude />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {i18n.t('Copy Link to clipboard')}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Thumbnail link={selectedLink} />
            <div className="flex flex-row justify-between gap-x-2 w-full mt-2.5 md:mt-4">
              <h3 className="text-base md:text-lg font-medium">
                {selectedLink?.title}
              </h3>
              {selectedLink?.url && (
                <a
                  href={selectedLink?.url ?? ''}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="mt-1 size-3 md:size-4 text-neutral-500 hover:text-neutral-700 transition-colors duration-200" />
                </a>
              )}
            </div>
            <p className="text-sm text-left text-neutral-500 mt-4 md:mt-2">
              {selectedLink?.description}
            </p>
          </article>
        )}
      </section>
    </>
  );
}
