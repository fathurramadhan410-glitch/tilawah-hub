import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Target from '@/models/Target';
import ReadingLog from '@/models/ReadingLog';

// Helper untuk ambil nama dari Clerk
async function getUserName(userId: string) {
  try {
    // PERBAIKAN: Tambahkan await di clerkClient()
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.firstName || user.username || user.emailAddresses[0].emailAddress.split('@')[0];
  } catch {
    return 'Pengguna';
  }
}

// GET: Ambil target aktif + data relay terakhir
export async function GET() {
  // PERBAIKAN: Tambahkan await di auth()
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  
  const activeTarget = await Target.findOne({ isActive: true });
  
  if (!activeTarget) {
    return NextResponse.json({ target: null, relayPage: 1, isParticipant: false });
  }

  const isParticipant = activeTarget.participants.some((p: any) => p.id === userId);

  const lastLog = await ReadingLog.findOne({ targetId: activeTarget._id }).sort({ date: -1 });
  const relayPage = lastLog ? lastLog.endPage + 1 : 1;

  const totalDays = Math.ceil((new Date(activeTarget.endDate).getTime() - new Date(activeTarget.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dailyTargetPages = Math.ceil(604 / totalDays);
  const usersCount = activeTarget.participants.length || 1;
  const pagesPerPerson = Math.ceil(dailyTargetPages / usersCount);

  return NextResponse.json({ 
    target: activeTarget, 
    relayPage: relayPage > 604 ? 604 : relayPage, 
    isParticipant,
    calculation: { totalDays, dailyTargetPages, usersCount, pagesPerPerson }
  });
}

// POST: Buat target baru (Khusus Admin/Guru)
export async function POST(req: Request) {
  // PERBAIKAN: Tambahkan await di auth()
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const { name, startDate, endDate, khatamDate } = await req.json();
    const creatorName = await getUserName(userId);

    await Target.updateMany({ isActive: true }, { isActive: false });

    const newTarget = await Target.create({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      khatamDate: new Date(khatamDate),
      isActive: true,
      createdBy: userId,
      participants: [{ id: userId, name: creatorName }],
    });

    return NextResponse.json({ success: true, target: newTarget });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// PATCH: Untuk Join Target
export async function PATCH() {
  // PERBAIKAN: Tambahkan await di auth()
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const target = await Target.findOne({ isActive: true });

  if (!target) return NextResponse.json({ error: 'Tidak ada target aktif' }, { status: 404 });

  const isAlreadyJoined = target.participants.some((p: any) => p.id === userId);
  
  if (!isAlreadyJoined) {
    const userName = await getUserName(userId);
    target.participants.push({ id: userId, name: userName });
    await target.save();
  }

  return NextResponse.json({ success: true, target });
}