import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import { getDailyQuestions } from '@/lib/questions';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const today = new Date().toISOString().split('T')[0];
    const todayAttempt = await QuizAttempt.findOne({ clerkId: userId, date: today });
    
    const questions = getDailyQuestions().map((q, index) => ({
      id: index,
      question: q.q,
      options: q.o,
      category: q.c
    }));

    return NextResponse.json({ todayAttempt, questions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { answers } = await req.json();
    const today = new Date().toISOString().split('T')[0];

    await dbConnect();

    const existing = await QuizAttempt.findOne({ clerkId: userId, date: today });
    if (existing) {
      return NextResponse.json({ error: 'Sudah mengerjakan kuis hari ini' }, { status: 400 });
    }

    const dailyQuestions = getDailyQuestions();
    let correctCount = 0;
    
    answers.forEach((ans: { id: number, answer: string }) => {
      if (dailyQuestions[ans.id] && dailyQuestions[ans.id].a === ans.answer) {
        correctCount++;
      }
    });

    const score = correctCount * 10;
    const attempt = await QuizAttempt.create({ clerkId: userId, date: today, score });
    
    return NextResponse.json({ success: true, score, correctCount, totalQuestions: dailyQuestions.length });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}