import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Haikunator, { Config } from 'haikunator';

const h = new Haikunator();
const defaultOptions: Config = { delimiter: '-', tokenLength: 4 };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateName(options: Config = defaultOptions) {
  const name = h.haikunate(options);

  return name;
}
