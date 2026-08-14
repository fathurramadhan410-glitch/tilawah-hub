'use client';
import { useState, useEffect } from 'react';

export default function QuranPage() {
  const [surahList, setSurahList] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);

  // Ambil daftar surah saat halaman dibuka
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setSurahList(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Ambil ayat saat surah dipilih
  const fetchAyahs = async (surahNumber: number) => {
    setLoadingAyahs(true);
    setAyahs([]);
    
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
      const data = await res.json();
      
      if (data.code === 200) {
        setAyahs(data.data.ayahs);
        setSelectedSurah(data.data);
      }
    } catch (error) {
      console.error('Error fetching ayahs:', error);
    }
    setLoadingAyahs(false);
  };

  // Konversi angka ke Arab
  const toArabicNumber = (num: number) => {
    return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-6 rounded-2xl text-white text-center shadow-lg">
        <p className="text-2xl mb-2" style={{fontFamily: 'Scheherazade New, serif'}}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <h2 className="text-xl font-bold">Mushaf Al-Qur'an Digital</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Kiri: Daftar Surah */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-3 sticky top-0 bg-white pb-2 border-b">Pilih Surah</h3>
            <div className="space-y-1">
              {surahList.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => fetchAyahs(surah.number)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition text-left ${
                    selectedSurah?.number === surah.number
                      ? 'bg-emerald-50 border border-emerald-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      selectedSurah?.number === surah.number
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {surah.number}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{surah.englishName}</p>
                      <p className="text-xs text-gray-400">{surah.name} • {surah.numberOfAyahs} Ayat</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Kanan: Tampilan Ayat */}
        <div className="lg:col-span-2">
          <div className="bg-[#fffdf5] rounded-2xl shadow-sm border-4 border-double border-emerald-800/20 p-6 md:p-10 min-h-[600px]">
            
            {!selectedSurah && !loadingAyahs && (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-gray-500 text-lg font-medium">Silakan pilih surah untuk mulai membaca</p>
              </div>
            )}

            {loadingAyahs && (
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            )}

            {!loadingAyahs && selectedSurah && (
              <>
                {/* Header Surah */}
                <div className="text-center mb-8 border-b border-emerald-800/20 pb-6">
                  <p className="text-3xl text-emerald-800 mb-2" style={{fontFamily: 'Scheherazade New, serif'}}>
                    {selectedSurah.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedSurah.englishName} - {selectedSurah.englishNameTranslation}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                  </p>
                </div>

                {/* Basmalah (kecuali Surah At-Taubah) */}
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                  <p className="text-center text-2xl text-emerald-700 mb-8" style={{fontFamily: 'Scheherazade New, serif'}}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                )}

                {/* Ayat-ayat */}
                <div className="space-y-4">
                  {ayahs.map((ayah) => (
                    <div key={ayah.number} className="flex items-start gap-3 group">
                      {/* Nomor Ayat (Lingkaran) */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 text-xs font-bold">
                          {toArabicNumber(ayah.numberInSurah)}
                        </div>
                      </div>
                      
                      {/* Teks Ayat */}
                      <p 
                        className="flex-1 text-2xl md:text-3xl leading-loose text-gray-900 text-right"
                        style={{fontFamily: 'Scheherazade New, serif'}}
                        dir="rtl"
                      >
                        {ayah.text}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Style Font Quran */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}