import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function HeaderMobile({
  className,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header {...props} className={clsx('block sm:hidden', className)}></header>
  );
}
