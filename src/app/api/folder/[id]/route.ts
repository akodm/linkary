import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { sentryCaptureException } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { linkFolder, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { name } = await req.json();

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { data: null, error: 'User session is not found' },
        { status: 401 },
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { data: null, error: 'Name is required' },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 403 },
      );
    }

    const folder = await db.query.linkFolder.findFirst({
      where: (lf, { eq, and }) =>
        and(eq(lf.id, parseInt(id)), eq(lf.userId, user.id)),
    });

    if (!folder) {
      return NextResponse.json(
        { data: null, error: 'Folder not found' },
        { status: 403 },
      );
    }

    const [updatedFolder] = await db
      .update(linkFolder)
      .set({ name })
      .where(eq(linkFolder.id, parseInt(id)))
      .returning();

    if (!updatedFolder) {
      throw new Error('Failed to update folder');
    }

    return NextResponse.json({ data: updatedFolder }, { status: 200 });
  } catch (err) {
    console.error('Failed to update folder');

    sentryCaptureException(err, 'updateFolder', { id, name });

    return NextResponse.json(
      { data: null, error: 'Failed to update folder' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { data: null, error: 'User session is not found' },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 403 },
      );
    }

    const folder = await db.query.linkFolder.findFirst({
      where: (lf, { eq, and }) =>
        and(eq(lf.id, parseInt(id)), eq(lf.userId, user.id)),
    });

    if (!folder) {
      return NextResponse.json(
        { data: null, error: 'Folder not found' },
        { status: 403 },
      );
    }

    await db.delete(linkFolder).where(eq(linkFolder.id, parseInt(id)));

    return NextResponse.json({ data: null }, { status: 200 });
  } catch (err) {
    console.error('Failed to delete folder');

    sentryCaptureException(err, 'deleteFolder', { id });

    return NextResponse.json(
      { data: null, error: 'Failed to delete folder' },
      { status: 500 },
    );
  }
}

export type UpdateFolderResponse = Awaited<ReturnType<typeof PUT>>;
export type DeleteFolderResponse = Awaited<ReturnType<typeof DELETE>>;
