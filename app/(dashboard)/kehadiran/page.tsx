'use client';
import { useState, useEffect } from 'react';

export default function KehadiranPage() {
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [reason, setReason] = useState('');
  const [showNotif, setShowNotif] = useState('');

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

  const handleCheckIn = async () => {
    setSubmitting(true);
    const res = await fetch('/api/attendances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'hadir' }),
    });
    if (res.ok) {
      setShowNotif('Alhamdulillah, kehadiran berhasil dicatat!');
      setTimeout(() => setShowNotif(''), 3000);
      fetchData();
    }
    setSubmitting(false);
  };

  const handleLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/attendances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'izin', reason }),
    });
    if (res.ok) {
      setShowNotif('Izin tersimpan.');
      setTimeout(() => setShowNotif(''), 3000);
      setShowReasonForm(false);
      setReason('');
      fetchData();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data kehadiran...</div>;

  return (
    <div className="space-y-6">
      {showNotif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg">{showNotif}</div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Absensi Hari Ini</h3>
        
        {todayAttendance ? (
          <div className={`p-4 rounded-xl text-center font-bold ${todayAttendance.status === 'hadir' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {todayAttendance.status === 'hadir' ? '✅ Anda sudah tercatat hadir hari ini' : `📝 Anda izin: "${todayAttendance.reason}"`}
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={handleCheckIn} disabled={submitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700 transition">
              ✔️ Tandai Hadir
            </button>
            
            {!showReasonForm ? (
              <button onClick={() => setShowReasonForm(true)} className="w-full bg-gray-100 text-gray-700 p-4 rounded-xl font-bold hover:bg-gray-200 transition">
                📝 Ajukan Izin
              </button>
            ) : (
              <form onSubmit={handleLeave} className="space-y-3">
                <textarea value={reason} onChange={e => setReason(e.target.value)} required placeholder="Alasan izin..." className="w-full p-3 border rounded-lg" rows={3} />
                <button type="submit" disabled={submitting} className="w-full bg-yellow-500 text-white p-3 rounded-lg font-bold">Kirim Izin</button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Riwayat 10 Absensi</h3>
        <div className="space-y-2">
          {history.map(att => (
            <div key={att._id} className="flex justify-between p-2 border-b">
              <span>{new Date(att.date).toLocaleDateString('id-ID')}</span>
              <span className={att.status === 'hadir' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>{att.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}