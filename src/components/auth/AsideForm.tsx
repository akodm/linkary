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
import { useLingui } from '@lingui/react';
import GoogleSignInButton from 'src/components/auth/GoogleSignInButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AsideForm() {
  const { i18n } = useLingui();
  const { back } = useRouter();

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
          <h4 className="mt-3 text-sm md:text-lg font-medium">
            {i18n.t('Sign in to access more features.')}
          </h4>
          <form
            className="mx-auto"
            action={() => signIn('google', { redirectTo: '/auth/success' })}
          >
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
