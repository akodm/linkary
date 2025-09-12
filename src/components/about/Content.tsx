'use client';

import { useLingui } from '@lingui/react';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { Button } from 'src/components/ui/button';
import { colorPresets } from '@/css/colors';
import clsx from 'clsx';
import I18nLink from 'src/components/common/I18nLink';

export default function Content() {
  const { i18n } = useLingui();

  return (
    <Section>
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Get started now')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t(
            'You can use Linkary without an account, but we recommend signing up to unlock more features.',
          )}
        </GeneralAnimator>
      </Heading>
      <div className="flex flex-row justify-center gap-3 md:gap-5 w-full">
        <I18nLink href="/user">
          <Button
            variant="outline"
            className={clsx(
              'cursor-pointer',
              colorPresets({ preset: 'gray-light' }),
            )}
          >
            {i18n.t('Use as Guest')}
          </Button>
        </I18nLink>
        <I18nLink href="/auth">
          <Button
            className={clsx(
              'cursor-pointer',
              colorPresets({ preset: 'primary' }),
            )}
          >
            {i18n.t('Sign Up')}
          </Button>
        </I18nLink>
      </div>
    </Section>
  );
}
