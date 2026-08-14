'use client';
import { useState, useEffect } from 'react';

const notify = (type: 'success' | 'error', message: string) => {
  window.dispatchEvent(new CustomEvent('notify', { detail: { type, message } }));
};

export default function KuisPage() {
  const [todayAttempt, setTodayAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/quiz').then(res => res.json()).then(data => {
      setTodayAttempt(data.todayAttempt);
      setQuestions(data.questions || []);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formattedAnswers = Object.entries(answers).map(([id, answer]) => ({ id: parseInt(id), answer }));
    
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: formattedAnswers }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setResult(data);
      notify('success', `Kuis selesai! Skor: ${data.score} Poin (${data.correctCount}/${data.totalQuestions} Benar)`);
      setTodayAttempt({ score: data.score });
    } else {
      notify('error', data.error || 'Gagal submit kuis.');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data kuis...</div>;

  if (todayAttempt && !result) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kuis Selesai!</h2>
        <p className="text-lg text-gray-600">Skor Anda hari ini:</p>
        <p className="text-5xl font-extrabold text-emerald-600 my-4">{todayAttempt.score} Poin</p>
        <p className="text-gray-400 text-sm">Kembali besok untuk soal baru!</p>
      </div>
    );
  }

  if (result) {
     return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kuis Selesai!</h2>
        <p className="text-lg text-gray-600">Skor Anda hari ini:</p>
        <p className="text-5xl font-extrabold text-emerald-600 my-4">{result.score} Poin</p>
        <p className="text-md text-gray-500">Jawaban Benar: {result.correctCount} dari {result.totalQuestions}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">🧠 Kuis Harian (10 Soal)</h2>
        <p className="text-gray-500 text-sm mt-1">Pilihan ganda dari berbagai rumpun ilmu Islam.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-gray-800">{i + 1}. {q.question}</p>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{q.category}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt: string, idx: number) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <label 
                    key={opt} 
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${answers[q.id] === opt ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input 
                      type="radio" 
                      name={`q${q.id}`} 
                      value={opt} 
                      onChange={e => setAnswers({...answers, [q.id]: e.target.value})} 
                      required 
                      className="hidden" 
                    />
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${answers[q.id] === opt ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-400 text-gray-600'}`}>
                      {letter}
                    </span>
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50">Kirim Jawaban</button>
      </form>
    </div>
  );
}