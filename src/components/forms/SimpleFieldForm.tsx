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
import { FieldPath, FieldValues, useForm } from 'react-hook-form';
import { Input } from 'src/components/ui/input';
import { useEffect } from 'react';

interface SimpleFieldFormProps {
  field: FieldPath<FieldValues>;
  title: string;
  description: string;
  submitText?: string;
  cancelText?: string;
  placeholder?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: FieldValues) => void;
}

export default function SimpleFieldForm({
  field,
  title,
  description,
  submitText,
  cancelText,
  placeholder,
  open,
  setOpen,
  onSubmit,
}: SimpleFieldFormProps) {
  const form = useForm();

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
            {...form.register(field, {
              required: true,
            })}
            placeholder={placeholder}
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
