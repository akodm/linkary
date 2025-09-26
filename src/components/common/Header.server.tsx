import { ComponentProps } from 'react';
import Header from '@/components/common/Header.client';
import { getSession } from '@/lib/actions/auth';

export default async function HeaderServer({
  ...props
}: ComponentProps<typeof Header>) {
  const session = await getSession();

  return <Header {...props} session={session} />;
}
