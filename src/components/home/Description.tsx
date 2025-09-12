'use client';

import { useLingui } from '@lingui/react';
import {
  BookmarkIcon,
  BrainCogIcon,
  ImageIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import DescriptionIconCard from '@/components/home/DescriptionIconCard';
import GeneralAnimator from '@/components/common/GeneralAnimator';
import Section from 'src/components/common/Section';
import Heading from 'src/components/common/Heading';

export default function Description() {
  const { i18n } = useLingui();

  const descriptionContents = useMemo(
    () => [
      {
        title: i18n.t('Smart Link Management'),
        description: i18n.t(
          'Organize your links by folders and view them at a glance.',
        ),
        Icon: BookmarkIcon,
      },
      {
        title: i18n.t('Automatic Thumbnail & Metadata Generation'),
        description: i18n.t(
          'Automatically generates thumbnails, titles, and short descriptions for your added links.',
        ),
        Icon: ImageIcon,
      },
      {
        title: i18n.t('Threat Link Check'),
        description: i18n.t(
          'Verify whether a link is safe using the Google Web Risk API.',
        ),
        Icon: ShieldCheckIcon,
      },
      {
        title: i18n.t('AI Link Recommendations'),
        description: i18n.t('Get personalized link suggestions powered by AI.'),
        Icon: BrainCogIcon,
      },
    ],
    [i18n],
  );

  return (
    <Section className="bg-gray-50">
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Convenient and Secure Link Management')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t(
            'View all your saved links at a glance. Check the safety of each link, receive personalized link recommendations, and let the system automatically fill in brief details to make them easier to find.',
          )}
        </GeneralAnimator>
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 w-full">
        {descriptionContents.map((content) => {
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
