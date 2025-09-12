'use client';

import { useLingui } from '@lingui/react';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { useMemo } from 'react';
import { ContactIcon, FileCheckIcon, HelpingHandIcon } from 'lucide-react';
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
        title: i18n.t('Privacy Policy'),
        description: i18n.t('Review our Privacy Policy.'),
        href: '/privacy',
        Icon: FileCheckIcon,
      },
      {
        title: i18n.t('Terms of Service'),
        description: i18n.t("Review Linkary's Terms of Service."),
        href: '/terms-of-service',
        Icon: FileCheckIcon,
      },
      {
        title: i18n.t('Contact Us'),
        description: i18n.t(
          'If you have any questions, feel free to contact us.',
        ),
        Icon: ContactIcon,
        Wrapper: ({ children }: { children: React.ReactNode }) => (
          <a href="mailto:a8456452@gmail.com">{children}</a>
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 w-full">
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
