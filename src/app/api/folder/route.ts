import { db } from '@/db';
import { linkFolder, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

    const [data] = await db
      .insert(linkFolder)
      .values({
        userId: user.id,
        name,
      })
      .returning();

    if (!data) {
      throw new Error('Failed to create folder');
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Failed to create folder');

    sentryCaptureException(err, 'createFolder', { name });

    return NextResponse.json(
      { data: null, error: 'Failed to create folder' },
      { status: 500 },
    );
  }
}

export type CreateFolderResponse = Awaited<ReturnType<typeof POST>>;
