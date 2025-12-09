'use client';

import { GetUserActionResponse } from '@/lib/actions/user';
import { selectedFolderAtom, selectedLinkAtom } from '@/lib/atom';
import { useAtomValue } from 'jotai';

interface UserViewerProps {
  user?: GetUserActionResponse | null;
}

export default function UserViewer({ user }: UserViewerProps) {
  const selectedFolder = useAtomValue(selectedFolderAtom);
  const selectedLink = useAtomValue(selectedLinkAtom);

  console.log(Boolean(selectedFolder), Boolean(selectedLink), Boolean(user));

  return (
    <section className="hidden md:flex md:flex-1 bg-white md:border md:border-neutral-200 md:rounded-md md:drop-shadow-xs p-4">
      UserViewer
    </section>
  );
}
