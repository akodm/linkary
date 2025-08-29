'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { HTMLAttributes, useMemo } from 'react';

const classes = cva('aspect-square relative', {
  variants: {
    size: {
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface LogoProps
  extends VariantProps<typeof classes>,
    HTMLAttributes<HTMLDivElement> {}

export default function Logo({ size, className, ...props }: LogoProps) {
  const { theme } = useTheme();
  const isDarkMode = useMemo(() => theme === 'dark', [theme]);

  return (
    <div className={classes({ size, className })} {...props}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={isDarkMode ? '#1e40af' : '#3b82f6'}
          stroke={isDarkMode ? '#60a5fa' : '#1e40af'}
          strokeWidth="2"
        />
        <g transform="translate(50,50)">
          <rect
            x="-25"
            y="-8"
            width="20"
            height="16"
            rx="8"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <rect
            x="5"
            y="-8"
            width="20"
            height="16"
            rx="8"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="0" cy="0" r="6" fill="white" />
          <circle
            cx="0"
            cy="0"
            r="2"
            fill={isDarkMode ? '#1e40af' : '#3b82f6'}
          />
        </g>
      </svg>
    </div>
  );
}
