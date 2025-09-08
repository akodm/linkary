'use client';

import { ColorPreset, colorPresets } from '@/css/colors';
import { BookmarkIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface DescriptionIconCardProps {
  icon: React.ReactNode;
  preset: ColorPreset['preset'];
  title: string;
  description: string;
}

export default function DescriptionIconCard({
  icon = <BookmarkIcon size={14} className="text-blue-500" />,
  preset = 'primary-light',
  title,
  description,
}: DescriptionIconCardProps) {
  return (
    <div className="flex flex-col w-full min-w-65 min-h-56 p-4 md:p-6 rounded-lg md:rounded-xl shadow">
      <div
        className={twMerge(
          'flex justify-center items-center w-9 h-9 md:w-12 md:h-12 rounded-md md:rounded-lg',
          colorPresets({ preset }),
        )}
      >
        {icon}
      </div>
      <span className="text-base md:text-lg font-medium">{title}</span>
      <h4 className="text-sm md:text-base font-normal text-gray-600">
        {description}
      </h4>
    </div>
  );
}
