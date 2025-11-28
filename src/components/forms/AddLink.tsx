import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { colorPresets } from '@/css/colors';
import { FieldValues, useForm } from 'react-hook-form';
import { Input } from 'src/components/ui/input';
import { useLingui } from '@lingui/react';
import { useEffect } from 'react';

interface AddLinkFormProps {
  title: string;
  description: string;
  submitText?: string;
  cancelText?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: FieldValues) => void;
}

export default function AddLinkForm({
  title,
  description,
  submitText,
  cancelText,
  open,
  setOpen,
  onSubmit,
}: AddLinkFormProps) {
  const { i18n } = useLingui();
  const form = useForm({
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            {...form.register('url', {
              required: true,
            })}
            placeholder={i18n.t('Enter link')}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="outline"
            className={colorPresets({ preset: 'primary' })}
            disabled={!form.formState.isDirty}
            onClick={form.handleSubmit(onSubmit)}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
