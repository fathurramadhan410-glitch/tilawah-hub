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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-2xl text-white text-center shadow-lg">
        <h2 className="text-2xl font-bold">🏆 Papan Peringkat</h2>
        <p className="text-emerald-100 text-sm mt-1">Pejuang Tilawah Teratas</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        {users.map((u, index) => (
          <div key={u.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <span className={`text-2xl font-bold w-10 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
              {index + 1}
            </span>
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{u.name}</p>
              <p className="text-xs text-gray-500">{u.totalPages} Halaman</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-600">⭐ {u.points}</p>
              <p className="text-xs text-gray-400">Poin</p>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-center text-gray-500 py-4">Belum ada data.</p>}
      </div>
    </div>
  );
}