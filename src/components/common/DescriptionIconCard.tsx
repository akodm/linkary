'use client';

import { ColorPreset, colorPresets } from '@/css/colors';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

const classes = cva(
  clsx(
    'flex flex-col gap-y-2 w-full min-w-65 min-h-40 md:min-h-56 p-4 md:p-6 rounded-lg md:rounded-xl border border-neutral-200',
    'shadow-md transition-transform duration-300 hover:scale-105 group/preset',
  ),
  {
    variants: {
      href: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      href: false,
    },
  },
);

interface DescriptionIconCardProps extends LucideProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  preset: ColorPreset['preset'];
  title: string;
  href?: string;
  description: string;
  Wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export default function DescriptionIconCard({
  preset = 'primary-light',
  href,
  Wrapper,
  ...props
}: DescriptionIconCardProps) {
  if (Wrapper) {
    return (
      <Wrapper>
        <div className={classes({ href: true })}>
          <CardContents preset={preset} {...props} />
        </div>
      </Wrapper>
    );
  }

  if (href) {
    return (
      <Link href={href}>
        <div className={classes({ href: Boolean(href) })}>
          <CardContents preset={preset} {...props} />
        </div>
      </Link>
    );
  }

  return (
    <div className={classes({ href: Boolean(href) })}>
      <CardContents preset={preset} {...props} />
    </div>
  );
}

const CardContents = ({
  title,
  preset,
  Icon,
  description,
  ...iconProps
}: DescriptionIconCardProps) => {
  return (
    <>
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
    </>
  );
};
