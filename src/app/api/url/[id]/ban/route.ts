export async function POST() {}

export async function PUT() {}

export async function DELETE() {}

export type BanUrlResponse = Awaited<ReturnType<typeof POST>>;
export type UpdateUrlResponse = Awaited<ReturnType<typeof PUT>>;
export type DeleteUrlResponse = Awaited<ReturnType<typeof DELETE>>;
