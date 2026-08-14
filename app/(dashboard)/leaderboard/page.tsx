'use client';
import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(data => {
      if (data.topUsers) setUsers(data.topUsers);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat peringkat...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-8 rounded-2xl text-white text-center shadow-xl">
        <h2 className="text-3xl font-extrabold tracking-tight">🏆 Papan Peringkat</h2>
        <p className="text-indigo-200 text-sm mt-2">Pejuang Tilawah Teratas</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {users.map((u, index) => {
          const rank = index + 1;
          let medal = "🏅";
          let bgClass = "bg-gray-50 border-gray-100";
          
          if (rank === 1) { medal = "🥇"; bgClass = "bg-yellow-50 border-yellow-200 shadow-md"; }
          else if (rank === 2) { medal = "🥈"; bgClass = "bg-gray-50 border-gray-300 shadow-sm"; }
          else if (rank === 3) { medal = "🥉"; bgClass = "bg-orange-50 border-orange-200 shadow-sm"; }

          return (
            <div key={u.id} className={`flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-md ${bgClass}`}>
              <span className={`text-3xl font-bold w-12 text-center ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-gray-400'}`}>
                {medal}
              </span>
              
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold uppercase ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : rank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-indigo-500'}`}>
                {u.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{u.name}</p>
                  {rank === 1 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                      🍗 Reward 2 Porsi Khatam
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{u.totalPages} Halaman Dibaca</p>
              </div>
              
              <div className="text-right">
                <p className="font-extrabold text-yellow-600 text-lg">⭐ {u.points}</p>
                <p className="text-[10px] text-gray-400 uppercase">Poin</p>
              </div>
            </div>
          );
        })}
        {users.length === 0 && <p className="text-center text-gray-500 py-8">Belum ada data peringkat.</p>}
      </div>
    </div>
  );
}