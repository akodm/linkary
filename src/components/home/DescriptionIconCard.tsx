'use client';

import { ColorPreset, colorPresets } from '@/css/colors';
import clsx from 'clsx';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionIconCardProps extends LucideProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  preset: ColorPreset['preset'];
  title: string;
  description: string;
}

export default function DescriptionIconCard({
  Icon,
  preset = 'primary-light',
  title,
  description,
  ...iconProps
}: DescriptionIconCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-y-2 w-full min-w-65 min-h-40 md:min-h-56 p-4 md:p-6 rounded-lg md:rounded-xl',
        'shadow-md transition-transform duration-300 hover:scale-105',
      )}
    >
      <div
        className={twMerge(
          'flex justify-center items-center w-9 h-9 md:w-12 md:h-12 rounded-md md:rounded-lg',
          colorPresets({ preset, hover: false }),
        )}
      >
        <Icon {...iconProps} />
      </div>
      <span className="text-base md:text-lg font-medium">{title}</span>
      <h4 className="text-sm md:text-base font-normal text-gray-600">
        {description}
      </h4>
    </div>
  );
}
