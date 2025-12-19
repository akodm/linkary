'use client';

import { LinkAndFolderCommunityResponse } from '@/lib/actions/link';
import LinkCard from 'src/components/community/LinkCard';
import { Badge } from 'src/components/ui/badge';
import { useLingui } from '@lingui/react';

interface ContentProps {
  links: LinkAndFolderCommunityResponse['data'];
  total: number;
}

export default function Content({ links, total }: ContentProps) {
  const { i18n } = useLingui();

  return (
    <section className="flex flex-col items-center w-full h-full bg-white relative">
      <div className="flex flex-row items-center w-full max-w-320 mx-auto px-4 pt-6">
        <Badge variant="outline">
          {i18n.t('Total')}: {total}
        </Badge>
      </div>
      {links.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 w-full max-w-320 mx-auto px-4 pt-4 pb-10">
          {links.map((link) => {
            return <LinkCard key={link.id} link={link} />;
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-sm text-neutral-500">
            {i18n.t('There are no shared links yet.')}
          </p>
        </div>
      )}
    </section>
  );
}
