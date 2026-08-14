import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ReadingLog from '@/models/ReadingLog';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // Agregasi untuk hitung total halaman per user
    const topLogs = await ReadingLog.aggregate([
      { $group: { _id: '$clerkId', totalPages: { $sum: '$pagesRead' } } },
      { $sort: { totalPages: -1 } },
      { $limit: 10 }
    ]);

    // Ambil nama dari Clerk
    const client = await clerkClient();
    const topUsers = await Promise.all(topLogs.map(async (log) => {
      try {
        const user = await client.users.getUser(log._id);
        return {
          id: log._id,
          name: user.firstName || user.username || 'Pengguna',
          totalPages: log.totalPages,
          points: log.totalPages * 10
        };
      } catch {
        return null;
      }
    }));

    const validUsers = topUsers.filter(u => u !== null);

    return NextResponse.json({ topUsers: validUsers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}