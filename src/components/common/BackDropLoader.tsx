import { Loader2Icon } from 'lucide-react';

export default function BackDropLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black/50 fixed inset-0 z-999">
      <Loader2Icon color="black" className="mx-auto animate-spin" />
    </div>
  );
}
