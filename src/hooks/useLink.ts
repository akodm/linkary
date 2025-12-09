import {
  addLinkAction,
  deleteLinkAction,
  editLinkAction,
} from '@/lib/actions/link';
import { sentryCaptureException } from '@/lib/utils';
import { useLingui } from '@lingui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseLinkProps {
  sentryErrorGeneralCaptureObj: Record<string, unknown>;
}

export default function useLink({
  sentryErrorGeneralCaptureObj,
}: UseLinkProps) {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();

  const { ...addLinkMutation } = useMutation({
    mutationFn: addLinkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Link added successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to add link'));

      sentryCaptureException(err, 'onAddLink', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  const { ...editLinkMutation } = useMutation({
    mutationFn: editLinkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Link updated successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to update link'));

      sentryCaptureException(err, 'onEditLink', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  const { ...deleteLinkMutation } = useMutation({
    mutationFn: deleteLinkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Link deleted successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to delete link'));

      sentryCaptureException(err, 'onDeleteLink', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  return {
    addLinkMutation,
    editLinkMutation,
    deleteLinkMutation,
  };
}
