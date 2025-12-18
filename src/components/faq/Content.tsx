'use client';

import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import Section from 'src/components/common/Section';
import Heading from 'src/components/common/Heading';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { Accordion } from 'src/components/ui/accordion';
import FaqAccorionItem from 'src/components/faq/FaqAccorionItem';
import { Button } from 'src/components/ui/button';
import clsx from 'clsx';
import { colorPresets } from '@/css/colors';

export default function Content() {
  const { i18n } = useLingui();

  const faqContents = useMemo(
    () => [
      {
        id: 'what-is-linkary',
        title: i18n.t('What is Linkary?'),
        description: i18n.t(
          'Linkary is a web service to reliably save and manage links and, if you want, share them with the community. It checks potentially harmful links and provides AI-powered personalized recommendations.',
        ),
      },
      {
        id: 'do-you-offer-a-paid-plan',
        title: i18n.t('Do you offer a paid plan?'),
        description: i18n.t(
          `There is no separate paid plan, and each user's usage quota resets at 00:00 on the 1st of every month.`,
        ),
      },
      {
        id: 'are-links-marked-safe-guaranteed-to-be-safe',
        title: i18n.t('Are links marked "safe" guaranteed to be safe?'),
        description: i18n.t(
          'We assess risk via the Google Web Risk API, but undetected threats or errors may occur, so absolute safety cannot be guaranteed. Details: https://cloud.google.com/web-risk/docs/overview',
        ),
      },
      {
        id: 'can-i-save-links-without-sharing-them',
        title: i18n.t('Can I save links without sharing them?'),
        description: i18n.t(
          'Yes. Sharing is optional, and the default is private (not shared).',
        ),
      },
      {
        id: 'how-is-my-personal-data-used',
        title: i18n.t('How is my personal data used?'),
        description: i18n.t(
          'We collect only minimal data (Google OAuth identifier and email) for sign-up and use it solely for login/account management. Upon deletion, data is erased without undue delay, except where retention is required by law.',
        ),
      },
    ],
    [i18n],
  );

  return (
    <Section>
      <Heading>
        <h1 className="text-2xl md:text-4xl font-bold">{i18n.t('FAQ')}</h1>
        <GeneralAnimator
          as="h2"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t(
            "Check our FAQ. If you can't find what you need or the answer doesn't solve your issue, feel free to contact us anytime.",
          )}
        </GeneralAnimator>
      </Heading>
      <div className="w-full max-w-3xl px-2 pb-10 pt-10 md:pb-5 md:pt-0">
        <Accordion collapsible type="single" className="w-full">
          {faqContents.map((faqContent) => (
            <FaqAccorionItem key={faqContent.id} {...faqContent} />
          ))}
        </Accordion>
      </div>
      <div className="flex flex-col items-center gap-3 w-full max-w-3xl p-3 md:p-6 border border-gray-200 bg-gray-50 rounded-md md:rounded-lg text-center">
        <h3 className="text-base md:text-lg font-medium">
          {i18n.t('If you have any questions, feel free to contact us.')}
        </h3>
        <h4 className="text-xs md:text-sm font-medium text-gray-500">
          {i18n.t(
            'Translations are AI-generated and may contain minor contextual inaccuracies.',
          )}
        </h4>
        <Button
          className={clsx(
            'cursor-pointer',
            colorPresets({ preset: 'primary' }),
          )}
        >
          <a href="mailto:a8456452@gmail.com">{i18n.t('Contact Us')}</a>
        </Button>
      </div>
    </Section>
  );
}
