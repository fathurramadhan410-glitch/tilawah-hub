'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuatTargetPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [khatamDate, setKhatamDate] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    await fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, startDate, endDate, khatamDate }),
    });
    
    setSubmitting(false);
    setShowModal(true); // Tampilkan modal sukses
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Modal Pop-up Profesional */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-bounce">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Target Berhasil Dibuat!</h4>
            <p className="text-gray-500 mb-6 text-sm">Target khatam baru telah aktif. Peserta sekarang dapat mulai mengikuti target ini.</p>
            <button onClick={() => router.push('/target-khatam')} className="bg-emerald-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-emerald-700 transition">
              Lihat Target
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Buat Target Khatam Baru</h3>
        <p className="text-gray-500 text-sm mb-8">Isi form di bawah untuk memulai rutinan khatam berjamaah.</p>
        
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Target</label>
            <input type="text" placeholder="Misal: Khatam Ramadhan 2024" value={name} onChange={e => setName(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Awal Mengaji</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir Mengaji</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Khatam (Target Selesai)</label>
            <input type="date" value={khatamDate} onChange={e => setKhatamDate(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 cursor-pointer" />
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {submitting ? 'Memproses...' : '🚀 Buat Target Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}