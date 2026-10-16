import {
  MonitorSmartphone,
  Workflow,
  ServerCog,
  Database,
  Network,
  Stethoscope,
  MessagesSquare,
  UserCheck,
  Target,
  KeyRound,
  HeartHandshake,
  School,
  GraduationCap,
  Briefcase,
  Rocket,
  MessageCircle,
  FileText,
  Hammer,
  PackageCheck,
  LifeBuoy,
} from 'lucide-react'
import { yearsOfExperience } from './experience.js'

// Lama pengalaman (tahun sekarang − 2011), dihitung saat halaman dibuka
export const YEARS_EXPERIENCE = yearsOfExperience()

// ============================================================
// Data utama usaha — ubah di sini, tampilan ikut berubah.
// ============================================================
export const SITE = {
  name: 'Dev Sys Bless',
  tagline: 'Sistem yang Membawa Berkah, Bukan Beban.',
  // TODO: ganti dengan alamat Gmail usaha Anda yang sebenarnya
  email: 'devsysbless@gmail.com',
  github: 'https://github.com/devsysbless',
  repo: 'https://github.com/devsysbless/devsysbless.github.io',
}

// Ditampilkan bila backend aktif (pencatatan kunjungan & formulir lewat server)
export const PRIVACY_NOTE =
  'Website ini mencatat data kunjungan — alamat IP, perkiraan lokasi, serta jenis perangkat & browser — untuk statistik dan keamanan. Data Anda tidak dijual atau dibagikan ke pihak lain.'

export const NAV = [
  { href: '#layanan', label: 'Layanan' },
  { href: '#prinsip', label: 'Prinsip' },
  { href: '#perjalanan', label: 'Perjalanan' },
  { href: '#visi-misi', label: 'Visi & Misi' },
  { href: '#faq', label: 'FAQ' },
]

export const HERO_STATS = [
  { value: String(YEARS_EXPERIENCE), unit: 'tahun', label: 'pengalaman di dunia IT' },
  { value: '4', unit: 'peran', label: 'developer, engineer, DevOps & data' },
  { value: '1', unit: 'pintu', label: 'satu kontak untuk semua urusan sistem' },
  { value: '100', unit: '%', label: 'kode & akses jadi milik Anda' },
]

export const HERO_STATUS = [
  { text: 'Website & aplikasi online', note: 'dipantau 24 jam' },
  { text: 'Backup data otomatis', note: 'setiap malam' },
  { text: 'Laporan harian terkirim', note: 'tanpa diketik ulang' },
  { text: 'Stok barang selalu update', note: 'bisa dicek dari HP' },
]

export const SERVICES = [
  {
    id: 'aplikasi',
    icon: MonitorSmartphone,
    title: 'Aplikasi Sesuai Kebutuhan',
    plain:
      'Web, HP, maupun komputer — aplikasi yang mengikuti cara kerja usaha Anda, bukan Anda yang dipaksa mengikuti aplikasinya.',
    examples: [
      'Aplikasi web & dashboard admin',
      'Aplikasi HP (Android & iOS)',
      'Aplikasi desktop (Windows)',
      'Kasir, stok, pemesanan & absensi',
    ],
  },
  {
    id: 'otomasi',
    icon: Workflow,
    title: 'Otomasi Pekerjaan Rutin',
    plain: 'Biarkan komputer mengerjakan yang membosankan, tim Anda fokus pada yang penting.',
    examples: ['Laporan otomatis ke email', 'Sinkron data antar aplikasi', 'Impor data dari Excel / web', 'Integrasi API pihak ketiga'],
  },
  {
    id: 'server',
    icon: ServerCog,
    title: 'Server, Cloud & DevOps',
    plain: 'Aplikasi Anda tetap hidup, aman, dan bisa diperbarui tanpa drama.',
    examples: ['Setup VPS / cloud', 'Docker & deploy otomatis (CI/CD)', 'Monitoring & alarm gangguan', 'Domain, SSL & migrasi server'],
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data & Dashboard',
    plain: 'Ubah tumpukan data yang tercecer menjadi angka yang bisa dipakai untuk mengambil keputusan.',
    examples: ['Pindah Excel ke database', 'Backup terjadwal & pemulihan', 'Dashboard penjualan / operasional', 'Pengaturan hak akses data'],
  },
  {
    id: 'jaringan',
    icon: Network,
    title: 'Aplikasi Pemantau Jaringan',
    plain: 'Lihat kondisi jaringan kantor dari satu layar — tahu ada masalah sebelum karyawan mengeluh.',
    examples: [
      'Dashboard status perangkat & koneksi',
      'Notifikasi saat internet / perangkat mati',
      'Laporan pemakaian bandwidth',
      'Manajemen user & voucher hotspot',
    ],
  },
  {
    id: 'cek-kesehatan',
    icon: Stethoscope,
    title: 'Cek Kesehatan IT',
    plain: 'Seperti medical check-up, tapi untuk sistem usaha Anda. Ketahui risikonya sebelum jadi masalah.',
    examples: ['Audit keamanan dasar', 'Review aplikasi buatan vendor', 'Peta jalan digitalisasi bertahap', 'Pendampingan memilih software'],
  },
]

// Pemilih masalah: orang awam cukup klik masalah yang paling mirip.
export const PROBLEMS = [
  {
    id: 'excel',
    text: 'Data masih di Excel, tersebar di banyak laptop, dan takut hilang.',
    service: 'data',
    answer:
      'Data Anda kita kumpulkan ke satu database yang rapi, dengan backup otomatis setiap malam. Kalau laptop rusak, data tetap aman.',
    firstStep: 'Kirim contoh file Excel yang paling sering dipakai — kita petakan bersama.',
  },
  {
    id: 'ketik-ulang',
    text: 'Pekerjaan yang sama diketik ulang setiap hari: rekap, laporan, copy-paste.',
    service: 'otomasi',
    answer:
      'Pekerjaan berulang bisa dijalankan otomatis oleh program kecil. Laporan jadi sendiri dan langsung terkirim ke email Anda.',
    firstStep: 'Catat satu pekerjaan rutin yang paling memakan waktu, lalu ceritakan langkah-langkahnya.',
  },
  {
    id: 'web-mati',
    text: 'Website atau aplikasi tiba-tiba mati, dan tidak ada yang tahu kenapa.',
    service: 'server',
    answer:
      'Kita pasang pemantau yang memberi tahu begitu ada gangguan — sering kali sebelum pelanggan Anda sadar — lalu rapikan servernya agar lebih tahan banting.',
    firstStep: 'Siapkan informasi hosting / server yang Anda pakai sekarang.',
  },
  {
    id: 'wifi',
    text: 'Internet kantor sering putus, tapi tidak ada yang tahu perangkat mana yang bermasalah.',
    service: 'jaringan',
    answer:
      'Kita buatkan aplikasi pemantau yang menampilkan kondisi setiap perangkat jaringan di satu layar dan mengirim notifikasi saat ada yang mati. Anda tahu masalahnya di mana, bukan sekadar menebak.',
    firstStep: 'Catat perangkat jaringan yang Anda punya (merek router, jumlah access point) dan kapan biasanya gangguan terjadi.',
  },
  {
    id: 'vendor',
    text: 'Sudah bayar vendor, tapi aplikasinya sulit diubah dan kodenya tidak diberikan.',
    service: 'cek-kesehatan',
    answer:
      'Kita periksa kondisi aplikasi Anda, jelaskan risikonya dengan bahasa sederhana, lalu beri pilihan: dilanjutkan, diperbaiki, atau dibangun ulang.',
    firstStep: 'Kumpulkan akses yang Anda punya (hosting, domain, akun admin aplikasi).',
  },
  {
    id: 'mulai',
    text: 'Ingin "go digital" tapi bingung mulai dari mana tanpa boros biaya.',
    service: 'aplikasi',
    answer:
      'Mulai dari yang paling berdampak dulu, kecil tapi langsung terasa. Bentuknya bisa website, aplikasi HP, atau aplikasi komputer — kita pilih yang paling pas, lalu dibangun bertahap sesuai anggaran.',
    firstStep: 'Ceritakan alur kerja usaha Anda dari pesanan masuk sampai barang/jasa diterima pelanggan.',
  },
]

// Prinsip kerja — huruf depannya membentuk kata B.L.E.S.S.
export const PRINCIPLES = [
  {
    letter: 'B',
    icon: MessagesSquare,
    title: 'Bahasa yang Mudah',
    desc: 'Tanpa istilah yang membingungkan. Setiap usulan dijelaskan seperti ngobrol dengan teman, supaya Anda bisa memutuskan dengan yakin.',
  },
  {
    letter: 'L',
    icon: UserCheck,
    title: 'Langsung ke Ahlinya',
    desc: 'Tidak ada pesan yang hilang di tengah jalan. Anda bicara langsung dengan orang yang merancang, membangun, dan merawat sistem Anda.',
  },
  {
    letter: 'E',
    icon: Target,
    title: 'Efisien & Tepat Guna',
    desc: 'Solusi yang pas, bukan yang paling rumit atau paling mahal. Kalau cukup dengan spreadsheet yang dirapikan, kami akan bilang begitu.',
  },
  {
    letter: 'S',
    icon: KeyRound,
    title: 'Serah Terima Penuh',
    desc: 'Kode sumber, akses server, dan dokumentasi diserahkan ke Anda. Anda tidak "tersandera" oleh vendor — termasuk oleh kami.',
  },
  {
    letter: 'S',
    icon: HeartHandshake,
    title: 'Setia Mendampingi',
    desc: 'Selesai dibuat bukan berarti selesai urusan. Ada masa garansi dan pilihan perawatan rutin agar sistem tetap sehat.',
  },
]

export const JOURNEY = [
  {
    icon: School,
    title: 'SMK — Teknik Komputer & Jaringan',
    desc: 'Belajar dari akar: merakit komputer, memasang kabel jaringan, mengatur router dan server. Fondasi untuk memahami "jeroan" setiap sistem.',
  },
  {
    icon: GraduationCap,
    title: 'S1 — Sistem Informasi',
    desc: 'Mempelajari bagaimana teknologi melayani bisnis: analisis proses kerja, perancangan database, dan rekayasa perangkat lunak.',
  },
  {
    icon: Briefcase,
    title: 'Dunia Kerja — 4 Peran Sekaligus',
    desc: 'Merangkap software developer, software engineer, DevOps, dan data admin. Membangun aplikasi, menjaga server tetap hidup, dan merawat data perusahaan.',
  },
  {
    icon: Rocket,
    title: 'Lahirnya Dev Sys Bless',
    desc: 'Seluruh pengalaman itu dikemas menjadi layanan untuk usaha Anda, dengan satu tujuan: teknologi yang memudahkan, bukan menyusahkan.',
    current: true,
  },
]

export const NAME_MEANING = [
  { word: 'Dev', meaning: 'Development', desc: 'membangun aplikasi' },
  { word: 'Sys', meaning: 'System', desc: 'merawat server & data' },
  { word: 'Bless', meaning: 'Berkah', desc: 'hasil yang membawa manfaat' },
]

export const VISION =
  'Menjadi mitra teknologi yang membuat setiap usaha — sekecil apa pun — merasakan manfaat sistem yang baik: tenang, rapi, dan terus bertumbuh.'

export const MISSIONS = [
  'Menerjemahkan teknologi ke bahasa sehari-hari, agar setiap klien bisa mengambil keputusan dengan yakin.',
  'Membangun solusi yang tepat guna dan sesuai anggaran — bukan yang paling mahal atau paling rumit.',
  'Menyerahkan kepemilikan penuh kepada klien: kode sumber, akses, dan dokumentasi.',
  'Menjaga sistem tetap sehat setelah selesai dibuat melalui pendampingan dan perawatan berkelanjutan.',
  'Berbagi pengetahuan secara terbuka lewat open source dan edukasi, agar ekosistem digital lokal ikut tumbuh.',
]

export const PROCESS = [
  { icon: MessageCircle, title: 'Ngobrol Dulu', desc: 'Ceritakan masalah Anda dengan bahasa sendiri. Konsultasi awal gratis.' },
  { icon: FileText, title: 'Diagnosa & Usulan', desc: 'Anda menerima usulan tertulis: masalahnya apa, solusinya apa, berapa lama, berapa biaya.' },
  { icon: Hammer, title: 'Bangun Bertahap', desc: 'Dikerjakan per bagian dengan demo berkala. Anda melihat progres, bukan hanya menunggu.' },
  { icon: PackageCheck, title: 'Serah Terima', desc: 'Sistem, kode sumber, akses, dan panduan pemakaian diserahkan lengkap.' },
  { icon: LifeBuoy, title: 'Dampingi & Rawat', desc: 'Masa garansi perbaikan, plus pilihan perawatan bulanan bila dibutuhkan.' },
]

export const FAQ = [
  {
    q: 'Saya sama sekali tidak paham teknologi. Apakah bisa?',
    a: 'Justru untuk Anda kami ada. Anda cukup menceritakan masalahnya dengan bahasa sehari-hari, urusan teknis biar kami yang terjemahkan. Setiap keputusan akan dijelaskan dulu sampai Anda paham.',
  },
  {
    q: 'Apakah hanya bisa membuat website?',
    a: 'Tidak. Selain aplikasi web, kami juga membuat aplikasi HP (Android & iOS) dan aplikasi desktop untuk komputer kantor. Kami bantu pilihkan bentuk yang paling pas dengan kebutuhan dan anggaran — sering kali satu sistem bisa dipakai dari komputer dan HP sekaligus.',
  },
  {
    q: 'Berapa biayanya?',
    a: 'Tergantung besar-kecilnya kebutuhan. Konsultasi awal gratis, dan sebelum mulai Anda akan menerima usulan tertulis berisi rincian biaya. Pekerjaan juga bisa dibagi beberapa tahap agar sesuai anggaran.',
  },
  {
    q: 'Usaha saya masih kecil. Apakah layak?',
    a: 'Sangat layak. Banyak perbaikan kecil — seperti backup otomatis atau laporan otomatis — yang biayanya ringan tapi dampaknya terasa setiap hari.',
  },
  {
    q: 'Apakah kode program dan aksesnya jadi milik saya?',
    a: 'Ya, 100%. Kode sumber, akses server, domain, dan dokumentasi diserahkan ke Anda. Kalau suatu hari Anda ingin pindah ke tim lain, semuanya sudah siap.',
  },
  {
    q: 'Bagaimana kalau ada masalah setelah selesai?',
    a: 'Setiap proyek punya masa garansi perbaikan. Setelah itu tersedia pilihan perawatan bulanan, atau bantuan per kejadian bila diperlukan.',
  },
  {
    q: 'Bisa melanjutkan aplikasi buatan vendor lain?',
    a: 'Bisa. Kami mulai dengan "Cek Kesehatan IT" untuk melihat kondisinya, lalu memberi pilihan yang jujur: dilanjutkan, diperbaiki, atau dibangun ulang.',
  },
  {
    q: 'Kerjanya online atau datang ke lokasi?',
    a: 'Hampir semua pekerjaan dapat dikerjakan jarak jauh, jadi lokasi usaha Anda tidak menjadi kendala. Bila diperlukan, pertemuan langsung dapat diatur sesuai kesepakatan.',
  },
]

// Kantor pixel + asisten AI (section #kantor). Hanya tampil bila API & AI aktif.
export const OFFICE = {
  eyebrow: 'Kantor Virtual',
  title: 'Mampir ke kantor kami',
  lead: 'Kenalan dengan Sasa, asisten virtual Dev Sys Bless. Tanyakan apa saja seputar layanan kami, jawabannya langsung muncul.',
  canvasLabel:
    'Ilustrasi kantor pixel Dev Sys Bless: tiga karyawan virtual (Rara, Dimas, Sasa) di meja masing-masing, dan Anda di lobi.',
  you: 'Anda',
  hint: 'Klik karakter untuk berkenalan.',
  status: { online: 'Asisten virtual · online', typing: 'Asisten virtual · sedang mengetik…' },
  inputLabel: 'Pertanyaan untuk Sasa',
  send: 'Kirim',
  agents: [
    { id: 'resepsionis', name: 'Rara', role: 'Resepsionis', intro: 'Halo! Pesan dari formulir kontak saya yang terima.' },
    { id: 'analis', name: 'Dimas', role: 'Analis', intro: 'Saya merapikan angka-angka supaya mudah dibaca.' },
    { id: 'asisten', name: 'Sasa', role: 'Asisten', intro: 'Ada yang ingin ditanyakan? Ketik di kolom chat ya!' },
  ],
  greeting:
    'Halo, saya Sasa 👋 Saya bisa menjelaskan layanan Dev Sys Bless, cara kerja, sampai bentuk aplikasi yang cocok untuk usaha Anda. Mau tanya apa?',
  suggestions: ['Layanannya apa saja?', 'Bisa buat aplikasi HP?', 'Berapa biayanya?', 'Usaha saya kecil, cocok?'],
  placeholder: 'Tulis pertanyaan Anda…',
  typing: 'Sedang mengetik…',
  privacyNote:
    'Jangan menulis data pribadi. Nomor HP, email, dan alamat otomatis disamarkan sebelum dikirim ke AI, dan isi chat tidak disimpan.',
  redactedNote: 'Data pribadi disamarkan',
  disclaimer: 'Jawaban dibuat AI dan bisa keliru. Untuk kepastian, hubungi kami lewat formulir kontak.',
  contactCta: 'Konsultasi lewat formulir',
}

export const CONTACT_NEEDS = [
  'Aplikasi (web / HP / desktop)',
  'Otomasi pekerjaan',
  'Server / cloud',
  'Data & dashboard',
  'Aplikasi pemantau jaringan',
  'Cek kesehatan IT',
  'Belum tahu, mau konsultasi',
]
