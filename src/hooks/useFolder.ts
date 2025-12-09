import {
  addFolderAction,
  deleteFolderAction,
  editFolderAction,
} from '@/lib/actions/folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLingui } from '@lingui/react';
import { sentryCaptureException } from '@/lib/utils';

interface UseFolderProps {
  sentryErrorGeneralCaptureObj: Record<string, unknown>;
}

export default function useFolder({
  sentryErrorGeneralCaptureObj,
}: UseFolderProps) {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();

  const { ...addFolderMutation } = useMutation({
    mutationFn: addFolderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Folder added successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to add folder'));

      sentryCaptureException(err, 'onAddFolder', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  const { ...editFolderMutation } = useMutation({
    mutationFn: editFolderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Folder updated successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to update folder'));

      sentryCaptureException(err, 'onEditFolder', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  const { ...deleteFolderMutation } = useMutation({
    mutationFn: deleteFolderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkAndFolder'] });

      toast.success(i18n.t('Folder deleted successfully'));
    },
    onError: (err) => {
      toast.error(i18n.t('Failed to delete folder'));

      sentryCaptureException(err, 'onDeleteFolder', {
        ...sentryErrorGeneralCaptureObj,
      });
    },
  });

  return {
    addFolderMutation,
    editFolderMutation,
    deleteFolderMutation,
  };
}
