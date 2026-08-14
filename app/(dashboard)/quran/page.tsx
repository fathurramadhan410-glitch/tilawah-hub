'use client';
import { useState, useEffect } from 'react';

export default function QuranPage() {
  const [viewMode, setViewMode] = useState<'page' | 'surah'>('page');
  
  // State Mode Per Halaman
  const [currentPage, setCurrentPage] = useState(1); // 1 sampai 604
  const [pageAyahs, setPageAyahs] = useState<any[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [currentJuz, setCurrentJuz] = useState(1); // Menyimpan info Juz

  // State Mode Per Surah
  const [surahList, setSurahList] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [surahAyahs, setSurahAyahs] = useState<any[]>([]);
  const [loadingSurah, setLoadingSurah] = useState(false);

  // Konversi angka ke Arab
  const toArabicNumber = (num: number) => {
    return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
  };

  // Halaman awal setiap Juz (Standar Mushaf Madinah)
  const juzStartPages = [1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];

  // Fetch daftar surah
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) setSurahList(data.data);
      });
  }, []);

  // Fetch data Per Halaman
  useEffect(() => {
    if (viewMode !== 'page') return;
    setLoadingPage(true);
    fetch(`https://api.alquran.cloud/v1/page/${currentPage}/quran-uthmani`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200 && data.data.ayahs.length > 0) {
          setPageAyahs(data.data.ayahs);
          // Ambil info Juz dari ayat pertama di halaman ini
          setCurrentJuz(data.data.ayahs[0].juz);
        }
        setLoadingPage(false);
      })
      .catch(() => setLoadingPage(false));
  }, [currentPage, viewMode]);

  // Fetch data Per Surah
  const fetchSurah = async (surahNumber: number) => {
    setLoadingSurah(true);
    setSurahAyahs([]);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
      const data = await res.json();
      if (data.code === 200) {
        setSurahAyahs(data.data.ayahs);
        setSelectedSurah(data.data);
      }
    } catch (error) { console.error(error); }
    setLoadingSurah(false);
  };

  const goNextPage = () => { if (currentPage < 604) setCurrentPage(currentPage + 1); };
  const goPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Fungsi saat Juz dipilih dari dropdown
  const handleJuzChange = (juz: number) => {
    if (juz >= 1 && juz <= 30) {
      setCurrentPage(juzStartPages[juz - 1]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-6 rounded-2xl text-white text-center shadow-lg">
        <p className="text-2xl mb-2" style={{fontFamily: 'Scheherazade New, serif'}}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <h2 className="text-xl font-bold">Mushaf Al-Qur'an Digital</h2>
      </div>

      {/* Tab Pilihan Mode */}
      <div className="flex justify-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <button 
          onClick={() => setViewMode('page')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${viewMode === 'page' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          📄 Per Halaman (Mushaf)
        </button>
        <button 
          onClick={() => setViewMode('surah')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${viewMode === 'surah' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          📜 Per Surah
        </button>
      </div>

      {/* Konten Mode Per Halaman */}
      {viewMode === 'page' && (
        <div className="space-y-4">
          {/* Navigasi Halaman & Pilih Juz */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <button onClick={goPrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition text-gray-800 font-medium">← Sebelumnya</button>
              <span className="font-bold text-gray-800">Hal. {currentPage} / 604</span>
              <button onClick={goNextPage} disabled={currentPage === 604} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition text-gray-800 font-medium">Berikutnya →</button>
            </div>
            
            {/* Dropdown Pilih Juz */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Pilih Juz:</span>
              <select 
                value={currentJuz} 
                onChange={(e) => handleJuzChange(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {Array.from({length: 30}, (_, i) => i + 1).map(j => (
                  <option key={j} value={j} className="text-black">Juz {j}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tampilan Halaman Utuh (Seperti Mushaf Asli) */}
          <div className="bg-[#fffdf5] rounded-2xl shadow-md border-4 border-double border-emerald-800/30 p-6 md:p-12 min-h-[60vh] relative">
            
            {/* Info Juz di Pojok Kanan Atas */}
            {!loadingPage && (
              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                Juz {currentJuz}
              </div>
            )}

            {loadingPage ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <p className="font-quran text-justify text-right text-2xl md:text-3xl leading-loose text-gray-900" dir="rtl">
                {pageAyahs.map((ayah) => (
                  <span key={ayah.number}>
                    {ayah.text} 
                    <span className="ayah-marker-inline">
                      {toArabicNumber(ayah.numberInSurah)}
                    </span>{' '}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Konten Mode Per Surah */}
      {viewMode === 'surah' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel Kiri: Daftar Surah */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
              <h3 className="font-bold text-gray-900 mb-3 sticky top-0 bg-white pb-2 border-b">Pilih Surah</h3>
              <div className="space-y-1">
                {surahList.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => fetchSurah(surah.number)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition text-left ${
                      selectedSurah?.number === surah.number
                        ? 'bg-indigo-50 border border-indigo-300'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedSurah?.number === surah.number
                          ? 'bg-indigo-600 text-white'
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
              
              {!selectedSurah && !loadingSurah && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                  <div className="text-6xl mb-4">📜</div>
                  <p className="text-gray-500 text-lg font-medium">Silakan pilih surah untuk mulai membaca</p>
                </div>
              )}

              {loadingSurah && (
                <div className="flex items-center justify-center min-h-[500px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              )}

              {!loadingSurah && selectedSurah && (
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

                  {/* Basmalah */}
                  {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                    <p className="text-center text-2xl text-emerald-700 mb-8" style={{fontFamily: 'Scheherazade New, serif'}}>
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                  )}

                  {/* Ayat-ayat */}
                  <div className="space-y-4">
                    {surahAyahs.map((ayah) => (
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
      )}

      {/* Style Font & Marker Quran */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');
        .font-quran {
          font-family: 'Scheherazade New', serif;
        }
        /* Marker Nomor Ayat Inline (Untuk Mode Per Halaman) */
        .ayah-marker-inline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          font-size: 0.9rem;
          font-family: 'Amiri', serif;
          margin: 0 0.2rem;
          vertical-align: middle;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="%2310b981" stroke-width="6"/><circle cx="50" cy="50" r="28" fill="none" stroke="%2310b981" stroke-width="2"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          color: #10b981;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}