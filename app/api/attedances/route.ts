import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    // Ambil tanggal hari ini (YYYY-MM-DD)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const todayAttendance = await Attendance.findOne({ clerkId: userId, date: dateStr });
    const history = await Attendance.find({ clerkId: userId }).sort({ date: -1 }).limit(10);

    return NextResponse.json({ todayAttendance, history });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { status, reason } = await req.json();
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    await dbConnect();

    // Cek jika sudah absen hari ini
    const existing = await Attendance.findOne({ clerkId: userId, date: dateStr });
    if (existing) {
      return NextResponse.json({ error: 'Anda sudah absen hari ini' }, { status: 400 });
    }

    const newAttendance = await Attendance.create({
      clerkId: userId,
      date: dateStr,
      status,
      reason: status === 'izin' ? reason : null,
    });

    return NextResponse.json({ success: true, attendance: newAttendance });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}