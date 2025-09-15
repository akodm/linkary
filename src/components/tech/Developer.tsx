'use client';

import { ColorPreset, colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { UserIcon } from 'lucide-react';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { Badge } from 'src/components/ui/badge';

interface DeveloperContent {
  label: string;
  preset: ColorPreset['preset'];
}

const developerContents: DeveloperContent[] = [
  {
    label: 'Next.js (+Typescript, +Vercel)',
    preset: 'primary-light',
  },
  {
    label: 'Tailwind CSS (+Shadcn/UI, +ReaddyAI/UI)',
    preset: 'green-light',
  },
  {
    label: 'PostgreSQL + ORM',
    preset: 'pink-light',
  },
  {
    label: 'I18n',
    preset: 'yellow-light',
  },
  {
    label: 'etc',
    preset: 'gray-light',
  },
];

export default function Developer() {
  const { i18n } = useLingui();

  return (
    <Section className="bg-gray-50 [&>div]:max-w-4xl">
      <Heading>
        <GeneralAnimator as="h1" className="text-2xl md:text-4xl font-bold">
          {i18n.t('About the Developer')}
        </GeneralAnimator>
        <GeneralAnimator
          as="h2"
          className="text-sm md:text-lg font-medium text-gray-500"
        >
          {i18n.t('brief introduction.')}
        </GeneralAnimator>
      </Heading>
      <div
        className={clsx(
          'flex flex-col justify-center sm:items-center sm:flex-row',
          'gap-3 md:gap-5 w-full p-4 sm:p-6',
          'border border-border rounded-md bg-gray-50 shadow-sm',
        )}
      >
        <Avatar className="mx-auto">
          <AvatarImage
            width={128}
            height={128}
            src="https://github.com/akodm.png"
            alt={i18n.t('Developer Profile Image')}
          />
          <AvatarFallback>
            <UserIcon size={14} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center sm:items-start w-full">
          <p className="text-xl font-semibold">{'Akodm'}</p>
          <p className="mt-1 text-sm font-medium text-blue-500">
            {i18n.t('Front-end Developer')}
          </p>
          <h4 className="mt-3 text-sm text-gray-600">
            {i18n.t(
              'work across the full stack with JavaScript but primarily focus on the front end. I have limited design experience and leveraged AI for assistance.',
            )}
          </h4>
          <div className="mt-3 sm:mt-6 flex flex-row flex-wrap gap-2 w-full overflow-hidden">
            {developerContents.map((content) => (
              <Badge
                key={content.label}
                className={clsx(
                  'text-ellipsis whitespace-nowrap',
                  colorPresets({ preset: content.preset }),
                )}
              >
                {content.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
