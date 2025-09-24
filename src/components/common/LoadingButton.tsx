import { Loader2Icon } from 'lucide-react';
import { ComponentProps, useTransition } from 'react';
import { Button } from 'src/components/ui/button';

export default function LoadingButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    startTransition(() => {
      props.onClick?.(e);
    });
  };

  return (
    <Button disabled={isPending} {...props} onClick={onClick}>
      {isPending ? <Loader2Icon className="mx-auto animate-spin" /> : children}
    </Button>
  );
}
