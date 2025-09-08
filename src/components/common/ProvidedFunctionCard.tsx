'use client';

import { useLingui } from '@lingui/react';
import { cva } from 'class-variance-authority';
import { Check, Crown, User } from 'lucide-react';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';

const containerCva = cva(
  'flex flex-col justify-between items-center w-full min-h-80 p-4 md:p-8 border rounded-lg relative',
  {
    variants: {
      isGuest: {
        true: 'bg-gray-100 border-gray-200 [&_h4]:text-gray-700 [&_button]:bg-gray-200 [&_button]:text-black',
        false:
          'bg-white border-blue-500 [&_h4]:text-blue-500 [&_button]:bg-blue-500 [&_button]:text-white',
      },
    },
    defaultVariants: {
      isGuest: false,
    },
  },
);

const iconContainerCva = cva(
  'flex justify-center items-center w-9 md:w-12 h-9 md:h-12 rounded-full mt-2',
  {
    variants: {
      isGuest: {
        true: 'text-black bg-gray-200',
        false: 'text-white bg-blue-500',
      },
    },
  },
);

const checkCva = cva('', {
  variants: {
    checked: {
      true: 'text-blue-500',
      false: 'text-gray-500',
    },
  },
  defaultVariants: {
    checked: false,
  },
});

export interface ProvidedFunctionCardProvidedContent {
  label: string;
  checked?: boolean;
}

interface ProvidedFunctionCardProps {
  title: string;
  description: string;
  isGuest?: boolean;
  message: string;
  providedContent: ProvidedFunctionCardProvidedContent[];
}

export default function ProvidedFunctionCard({
  title,
  description,
  isGuest = false,
  message,
  providedContent,
}: ProvidedFunctionCardProps) {
  const { i18n } = useLingui();

  return (
    <div className={containerCva({ isGuest })}>
      <div className="flex flex-col items-center w-full">
        {!isGuest && (
          <div className="absolute top-0 translate-y-[-50%]">
            <Badge variant="secondary" className="bg-blue-500 text-white">
              {i18n.t('Recommended')}
            </Badge>
          </div>
        )}
        <div className={iconContainerCva({ isGuest })}>
          {!isGuest ? <Crown size={20} /> : <User size={20} />}
        </div>
        <span className="mt-3 text-lg font-bold">{title}</span>
        <h4 className="mt-0.5 text-sm">{description}</h4>
        <div className="flex flex-col gap-y-2 md:gap-y-4 w-full mt-4 md:mt-6">
          {providedContent.map((content) => {
            return (
              <div
                key={content.label}
                className="flex flex-row justify-start items-center gap-x-2"
              >
                <Check
                  size={14}
                  className={checkCva({ checked: content.checked })}
                />
                <span className="text-xs md:text-sm">{content.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <Button className="w-full mt-4 md:mt-6">{message}</Button>
    </div>
  );
}
