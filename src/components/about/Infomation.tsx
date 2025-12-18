'use client';

import { useLingui } from '@lingui/react';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { useMemo } from 'react';
import { ContactIcon, HelpingHandIcon } from 'lucide-react';
import DescriptionIconCard from 'src/components/common/DescriptionIconCard';

export default function Infomation() {
  const { i18n } = useLingui();

  const infomationContents = useMemo(
    () => [
      {
        title: i18n.t('FAQ'),
        description: i18n.t('Check the Frequently Asked Questions (FAQ).'),
        href: '/faq',
        Icon: HelpingHandIcon,
      },
      {
        title: i18n.t('Contact Us'),
        description: i18n.t(
          'If you have any questions, feel free to contact us.',
        ),
        Icon: ContactIcon,
        Wrapper: ({ children }: { children: React.ReactNode }) => (
          <a href="mailto:a8456452@gmail.com" className="w-full max-w-120">
            {children}
          </a>
        ),
      },
    ],
    [i18n],
  );

  return (
    <Section className="bg-gray-50">
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Need more information?')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t('Find more details in other sections of the site.')}
        </GeneralAnimator>
      </Heading>
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5 w-full">
        {infomationContents.map((content) => {
          return (
            <DescriptionIconCard
              key={content.title}
              preset="primary-light"
              {...content}
            />
          );
        })}
      </div>
    </Section>
  );
}
