import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.findOne({ clerkId: userId, date: today });
    
    // Ambil 30 riwayat terakhir
    const history = await Attendance.find({ clerkId: userId }).sort({ date: -1 }).limit(30);

    return NextResponse.json({ todayAttendance, history });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { status, reason, leaveType, date: reqDate } = await req.json();
    
    // Jika tidak ada tanggal dikirim, gunakan hari ini
    const dateStr = reqDate || new Date().toISOString().split('T')[0];

    await dbConnect();

    const existing = await Attendance.findOne({ clerkId: userId, date: dateStr });
    if (existing) {
      return NextResponse.json({ error: 'Anda sudah absen di tanggal tersebut' }, { status: 400 });
    }

    const newAttendance = await Attendance.create({
      clerkId: userId,
      date: dateStr,
      status,
      leaveType: status === 'izin' ? leaveType : null,
      reason: status === 'izin' ? reason : null,
    });

    return NextResponse.json({ success: true, attendance: newAttendance });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}