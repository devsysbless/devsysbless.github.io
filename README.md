# Dev Sys Bless — Website

> Sistem yang Membawa Berkah, Bukan Beban.

Website profil usaha **Dev Sys Bless**, dibangun dengan **React.js + Vite** dan di-deploy ke
[devsysbless.github.io](https://devsysbless.github.io).

## Menjalankan di komputer

```bash
npm install
npm run dev       # buka http://localhost:5173
npm run build     # hasil build ada di folder dist/
npm run preview   # cek hasil build
```

## Backend

Pencatatan kunjungan dan formulir kontak memakai backend FastAPI di folder
[`../devsysbless-api`](../devsysbless-api/README.md).

- **Lokal:** jalankan `docker compose up -d` di folder [`../devsysbless-proxy`](../devsysbless-proxy/README.md), lalu di folder backend.
  `npm run dev` otomatis terhubung ke `http://localhost/devsysbless` (diatur di `.env.development`).
- **Produksi:** isi variable `VITE_API_URL` di GitHub (Settings → Secrets and variables → Actions → Variables).
  Jika kosong, website tetap jalan tanpa pencatatan kunjungan, dan formulir kembali memakai `mailto:`.

## Mengubah isi website

Hampir semua teks (tagline, layanan, visi & misi, FAQ, email, dll.) ada di satu file:
[`src/data/content.js`](src/data/content.js). Ubah di sana, tampilan otomatis ikut berubah.

## Struktur

```
src/
├── data/content.js     # semua konten
├── components/         # satu file per bagian halaman
├── App.jsx             # urutan bagian halaman
└── index.css           # gaya & tema terang/gelap
```

## Deploy ke GitHub Pages

1. Buat repository **publik** bernama persis `devsysbless.github.io` di akun `devsysbless`.
2. Push kode ini ke branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Website Dev Sys Bless"
   git branch -M main
   git remote add origin https://github.com/devsysbless/devsysbless.github.io.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Setiap push ke `main` akan otomatis build & deploy lewat
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Cek progres di tab **Actions**.

Panduan lengkap untuk pemula (dengan penjelasan tiap langkah & solusi masalah): [DEPLOY.md](DEPLOY.md).
