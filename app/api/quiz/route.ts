import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const today = new Date().toISOString().split('T')[0];
    const todayAttempt = await QuizAttempt.findOne({ clerkId: userId, date: today });
    
    return NextResponse.json({ todayAttempt });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { score } = await req.json();
    const today = new Date().toISOString().split('T')[0];

    await dbConnect();

    const existing = await QuizAttempt.findOne({ clerkId: userId, date: today });
    if (existing) {
      return NextResponse.json({ error: 'Sudah mengerjakan kuis hari ini' }, { status: 400 });
    }

    const attempt = await QuizAttempt.create({ clerkId: userId, date: today, score });
    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}