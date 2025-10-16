import { db } from '@/db';
import { getSession } from 'src/lib/actions/auth';
import { eq } from 'drizzle-orm';
import { linkFolder, users } from '@/db/schemas';

export const addFolderAction = async ({
  name,
  order = 0,
}: {
  name: string;
  order?: number;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const [folder] = await db
    .insert(linkFolder)
    .values({
      name,
      order,
      userId: user.id,
    })
    .returning();

  return folder;
};

export type AddFolderActionResponse = Awaited<
  ReturnType<typeof addFolderAction>
>;

export const editFolderAction = async ({
  slug,
  name,
  order,
}: {
  slug: string;
  name?: string;
  order?: number;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const folder = await db.query.linkFolder.findFirst({
    where: eq(linkFolder.slug, slug),
  });

  if (!folder) {
    throw new Error('Folder not found');
  }

  const [updatedFolder] = await db
    .update(linkFolder)
    .set({ name, order })
    .where(eq(linkFolder.slug, slug))
    .returning();

  return updatedFolder;
};

export type EditFolderActionResponse = Awaited<
  ReturnType<typeof editFolderAction>
>;

export const deleteFolderAction = async ({ slug }: { slug: string }) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const folder = await db.query.linkFolder.findFirst({
    where: eq(linkFolder.slug, slug),
    with: {
      links: true,
    },
  });

  if (!folder) {
    throw new Error('Folder not found');
  }

  await db.delete(linkFolder).where(eq(linkFolder.slug, slug));

  return true;
};

export type DeleteFolderActionResponse = Awaited<
  ReturnType<typeof deleteFolderAction>
>;
