import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={twMerge(
        'flex flex-col items-center w-full py-10 md:py-20 bg-white',
        className,
      )}
    >
      <div
        className="flex flex-col items-center gap-y-10 md:gap-y-20 w-full max-w-320 px-4 md:px-6 mx-auto"
        {...props}
      >
        {children}
      </div>
    </section>
  );
}
