'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetFooter,
} from 'src/components/ui/sheet';
import { Button } from 'src/components/ui/button';
import useI18nRouter from '@/hooks/useI18nRouter';
import { useLingui } from '@lingui/react';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import GoogleSignInButton from 'src/components/auth/GoogleSignInButton';
import { signIn } from 'next-auth/react';

export default function AsideForm() {
  const { i18n } = useLingui();
  const { back } = useI18nRouter();

  const onBack = () => back();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      back();
    }
  };

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:min-w-md" side="right">
        <SheetHeader>
          <SheetTitle>{i18n.t('Login')}</SheetTitle>
          <SheetDescription>{i18n.t('Login to your account')}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full px-4">
          <GeneralAnimator className="mt-3 text-sm md:text-lg font-medium text-gray-500">
            {i18n.t('Sign in to access more features.')}
          </GeneralAnimator>
          <form className="mx-auto" action={() => signIn('google')}>
            <GoogleSignInButton />
          </form>
        </div>
        <SheetFooter>
          <Button variant="outline" className="cursor-pointer" onClick={onBack}>
            {i18n.t('Close')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
