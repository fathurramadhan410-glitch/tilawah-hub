'use client';
import Link from 'next/link';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Navbar (Hijau) */}
      <nav className="fixed top-0 w-full z-50 bg-emerald-800 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-extrabold text-white">
              Tilawah<span className="text-emerald-300">Hub</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#latar-belakang" className="text-sm font-medium text-emerald-100 hover:text-white transition">Latar Belakang</a>
            <a href="#tentang" className="text-sm font-medium text-emerald-100 hover:text-white transition">Tentang Sistem</a>
            <a href="#fitur" className="text-sm font-medium text-emerald-100 hover:text-white transition">Fitur Unggulan</a>
            <a href="#kontak" className="text-sm font-medium text-emerald-100 hover:text-white transition">Hubungi Kami</a>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="hidden md:block bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition">
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="text-emerald-100 hover:text-white px-3 py-2 text-sm font-medium transition">
                    Masuk
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="bg-white text-emerald-700 px-5 py-2 rounded-lg text-sm font-bold transition hover:bg-emerald-50 shadow-sm">
                    Daftar Sekarang
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section (Hijau Quran & Teks Putih) */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-emerald-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-700/50 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-4xl md:text-5xl text-emerald-200 mb-8" style={{fontFamily: 'Amiri, serif'}}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
            Pantau Tilawah, <br/>
            <span className="text-emerald-300">Bangun Konsistensi</span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100 mb-10 font-light max-w-2xl mx-auto">
            Platform modern untuk memantau rutinitas baca Al-Qur'an. Dilengkapi dengan Tadarus Relay otomatis, absensi, dan gamifikasi.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isSignedIn && (
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-lg">
                  Mulai Sekarang - Gratis
                </button>
              </SignUpButton>
            )}
            <a href="#tentang" className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition border border-emerald-500">
              Pelajari Sistem
            </a>
          </div>
        </div>
      </section>

      {/* Latar Belakang Section (Putih) */}
      <section id="latar-belakang" className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Latar Belakang Sistem</h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Di era digital saat ini, banyak umat Islam yang kesulitan menjaga konsistensi dalam membaca Al-Qur'an akibat kesibukan harian. Kurangnya sistem pemantauan yang terstruktur membuat target khatam sering kali tertunda. Tilawah Hub hadir sebagai solusi inovatif untuk menjembatani kebutuhan spiritual dan teknologi, membantu individu maupun kelompok (halaqah) dalam memantau, mengelola, dan memotivasi diri untuk istiqamah dalam tilawah.
          </p>
        </div>
      </section>

      {/* Tentang Sistem Section (Abu-abu terang) */}
      <section id="tentang" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Tentang Sistem</h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Tilawah Hub adalah platform digital terintegrasi yang dirancang untuk membantu santri, mahasiswa, maupun masyarakat umum dalam memantau rutinitas baca Al-Qur'an. Sistem ini menggabungkan pencatatan progres harian, sistem absensi tilawah, target khatam berjamaah dengan pembagian tugas cerdas, serta gamifikasi untuk menumbuhkan semangat kompetisi yang sehat di antara pengguna.
          </p>
        </div>
      </section>

      {/* Fitur Unggulan Section (Putih) */}
      <section id="fitur" className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Inovasi yang dirancang khusus agar pengguna tetap istiqamah.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-3xl mb-6">🔄</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Tadarus Relay Otomatis</h3>
              <p className="text-gray-500 text-sm">Sistem pintar yang menyambungkan bacaan jamaah secara otomatis. Tidak ada lagi tabrakan halaman antar peserta.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-3xl mb-6">🗓️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Absensi & Target Khatam</h3>
              <p className="text-gray-500 text-sm">Atur target khatam kelompok, bagi tugas harian otomatis, dan pantau kehadiran tilawah setiap hari.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-3xl mb-6">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Gamifikasi & Leaderboard</h3>
              <p className="text-gray-500 text-sm">Kumpulkan poin, buka lencana prestasi, dan lihat peringkat di antara anggota lain untuk memupuk semangat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hubungi Kami / CTA Section (Hijau) */}
      <section id="kontak" className="py-20 px-6 bg-emerald-800 border-t border-emerald-900">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Siap Memulai Perjalanan Tilawah?</h2>
          <p className="text-emerald-100 mb-8">Bergabunglah sekarang dan jadilah bagian dari komunitas pencinta Al-Qur'an yang istiqamah.</p>
          {!isSignedIn && (
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-lg inline-block">
                Buat Akun Gratis Sekarang
              </button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* Footer (Hijau) */}
      <footer className="py-8 bg-emerald-900 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-emerald-200">
          &copy; {new Date().getFullYear()} Tilawah Hub. Dibangun dengan Next.js & Clerk.
        </div>
      </footer>

    </div>
  );
}