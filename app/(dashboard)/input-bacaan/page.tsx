'use client';
import { useState, useEffect } from 'react';

export default function InputBacaanPage() {
  const [relayPage, setRelayPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [juz, setJuz] = useState(1);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const fetchRelay = async () => {
      try {
        const res = await fetch('/api/targets');
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        if (data.target) {
          setIsParticipant(data.isParticipant);
          setRelayPage(data.relayPage);
          setEndPage(data.relayPage);
          setJuz(Math.ceil(data.relayPage / 20));
        }
      } catch (error) { console.error('Error:', error); }
      setLoading(false);
    };
    fetchRelay();
  }, []);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startPage: relayPage, endPage, juz }),
      });
      if (!res.ok) { alert('Gagal menyimpan'); setSubmitting(false); return; }
      
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      
      const relayRes = await fetch('/api/targets');
      if (relayRes.ok) {
        const data = await relayRes.json();
        if (data.target) { setRelayPage(data.relayPage); setEndPage(data.relayPage); }
      }
    } catch (error) { console.error(error); }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data relay...</div>;

  if (!isParticipant) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl text-yellow-700">
        Anda belum mengikuti Target Khatam. Silakan ikut target terlebih dahulu di halaman Target Khatam.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      
      {showNotif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl text-center font-semibold animate-bounce">
          Bacaan berhasil dicatat! Halaman relay telah diperbarui.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Input Bacaan */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Input Bacaan (Relay)</h3>
          <p className="text-gray-500 text-sm mb-8">Sistem otomatis menyambung halaman dari pembaca sebelumnya.</p>
          
          <form onSubmit={handleLog} className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <label className="block text-sm font-bold text-emerald-800 mb-1">Halaman Awal (Otomatis)</label>
              <input type="number" value={relayPage} readOnly className="w-full p-4 bg-white border border-emerald-200 rounded-xl text-gray-900 font-bold text-xl cursor-not-allowed focus:ring-2 focus:ring-emerald-500/50" />
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Halaman ini dikunci oleh sistem relay.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Akhir</label>
              <input type="number" value={endPage} onChange={(e) => setEndPage(Number(e.target.value))} min={relayPage} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Juz Ke-</label>
              <select value={juz} onChange={(e) => setJuz(Number(e.target.value))} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white text-lg">
                {Array.from({length: 30}, (_, i) => i + 1).map(j => <option key={j} value={j}>Juz {j}</option>)}
              </select>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
              {submitting ? 'Menyimpan...' : 'Simpan & Lanjutkan Relay'}
            </button>
          </form>
        </div>

        {/* Panel Informatif */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-emerald-800 p-6 rounded-2xl text-white shadow-lg h-full flex flex-col justify-center">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">💡 Cara Kerja Relay</h4>
            <ul className="space-y-3 text-sm text-emerald-100">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">1.</span> Sistem mengambil halaman terakhir dari jamaah.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">2.</span> Anda melanjutkan bacaan dari halaman tersebut.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">3.</span> Halaman akhir Anda menjadi awal untuk peserta berikutnya.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">4.</span> Tidak ada lagi tabrakan halaman antar peserta!
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}