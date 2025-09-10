'use client';

import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import {
  BookmarkIcon,
  BrainCogIcon,
  ImageIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import DescriptionIconCard from 'src/components/common/DescriptionIconCard';

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
    <section className="flex flex-col items-center w-full py-10 md:py-20 bg-gray-50">
      <div className="flex flex-col items-center gap-y-10 md:gap-y-20 w-full max-w-320 px-4 md:px-6 mx-auto">
        <div
          className={clsx(
            'flex flex-col items-center gap-2 md:gap-4 w-full text-center',
            i18n.locale === 'ko' ? 'break-keep' : 'break-words',
          )}
        >
          <h2 className="text-2xl md:text-4xl font-bold">
            {i18n.t('Convenient and Secure Link Management')}
          </h2>
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            {i18n.t(
              'View all your saved links at a glance. Check the safety of each link, receive personalized link recommendations, and let the system automatically fill in brief details to make them easier to find.',
            )}
          </h3>
        </div>
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
      </div>
    </section>
  );
}
