'use client';
import { useState, useEffect } from 'react';

const notify = (type: 'success' | 'error', message: string) => {
  window.dispatchEvent(new CustomEvent('notify', { detail: { type, message } }));
};

export default function KehadiranPage() {
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Sakit');
  const [reason, setReason] = useState('');
  
  const [showLateModal, setShowLateModal] = useState(false);
  const [lateDate, setLateDate] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/attendances');
      if (res.ok) {
        const data = await res.json();
        setTodayAttendance(data.todayAttendance);
        setHistory(data.history || []);
      }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async (date = new Date().toISOString().split('T')[0]) => {
    setScanning(true);
    setTimeout(async () => {
      const res = await fetch('/api/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hadir', date }),
      });
      
      if (res.ok) {
        notify('success', 'Sidik jari terverifikasi! Kehadiran dicatat.');
        setShowLateModal(false);
        fetchData();
      } else {
        const err = await res.json();
        notify('error', err.error || 'Gagal absen.');
      }
      setScanning(false);
    }, 1500);
  };

  const handleLeave = async (e: React.FormEvent, date = new Date().toISOString().split('T')[0]) => {
    e.preventDefault();
    const res = await fetch('/api/attendances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'izin', leaveType, reason, date }),
    });
    
    if (res.ok) {
      notify('success', 'Izin berhasil disimpan.');
      setShowLeaveModal(false);
      setShowLateModal(false);
      setReason('');
      fetchData();
    } else {
      const err = await res.json();
      notify('error', err.error || 'Gagal ajukan izin.');
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data kehadiran...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kartu Absensi Hari Ini (Border Tegas) */}
        <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-800 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Absensi Hari Ini</h3>
          <p className="text-gray-500 text-sm mb-6">Rutinitas harian untuk menjaga konsistensi istiqamah.</p>
          
          {todayAttendance ? (
            <div className={`p-6 rounded-xl w-full border-2 ${todayAttendance.status === 'hadir' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-yellow-50 border-yellow-500 text-yellow-700'}`}>
              <p className="font-bold text-lg">
                {todayAttendance.status === 'hadir' ? '✅ Anda Sudah Hadir' : `📝 Izin: ${todayAttendance.leaveType}`}
              </p>
              {todayAttendance.reason && <p className="text-sm mt-2 italic">"{todayAttendance.reason}"</p>}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-6 mb-6">
                <button 
                  onClick={() => handleCheckIn()} 
                  disabled={scanning}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${scanning ? 'bg-emerald-100' : 'bg-emerald-50 hover:bg-emerald-100'} border-4 ${scanning ? 'border-emerald-500' : 'border-emerald-200'}`}
                >
                  {scanning ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.66-.9 3-2 3s-2-1.34-2-3 2-5 4-5 4 3.34 4 5-2 3-4 3z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8c2-2 4-2 7-2s5 0 7 2M7 12c1-1 3-1 5-1s4 0 5 1M9 16c0-1 1-1 3-1s3 0 3 1"></path>
                    </svg>
                  )}
                </button>
                <span className="text-sm font-medium text-gray-700">{scanning ? 'Memindai Sidik Jari...' : 'Sentuh ikon untuk Absen'}</span>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button onClick={() => setShowLeaveModal(true)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition border border-gray-300">📝 Ajukan Izin</button>
                <button onClick={() => setShowLateModal(true)} className="w-full bg-indigo-50 text-indigo-800 py-3 rounded-xl font-bold hover:bg-indigo-100 transition border border-indigo-300">⏳ Absensi Tunda (Terlupa)</button>
              </div>
            </>
          )}
        </div>

        {/* Kartu Riwayat 30 Hari */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Riwayat 30 Hari Terakhir</h3>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {history.map(att => (
                  <tr key={att._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(att.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${att.status === 'hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {att.status === 'hadir' ? 'Hadir' : att.leaveType || 'Izin'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[150px]">{att.reason || '-'}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Belum ada riwayat.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL AJUKAN IZIN (Perbaikan Teks Dropdown) */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowLeaveModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Formulir Pengajuan Izin</h3>
            <form onSubmit={handleLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Izin</label>
                <select 
                  value={leaveType} 
                  onChange={e => setLeaveType(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                >
                  <option value="Sakit" className="text-black bg-white">Sakit</option>
                  <option value="Izin" className="text-black bg-white">Izin (Urusan Keluarga/dll)</option>
                  <option value="Kesibukan" className="text-black bg-white">Kesibukan (Pekerjaan/Sekolah)</option>
                  <option value="Lainnya" className="text-black bg-white">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white p-3 rounded-lg font-bold">Kirim</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABSENSI TUNDA (Perbaikan Teks Kalender) */}
      {showLateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowLateModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Absensi Tunda</h3>
            <p className="text-sm text-gray-500 mb-4">Pilih tanggal di mana Anda lupa absen (maksimal 1 tahun ke belakang).</p>
            <div className="space-y-4">
              <input 
                type="date" 
                value={lateDate} 
                onChange={e => setLateDate(e.target.value)} 
                max={new Date().toISOString().split('T')[0]} 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
              />
              {lateDate && (
                <div className="flex gap-3">
                  <button onClick={() => handleCheckIn(lateDate)} className="flex-1 bg-emerald-600 text-white p-3 rounded-lg font-bold">Tandai Hadir</button>
                  <button onClick={(e) => { setLeaveType('Izin'); handleLeave(e, lateDate); }} className="flex-1 bg-yellow-500 text-white p-3 rounded-lg font-bold">Ajukan Izin</button>
                </div>
              )}
              <button onClick={() => setShowLateModal(false)} className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg font-bold">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}