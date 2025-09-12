import { motion } from 'motion/react';
import { type ComponentProps, type ElementType } from 'react';

const DEFAULT_VARIANT = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

type PolymorphicProps<E extends ElementType> = Omit<
  ComponentProps<typeof motion.h1>,
  'as'
> &
  Omit<ComponentProps<E>, 'as'> & {
    as?: E;
  };

export default function GeneralAnimator<E extends ElementType = 'h1'>(
  props: PolymorphicProps<E>,
) {
  const { as, children, ...rest } = props as PolymorphicProps<ElementType>;
  const Tag = (as || 'h1') as ElementType;
  const MotionTag = motion(Tag as ElementType) as ElementType;

  return (
    <MotionTag
      variants={DEFAULT_VARIANT}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </MotionTag>
  );
}
