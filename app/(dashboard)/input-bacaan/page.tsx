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
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.target) {
          setIsParticipant(data.isParticipant);
          setRelayPage(data.relayPage);
          setEndPage(data.relayPage); // Default end page sama dengan start
          setJuz(Math.ceil(data.relayPage / 20)); // Auto juz
        }
      } catch (error) {
        console.error('Error fetching relay:', error);
      } finally {
        setLoading(false);
      }
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

      if (!res.ok) {
        alert('Gagal menyimpan bacaan. Coba lagi.');
        setSubmitting(false);
        return;
      }

      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      
      // Refresh relay page
      const relayRes = await fetch('/api/targets');
      if (relayRes.ok) {
        const data = await relayRes.json();
        if (data.target) {
          setRelayPage(data.relayPage);
          setEndPage(data.relayPage);
        }
      }
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setSubmitting(false);
    }
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
    <div className="max-w-2xl mx-auto space-y-6">
      
      {showNotif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl text-center font-semibold">
          Bacaan berhasil dicatat! Halaman relay telah diperbarui.
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Input Bacaan (Relay)</h3>
        <p className="text-gray-500 text-sm text-center mb-8">Sistem otomatis menyambung halaman dari pembaca sebelumnya.</p>
        
        <form onSubmit={handleLog} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Awal (Otomatis)</label>
            <input type="number" value={relayPage} readOnly className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-bold cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">*Halaman ini dikunci oleh sistem relay.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Akhir</label>
            <input type="number" value={endPage} onChange={(e) => setEndPage(Number(e.target.value))} min={relayPage} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Juz Ke-</label>
            <select value={juz} onChange={(e) => setJuz(Number(e.target.value))} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white">
              {Array.from({length: 30}, (_, i) => i + 1).map(j => <option key={j} value={j}>Juz {j}</option>)}
            </select>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 transition">
            {submitting ? 'Menyimpan...' : 'Simpan & Lanjutkan Relay'}
          </button>
        </form>
      </div>
    </div>
  );
}