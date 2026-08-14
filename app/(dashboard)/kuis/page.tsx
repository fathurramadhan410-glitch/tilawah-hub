'use client';
import { useState, useEffect } from 'react';

export default function KuisPage() {
  const [todayAttempt, setTodayAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // 5 Soal Sederhana (Nanti bisa diupdate)
  const questions = [
    { q: "Surat pertama dalam Al-Qur'an adalah?", o: ["Al-Baqarah", "Al-Fatihah", "An-Nas", "Al-Ikhlas"], a: "Al-Fatihah" },
    { q: "Jumlah surat dalam Al-Qur'an adalah?", o: ["114", "30", "604", "6666"], a: "114" },
    { q: "Hukum bacaan Nun Mati bertemu huruf Ba disebut?", o: ["Izhar", "Iqlab", "Idgham", "Ikhfa"], a: "Iqlab" },
    { q: "Pembagi surah dalam Al-Qur'an terbagi menjadi berapa Juz?", o: ["10", "20", "30", "40"], a: "30" },
    { q: "Surat An-Naas terdapat di Juz berapa?", o: ["Juz 28", "Juz 29", "Juz 30", "Juz 27"], a: "Juz 30" },
  ];

  useEffect(() => {
    fetch('/api/quiz').then(res => res.json()).then(data => {
      setTodayAttempt(data.todayAttempt);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.a) correct++; });
    setScore(correct);
    setSubmitted(true);

    await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: correct * 20 }), // 1 benar = 20 poin
    });
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data kuis...</div>;

  if (todayAttempt || submitted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kuis Selesai!</h2>
        <p className="text-lg text-gray-600">Skor Anda hari ini:</p>
        <p className="text-5xl font-extrabold text-emerald-600 my-4">{todayAttempt?.score || (score * 20)} Poin</p>
        <p className="text-gray-400 text-sm">Kembali besok untuk soal baru!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">🧠 Kuis Harian (5 Soal)</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="border-b border-gray-100 pb-4">
            <p className="font-bold text-gray-800 mb-3">{i + 1}. {q.q}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.o.map(opt => (
                <label key={opt} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name={`q${i}`} value={opt} onChange={e => setAnswers({...answers, [i]: e.target.value})} required className="text-emerald-600" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700">Kirim Jawaban</button>
      </form>
    </div>
  );
}