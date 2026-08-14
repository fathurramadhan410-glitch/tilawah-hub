import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ReadingLog from '@/models/ReadingLog';
import Target from '@/models/Target';

// Fungsi untuk MENYIMPAN log bacaan baru
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // PERBAIKAN: Pastikan userId adalah string
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startPage, endPage, juz } = await req.json();
    const pagesRead = endPage - startPage + 1;

    if (pagesRead <= 0) {
      return NextResponse.json({ error: 'Halaman akhir harus lebih besar dari awal' }, { status: 400 });
    }

    await dbConnect();

    const activeTarget = await Target.findOne({ isActive: true });
    const targetId = activeTarget ? activeTarget._id : null;

    const log = await ReadingLog.create({
      clerkId: userId,
      targetId,
      startPage,
      endPage,
      pagesRead,
      juz,
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('API POST /api/logs Error:', error.message);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// Fungsi untuk MENGAMBIL riwayat bacaan user yang login
export async function GET() {
  try {
    const { userId } = await auth();

    // PERBAIKAN: Pastikan userId adalah string
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const logs = await ReadingLog.find({ clerkId: userId }).sort({ date: -1 }).limit(5);
    
    const totalLogs = await ReadingLog.find({ clerkId: userId });
    const totalPages = totalLogs.reduce((acc: number, log: any) => acc + log.pagesRead, 0);

    return NextResponse.json({ logs, totalPages });
  } catch (error: any) {
    console.error('API GET /api/logs Error:', error.message);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}