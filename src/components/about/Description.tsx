'use client';

import { useLingui } from '@lingui/react';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';
import {
  AppWindowIcon,
  BrainCogIcon,
  ImageIcon,
  LanguagesIcon,
  LucideProps,
  ShareIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import DescriptionIconCard from 'src/components/common/DescriptionIconCard';
import { ColorPreset } from '@/css/colors';

interface DescriptionContent {
  title: string;
  description: string;
  preset: ColorPreset['preset'];
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}

export default function Description() {
  const { i18n } = useLingui();

  const descriptionContents: DescriptionContent[] = useMemo(
    () => [
      {
        title: i18n.t('Install as a browser app'),
        description: i18n.t(
          'Add it to your Home Screen to use it like an app.',
        ),
        preset: 'primary-light',
        Icon: AppWindowIcon,
      },
      {
        title: i18n.t('Harmful link check'),
        description: i18n.t(
          'Automatically generates thumbnails, titles, and short descriptions for your added links.',
        ),
        preset: 'green-light',
        Icon: ShieldCheckIcon,
      },
      {
        title: i18n.t('AI link recommendations'),
        description: i18n.t(
          'Verify whether a link is safe using the Google Web Risk API.',
        ),
        preset: 'red-light',
        Icon: BrainCogIcon,
      },
      {
        title: i18n.t('Explore & share links'),
        description: i18n.t('Discover or share links in the community.'),
        preset: 'yellow-light',
        Icon: ShareIcon,
      },
      {
        title: i18n.t('Multilingual support'),
        description: i18n.t(
          'Use Linkary in multiple countries with the provided translations.',
        ),
        preset: 'purple-light',
        Icon: LanguagesIcon,
      },
      {
        title: i18n.t('Link preview'),
        description: i18n.t(
          'Automatically generates thumbnails, titles, and brief summaries for added links.',
        ),
        preset: 'pink-light',
        Icon: ImageIcon,
      },
    ],
    [i18n],
  );

  return (
    <Section className="bg-gray-50">
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Features available in Linkary')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t('Try our features across different environments.')}
        </GeneralAnimator>
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 w-full">
        {descriptionContents.map((content) => {
          return <DescriptionIconCard key={content.title} {...content} />;
        })}
      </div>
    </Section>
  );
}
