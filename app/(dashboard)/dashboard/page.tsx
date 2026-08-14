'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // State untuk form input
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [juz, setJuz] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Ambil role user dari Clerk
  const role = String(user?.publicMetadata?.role || 'murid');

  // Fungsi untuk mengambil data dari API (Safe Fetch)
  const fetchData = async () => {
    try {
      const res = await fetch('/api/logs');
      if (!res.ok) {
        console.error('Gagal mengambil data logs');
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menyimpan bacaan baru (Safe Fetch)
  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startPage, endPage, juz }),
      });

      if (!res.ok) {
        alert('Gagal menyimpan bacaan. Coba lagi.');
        setSubmitting(false);
        return;
      }

      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data statistik...</div>;

  // Data dinamis berdasarkan database
  const stats = [
    { label: 'Total Halaman', value: totalPages, total: '604', color: 'from-indigo-500 to-purple-600', icon: '📖' },
    { label: 'Streak Aktif', value: '0', total: 'Hari', color: 'from-emerald-500 to-green-600', icon: '🔥' },
    { label: 'Total Poin', value: totalPages * 10, total: 'Poin', color: 'from-amber-500 to-orange-600', icon: '⭐' },
    { label: 'Role Anda', value: role.toUpperCase(), total: 'Akun', color: 'from-pink-500 to-rose-600', icon: '👤' },
  ];

  // Data dummy grafik (Nanti bisa diupdate berdasarkan log harian)
  const weeklyData = [
    { day: 'Sen', pages: 5 }, { day: 'Sel', pages: 8 }, { day: 'Rab', pages: 4 },
    { day: 'Kam', pages: 10 }, { day: 'Jum', pages: 6 }, { day: 'Sab', pages: 7 }, { day: 'Min', pages: 12 },
  ];
  const maxPages = Math.max(...weeklyData.map(d => d.pages));

  return (
    <div className="space-y-6 relative">
      
      {showNotif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-center space-x-2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-semibold text-sm">MasyaAllah, bacaan berhasil dicatat!</span>
        </div>
      )}

      {/* Kartu Statistik Dinamis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <h3 className="text-3xl font-extrabold mb-1">{stat.value}</h3>
            <p className="text-sm opacity-80">{stat.label} ({stat.total})</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Batang (Bar Chart) Kemajuan */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📈 Kemajuan Mingguan (Halaman)</h3>
          <div className="flex items-end justify-between h-48 space-x-2 md:space-x-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-bold text-gray-500 mb-1">{data.pages}</span>
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(data.pages / maxPages) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Input Bacaan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Catat Bacaan Hari Ini</h3>
          
          <form onSubmit={handleLog} className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Juz Ke-</label>
              <select value={juz} onChange={(e) => setJuz(Number(e.target.value))} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white">
                {Array.from({length: 30}, (_, i) => i + 1).map(j => <option key={j} value={j}>Juz {j}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Awal</label>
                <input type="number" value={startPage} onChange={(e) => setStartPage(Number(e.target.value))} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Akhir</label>
                <input type="number" value={endPage} onChange={(e) => setEndPage(Number(e.target.value))} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition mt-4">
              {submitting ? 'Menyimpan...' : 'Simpan Log Bacaan'}
            </button>
          </form>
        </div>

      </div>

      {/* Riwayat Bacaan Terakhir */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📖 Riwayat 5 Bacaan Terakhir</h3>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <span className="font-medium text-gray-900 text-sm">Hal. {log.startPage} - {log.endPage}</span>
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 py-1 px-2 rounded-full">Juz {log.juz}</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(log.date).toLocaleDateString('id-ID')}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-500 text-sm">Belum ada catatan bacaan.</p>}
        </div>
      </div>

    </div>
  );
}