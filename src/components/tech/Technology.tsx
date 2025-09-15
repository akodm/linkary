'use client';

import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import { useLingui } from '@lingui/react';
import TechnologiesCard, {
  TechnologyItem,
} from 'src/components/tech/TechnologiesCard';
import { CodeIcon, ServerIcon } from 'lucide-react';

const technologiesFrontend: TechnologyItem[] = [
  {
    label: 'Next.js + Vercel',
    preset: 'primary-light',
  },
  {
    label: 'Typescript',
    preset: 'primary-light',
  },
  {
    label: 'Tailwind CSS',
    preset: 'red-light',
  },
  {
    label: 'Shadcn + ReaddyAI / UI',
    preset: 'yellow-light',
  },
  {
    label: 'I18n',
    preset: 'purple-light',
  },
  {
    label: 'Typescript',
    preset: 'orange-light',
  },
  {
    label: 'PWA',
    preset: 'pink-light',
  },
];
const technologiesBackend: TechnologyItem[] = [
  {
    label: 'TypeScript',
    preset: 'primary-light',
  },
  {
    label: 'PostgreSQL + ORM',
    preset: 'green-light',
  },
  {
    label: 'Scraping',
    preset: 'red-light',
  },
  {
    label: 'External APIs',
    preset: 'yellow-light',
  },
];

export default function Technology() {
  const { i18n } = useLingui();

  return (
    <Section>
      <Heading>
        <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
          {i18n.t('Tech Stack & More')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h3"
          className="text-sm md:text-lg font-medium text-gray-500"
        >
          {i18n.t('Technologies and external services used to build Linkary.')}
        </GeneralAnimator>
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TechnologiesCard
          title="Frontend"
          Icon={CodeIcon}
          preset="primary-light"
          technologies={technologiesFrontend}
        />
        <TechnologiesCard
          title="Backend"
          Icon={ServerIcon}
          preset="primary-light"
          technologies={technologiesBackend}
        />
      </div>
    </Section>
  );
}
