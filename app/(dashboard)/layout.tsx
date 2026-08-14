'use client';
import { useEffect, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // State Global Notifikasi
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Listener untuk memanggil notifikasi dari halaman manapun
  useEffect(() => {
    const handleNotify = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNotif(detail);
      setTimeout(() => setNotif(null), 3000);
    };
    window.addEventListener('notify', handleNotify);
    return () => window.removeEventListener('notify', handleNotify);
  }, []);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const role = String(user?.publicMetadata?.role || 'murid');
  const isPrivileged = role === 'developer' || role === 'guru';

  const navLinkClass = (href: string) => 
    `flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 ${
      pathname === href 
        ? 'bg-white/20 text-white font-bold shadow-sm' 
        : 'text-emerald-100 hover:bg-white/10 hover:text-white font-medium'
    }`;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar (Hijau Quran) */}
      <aside className={`fixed md:relative z-30 w-64 bg-emerald-800 flex flex-col h-screen flex-shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between border-b border-emerald-700/50 px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-lg font-bold text-white">Tilawah Hub</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-emerald-200 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass('/dashboard')}>📊 Dashboard</Link>
          <Link href="/input-bacaan" onClick={() => setSidebarOpen(false)} className={navLinkClass('/input-bacaan')}>📝 Input Bacaan</Link>
          <Link href="/target-khatam" onClick={() => setSidebarOpen(false)} className={navLinkClass('/target-khatam')}>🎯 Target Khatam</Link>
          <Link href="/kehadiran" onClick={() => setSidebarOpen(false)} className={navLinkClass('/kehadiran')}>📅 Kehadiran</Link>
          <Link href="/leaderboard" onClick={() => setSidebarOpen(false)} className={navLinkClass('/leaderboard')}>🏆 Papan Peringkat</Link>
          <Link href="/kuis" onClick={() => setSidebarOpen(false)} className={navLinkClass('/kuis')}>🧠 Kuis</Link>
          
          {isPrivileged && (
            <div className="pt-4 mt-4 border-t border-emerald-700/50">
              <p className="px-4 text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2">Menu Guru / Dev</p>
              <div className="space-y-1">
                <Link href="/buat-target" onClick={() => setSidebarOpen(false)} className={navLinkClass('/buat-target')}>➕ Buat Target Khatam</Link>
                <Link href="/data-peserta" onClick={() => setSidebarOpen(false)} className={navLinkClass('/data-peserta')}>👥 Data Peserta</Link>
                <Link href="/rekap-kehadiran" onClick={() => setSidebarOpen(false)} className={navLinkClass('/rekap-kehadiran')}>📋 Rekap Kehadiran</Link>
              </div>
            </div>
          )}
        </nav>
        
        <div className="p-4 border-t border-emerald-700/50">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{user?.firstName || user?.username || 'Pengguna'}</span>
              <span className="text-xs text-emerald-300 font-bold uppercase">{role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="font-bold text-lg md:text-xl text-gray-900 truncate">Dashboard Tilawah</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>

      {/* GLOBAL NOTIFICATION MODAL (Statis, Checkmark/Cross) */}
      {notif && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-white rounded-xl shadow-2xl border border-gray-100 p-6 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {notif.type === 'success' ? (
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{notif.type === 'success' ? 'Berhasil' : 'Gagal'}</h4>
            <p className="text-sm text-gray-500">{notif.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}