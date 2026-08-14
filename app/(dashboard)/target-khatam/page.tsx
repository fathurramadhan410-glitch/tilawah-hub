'use client';
import { useState, useEffect } from 'react';

export default function TargetKhatamPage() {
  const [target, setTarget] = useState<any>(null);
  const [calc, setCalc] = useState<any>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/targets');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.target) {
        setTarget(data.target);
        setCalc(data.calculation);
        setIsParticipant(data.isParticipant);
      }
    } catch (error) {
      console.error('Error fetching target:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleJoin = async () => {
    try {
      await fetch('/api/targets', { method: 'PATCH' });
      fetchData();
    } catch (error) {
      console.error('Error joining target:', error);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data target...</div>;

  return (
    <div className="space-y-6">
      {target ? (
        <>
          {/* Info Target Aktif */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">Target Aktif</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{target.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(target.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} → {new Date(target.khatamDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {isParticipant ? (
                <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Peserta Aktif
                </span>
              ) : (
                <button onClick={handleJoin} className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition text-sm font-bold shadow-md">Ikut Target Ini</button>
              )}
            </div>
          </div>

          {/* Kalkulasi Pintar */}
          {calc && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Kalkulasi Tugas Harian</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl shadow-lg text-white">
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Total Hari</p>
                  <h3 className="text-2xl font-bold mt-1">{calc.totalDays}</h3>
                  <p className="text-xs text-blue-200">Hari Mengaji</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-400 to-purple-600 p-4 rounded-xl shadow-lg text-white">
                  <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-wider">Target Jamaah</p>
                  <h3 className="text-2xl font-bold mt-1">{calc.dailyTargetPages}</h3>
                  <p className="text-xs text-indigo-200">Halaman/Hari</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-4 rounded-xl shadow-lg text-white">
                  <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider">Peserta</p>
                  <h3 className="text-2xl font-bold mt-1">{calc.usersCount}</h3>
                  <p className="text-xs text-emerald-200">Orang Aktif</p>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-xl shadow-lg text-white">
                  <p className="text-amber-100 text-[10px] uppercase font-bold tracking-wider">Jatah Anda</p>
                  <h3 className="text-2xl font-bold mt-1">{calc.pagesPerPerson}</h3>
                  <p className="text-xs text-amber-200">Halaman/Hari</p>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl text-center text-indigo-800 font-medium text-sm border border-indigo-100">
                💡 Setiap orang wajib membaca minimal <span className="font-bold">{calc.pagesPerPerson} halaman</span> per hari agar target khatam tepat waktu.
              </div>
            </div>
          )}

          {/* Daftar Peserta */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              👥 Daftar Peserta Target ({target.participants.length} Orang)
            </h3>
            <div className="space-y-3">
              {target.participants.map((p: any, index: number) => (
                <div key={p.id || index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">Bergabung sebagai peserta</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-2xl text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-800 text-xl font-bold">Belum ada target khatam aktif</p>
          <p className="text-gray-500 text-sm mt-2 max-w-xs">Mohon tunggu Admin/Guru untuk membuat target khatam baru.</p>
        </div>
      )}
    </div>
  );
}