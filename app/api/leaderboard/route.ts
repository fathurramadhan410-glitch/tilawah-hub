import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ReadingLog from '@/models/ReadingLog';
import QuizAttempt from '@/models/QuizAttempt';

// Helper untuk ambil nama dari Clerk
async function getUsersData(userIds: string[]) {
  const client = await clerkClient();
  const users = await Promise.all(userIds.map(async (id) => {
    try {
      const u = await client.users.getUser(id);
      return { id, name: u.firstName || u.username || 'Pengguna' };
    } catch {
      return null;
    }
  }));
  return users.filter(u => u !== null);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // 1. LEADERBOARD TILAWAH (30 Hari Terakhir)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topReadersData = await ReadingLog.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$clerkId', totalPages: { $sum: '$pagesRead' }, totalLogs: { $sum: 1 } } },
      { $sort: { totalPages: -1 } },
      { $limit: 10 }
    ]);

    const readerIds = topReadersData.map(r => r._id);
    const readerUsers = await getUsersData(readerIds);
    
    const tilawahLeaderboard = topReadersData.map(r => {
      const u = readerUsers.find(usr => usr.id === r._id);
      return {
        id: r._id,
        name: u?.name || 'Pengguna',
        totalPages: r.totalPages,
        totalLogs: r.totalLogs,
        points: r.totalPages * 10
      };
    }).filter(u => u.name !== 'Pengguna' || readerIds.includes(u.id)); // Pastikan nama tidak null

    // 2. LEADERBOARD KUIS (Total Skor Semua Waktu)
    const topQuizData = await QuizAttempt.aggregate([
      { $group: { _id: '$clerkId', totalScore: { $sum: '$score' } } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);

    const quizIds = topQuizData.map(q => q._id);
    const quizUsers = await getUsersData(quizIds);
    
    const quizLeaderboard = topQuizData.map(q => {
      const u = quizUsers.find(usr => usr.id === q._id);
      return {
        id: q._id,
        name: u?.name || 'Pengguna',
        totalScore: q.totalScore,
        correctAnswers: Math.floor(q.totalScore / 10) // 1 benar = 10 poin
      };
    });

    return NextResponse.json({ 
      tilawahLeaderboard, 
      quizLeaderboard 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}