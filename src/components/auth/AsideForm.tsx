'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetFooter,
} from 'src/components/ui/sheet';
import Form from 'src/components/auth/Form';
import { Button } from 'src/components/ui/button';
import useI18nRouter from '@/hooks/useI18nRouter';

export default function AsideForm() {
  const { back } = useI18nRouter();

  const onBack = () => back();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      back();
    }
  };

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent className="w-full min-w-lg" side="right">
        <SheetHeader>
          <SheetTitle>{'Login'}</SheetTitle>
          <SheetDescription>{'Login to your account'}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 w-full px-4">
          <Form />
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onBack}>
            {'Close'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
