'use client';

import GeneralAnimator from 'src/components/common/GeneralAnimator';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';

export default function Roadmap() {
  const { i18n } = useLingui();

  const roadmapContents = useMemo(
    () => [
      {
        title: i18n.t(
          'Planning in Notion: requirements, folder structure, URL structure, and simple design wireframes',
        ),
      },
      {
        title: i18n.t('Design request to Readdy AI'),
      },
      {
        title: i18n.t(
          'Database modeling and refactoring of folder/URL structures during the process',
        ),
      },
      {
        title: i18n.t(
          'Review, integration, and testing of required external APIs',
        ),
      },
      {
        title: i18n.t('Component implementation and static pages'),
      },
      {
        title: i18n.t('Dynamic pages and API implementation'),
      },
      {
        title: i18n.t('SEO optimization'),
      },
      {
        title: i18n.t('Admin features'),
      },
      {
        title: i18n.t('QA and deployment'),
      },
    ],
    [i18n],
  );

  return (
    <Section className="bg-gray-50">
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Development Roadmap')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
        >
          {i18n.t('Project build process')}
        </GeneralAnimator>
      </Heading>
      <div>
        {roadmapContents.map((content) => (
          <div key={content.title}>{content.title}</div>
        ))}
      </div>
    </Section>
  );
}
