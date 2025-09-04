import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function HeaderWeb({
  className,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header {...props} className={clsx('hidden sm:block', className)}></header>
  );
}
