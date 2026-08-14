'use client';
import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [tilawahUsers, setTilawahUsers] = useState<any[]>([]);
  const [quizUsers, setQuizUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tilawah' | 'kuis'>('tilawah');

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(data => {
      if (data.tilawahLeaderboard) setTilawahUsers(data.tilawahLeaderboard);
      if (data.quizLeaderboard) setQuizUsers(data.quizLeaderboard);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat peringkat...</div>;

  const renderRow = (u: any, index: number, type: 'tilawah' | 'kuis') => {
    const rank = index + 1;
    let medal = "🏅";
    let bgClass = "bg-gray-50 border-gray-100";
    let avatarBg = "bg-indigo-500";
    
    if (rank === 1) { medal = "🥇"; bgClass = "bg-yellow-50 border-yellow-200 shadow-md"; avatarBg = "bg-gradient-to-br from-yellow-400 to-amber-600"; }
    else if (rank === 2) { medal = "🥈"; bgClass = "bg-gray-50 border-gray-300 shadow-sm"; avatarBg = "bg-gradient-to-br from-gray-400 to-gray-600"; }
    else if (rank === 3) { medal = "🥉"; bgClass = "bg-orange-50 border-orange-200 shadow-sm"; avatarBg = "bg-gradient-to-br from-orange-400 to-red-500"; }

    return (
      <div key={u.id} className={`flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-md ${bgClass}`}>
        <span className={`text-3xl font-bold w-12 text-center ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-gray-400'}`}>
          {medal}
        </span>
        
        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold uppercase ${avatarBg}`}>
          {u.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900">{u.name}</p>
            {rank === 1 && type === 'tilawah' && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                🍗 Reward 2 Porsi Khatam
              </span>
            )}
          </div>
          {type === 'tilawah' ? (
            <p className="text-xs text-gray-500">{u.totalPages} Halaman Dibaca ({u.totalLogs}x Input)</p>
          ) : (
            <p className="text-xs text-gray-500">{u.correctAnswers} Jawaban Benar</p>
          )}
        </div>
        
        <div className="text-right">
          {type === 'tilawah' ? (
            <>
              <p className="font-extrabold text-yellow-600 text-lg">⭐ {u.points}</p>
              <p className="text-[10px] text-gray-400 uppercase">Poin Tilawah</p>
            </>
          ) : (
            <>
              <p className="font-extrabold text-emerald-600 text-lg">🧠 {u.totalScore}</p>
              <p className="text-[10px] text-gray-400 uppercase">Skor Kuis</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-8 rounded-2xl text-white text-center shadow-xl">
        <h2 className="text-3xl font-extrabold tracking-tight">🏆 Papan Peringkat</h2>
        <p className="text-indigo-200 text-sm mt-2">Para Pejuang Tilawah & Kuis Terbaik</p>
      </div>

      {/* Tab Pilihan */}
      <div className="flex justify-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <button 
          onClick={() => setActiveTab('tilawah')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${activeTab === 'tilawah' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          📖 Tilawah Bulanan
        </button>
        <button 
          onClick={() => setActiveTab('kuis')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${activeTab === 'kuis' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          🧠 Kuis Harian
        </button>
      </div>

      {/* Konten Tab */}
      <div className="space-y-4">
        {activeTab === 'tilawah' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 Pembaca Al-Qur'an (30 Hari)</h3>
            {tilawahUsers.map((u, i) => renderRow(u, i, 'tilawah'))}
            {tilawahUsers.length === 0 && <p className="text-center text-gray-500 py-8">Belum ada data tilawah bulan ini.</p>}
          </div>
        )}

        {activeTab === 'kuis' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 Jawaban Kuis Terbanyak</h3>
            {quizUsers.map((u, i) => renderRow(u, i, 'kuis'))}
            {quizUsers.length === 0 && <p className="text-center text-gray-500 py-8">Belum ada data kuis.</p>}
          </div>
        )}
      </div>

    </div>
  );
}