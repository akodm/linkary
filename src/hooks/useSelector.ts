import { LinkGetResponse } from '@/lib/actions/link';
import { useRouter } from 'next/navigation';
import QueryString from 'qs';
import { useCallback } from 'react';

export default function useSelector() {
  const { push } = useRouter();

  const onSelectFolder = useCallback(
    (url: string, folder?: LinkGetResponse['folders'][number]) => {
      const currentQuery = new URLSearchParams(window.location.search);
      const linkId = currentQuery.get('linkId') || 0;
      const queryString = QueryString.stringify({
        folderId: folder?.id,
        linkId: linkId || undefined,
      });

      push(`${url}/?${queryString}`);
    },
    [push],
  );

  const onSelectLink = useCallback(
    (url: string, link?: LinkGetResponse['links'][number]) => {
      const currentQuery = new URLSearchParams(window.location.search);
      const folderId = currentQuery.get('folderId') || 0;
      const queryString = QueryString.stringify({
        folderId: folderId,
        linkId: link?.id,
      });

      push(`${url}/?${queryString}`);
    },
    [push],
  );

  return {
    onSelectFolder,
    onSelectLink,
  };
}
