import { useRouter } from 'next/navigation';
import { useLingui } from '@lingui/react';

export default function useI18nRouter() {
  const { i18n } = useLingui();
  const router = useRouter();

  return {
    ...router,
    push: (href: string, scroll = false) => {
      router.push(`/${i18n.locale}${href}`, { scroll });
    },
    replace: (href: string, scroll = false) => {
      router.replace(`/${i18n.locale}${href}`, { scroll });
    },
    refresh: () => {
      router.refresh();
    },
    back: () => {
      router.back();
    },
    forward: () => {
      router.forward();
    },
    prefetch: (href: string) => {
      router.prefetch(`/${i18n.locale}${href}`);
    },
  };
}
