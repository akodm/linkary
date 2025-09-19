import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Haikunator, { Config } from 'haikunator';
import * as Sentry from '@sentry/nextjs';
import { utcNow } from 'src/lib/date';

const h = new Haikunator();
const defaultOptions: Config = { delimiter: '-', tokenLength: 4 };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateName(options: Config = defaultOptions) {
  const name = h.haikunate(options);

  return name;
}

export function sentryCaptureException(
  err: Error | unknown,
  action: string,
  extra: Record<string, unknown>,
) {
  Sentry.captureException(err as Error, {
    tags: {
      action,
    },
    extra: {
      ...extra,
      timestamp: utcNow(),
    },
  });
}
