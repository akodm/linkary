import { ColorPreset, colorPresets } from '@/css/colors';
import clsx from 'clsx';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TechnologyItem {
  label: string;
  preset: ColorPreset['preset'];
}

interface TechnologiesCardProps extends LucideProps {
  title: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  preset: ColorPreset['preset'];
  technologies: TechnologyItem[];
}

export default function TechnologiesCard({
  title,
  Icon,
  preset,
  technologies,
  ...iconProps
}: TechnologiesCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-y-2 w-full min-w-65 min-h-40 md:min-h-56 p-4 md:p-6 rounded-lg md:rounded-xl',
        'shadow-md transition-transform duration-300 hover:scale-102 group/preset',
      )}
    >
      <div className="flex flex-row items-center gap-x-2 pb-3">
        <div
          className={twMerge(
            'flex justify-center items-center w-9 h-9 md:w-12 md:h-12 rounded-md md:rounded-lg',
            colorPresets({ preset, hover: false }),
          )}
        >
          <Icon {...iconProps} />
        </div>
        <span className="text-base md:text-lg font-semibold">{title}</span>
      </div>
      <div className="grid gird-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {technologies.map((technology, index) => {
          return (
            <div
              key={index}
              className={clsx(
                'p-2 md:p-4 rounded-sm text-sm md:text-base',
                colorPresets({ preset: technology.preset, hover: false }),
              )}
            >
              {technology.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
