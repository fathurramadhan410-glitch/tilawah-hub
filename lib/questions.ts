export const questionBank = [
  // Ilmu Al-Qur'an
  { q: "Surat pertama dalam Al-Qur'an adalah?", o: ["Al-Baqarah", "Al-Fatihah", "An-Nas", "Al-Ikhlas"], a: "Al-Fatihah", c: "Al-Qur'an" },
  { q: "Jumlah surat dalam Al-Qur'an adalah?", o: ["114", "30", "604", "6666"], a: "114", c: "Al-Qur'an" },
  { q: "Surat terpendek dalam Al-Qur'an memiliki berapa ayat?", o: ["1", "2", "3", "4"], a: "3", c: "Al-Qur'an" },
  { q: "Al-Qur'an diturunkan di dua kota, yaitu Makkah dan?", o: ["Madinah", "Thaif", "Yerusalem", "Yaman"], a: "Madinah", c: "Al-Qur'an" },
  // Ilmu Tajwid
  { q: "Hukum bacaan Nun Mati bertemu huruf Ba disebut?", o: ["Izhar", "Iqlab", "Idgham", "Ikhfa"], a: "Iqlab", c: "Tajwid" },
  { q: "Membaca mad thabi'i dipanjangkan sepanjang?", o: ["1 harakat", "2 harakat", "4 harakat", "6 harakat"], a: "2 harakat", c: "Tajwid" },
  { q: "Huruf qalqalah terbagi menjadi?", o: ["3", "4", "5", "6"], a: "5", c: "Tajwid" },
  { q: "Izhar halqi artinya?", o: ["Jelas", "Samar", "Dimasukkan", "Dibalik"], a: "Jelas", c: "Tajwid" },
  // Ilmu Fiqih
  { q: "Rukun Islam ada berapa?", o: ["3", "4", "5", "6"], a: "5", c: "Fiqih" },
  { q: "Shalat wajib dalam sehari semalam ada?", o: ["3", "4", "5", "6"], a: "5", c: "Fiqih" },
  { q: "Membayar zakat fitrah dilakukan pada bulan?", o: ["Muharram", "Rajab", "Ramadhan", "Syawal"], a: "Ramadhan", c: "Fiqih" },
  { q: "Puasa yang diharamkan adalah puasa pada hari?", o: ["Senin", "Kamis", "Idul Fitri", "Arafah (bagi non-haji)"], a: "Idul Fitri", c: "Fiqih" },
  // Ilmu Tauhid
  { q: "Rukun Iman ada berapa?", o: ["5", "6", "7", "8"], a: "6", c: "Tauhid" },
  { q: "Menyerupakan Allah dengan makhluk disebut?", o: ["Tawhid", "Syirik", "Kufur", "Nifaq"], a: "Syirik", c: "Tauhid" },
  { q: "Sifat wajib bagi Allah yang pertama adalah?", o: ["Wujud", "Qidam", "Baqa", "Wahdaniyah"], a: "Wujud", c: "Tauhid" },
  { q: "Kitab-kitab Allah yang diturunkan jumlahnya?", o: ["4", "100", "104", "114"], a: "104", c: "Tauhid" },
  // Sejarah Nabi
  { q: "Nabi terakhir adalah Nabi?", o: ["Isa", "Musa", "Muhammad", "Ibrahim"], a: "Muhammad", c: "Sejarah" },
  { q: "Nabi Muhammad SAW lahir di kota?", o: ["Madinah", "Makkah", "Thaif", "Yerusalem"], a: "Makkah", c: "Sejarah" },
  { q: "Kitab suci yang diturunkan kepada Nabi Musa adalah?", o: ["Taurat", "Injil", "Zabur", "Al-Qur'an"], a: "Taurat", c: "Sejarah" },
  { q: "Nabi yang membangun Ka'bah bersama anaknya Ismail adalah?", o: ["Nuh", "Ibrahim", "Yusuf", "Daud"], a: "Ibrahim", c: "Sejarah" },
];

// Fungsi untuk mengambil 10 soal acak berdasarkan tanggal hari ini
export function getDailyQuestions() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Seed berdasarkan hari ke-X di tahun ini
  const seed = dayOfYear % questionBank.length;
  const selected = [];
  
  // Ambil 10 soal secara berurutan dari seed (akan berputar jika melebihi panjang array)
  for (let i = 0; i < 10; i++) {
    selected.push(questionBank[(seed + i) % questionBank.length]);
  }
  
  return selected;
}