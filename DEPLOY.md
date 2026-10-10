# Panduan Deploy Website ke devsysbless.github.io

Panduan ini ditulis untuk pemula. Ikuti langkahnya satu per satu dari atas ke bawah.
Total waktu: sekitar **15–20 menit** untuk pertama kali.

> **Apa itu "deploy"?**
> Saat ini website masih ada di komputer Anda saja. Deploy artinya mengunggah website
> ke internet supaya semua orang bisa membukanya di alamat **https://devsysbless.github.io**.
> Layanan yang dipakai adalah **GitHub Pages** — gratis.

---

## Yang perlu disiapkan

| No | Yang dibutuhkan | Keterangan |
|----|-----------------|------------|
| 1 | Akun GitHub `devsysbless` | Sudah ada. Pastikan Anda **sudah login** di browser. |
| 2 | Aplikasi **Git** | Untuk mengirim file ke GitHub. Cara cek ada di Langkah 3. |
| 3 | Folder proyek `devsysbless` | Folder yang berisi `package.json`, `src`, dan lain-lain. |

> Anda **tidak perlu** menjalankan `npm run build` sendiri. GitHub yang akan membangun
> website-nya secara otomatis.

---

## Langkah 1 — Ganti alamat email di website

1. Buka file `src/data/content.js`.
2. Cari baris ini:
   ```js
   email: 'devsysbless@gmail.com',
   ```
3. Ganti dengan alamat Gmail usaha Anda yang sebenarnya, misalnya:
   ```js
   email: 'namaanda@gmail.com',
   ```
4. Simpan file (**Ctrl + S**).

✅ **Hasilnya:** pesan dari calon klien akan masuk ke email Anda.

---

## Langkah 2 — Buat "rumah" website di GitHub (repository)

1. Buka **https://github.com/new** di browser.
2. Isi formulirnya seperti ini:

   | Kolom | Isi dengan |
   |-------|-----------|
   | **Owner** | `devsysbless` |
   | **Repository name** | `devsysbless.github.io` ← harus **persis** seperti ini |
   | **Description** | Website resmi Dev Sys Bless (boleh dikosongkan) |
   | **Public / Private** | Pilih **Public** |
   | **Add a README file** | ❌ **Jangan** dicentang |
   | **Add .gitignore** | Biarkan **None** |
   | **Choose a license** | Biarkan **None** |

3. Klik tombol hijau **Create repository**.

✅ **Hasilnya:** muncul halaman repository yang masih kosong, berisi petunjuk "Quick setup".

> ⚠️ Nama repository **wajib** `devsysbless.github.io`. Kalau berbeda satu huruf saja,
> alamat websitenya ikut berbeda.

---

## Langkah 3 — Aktifkan GitHub Pages

Cara tercepat: buka langsung alamat ini di browser:
**<https://github.com/devsysbless/devsysbless.github.io/settings/pages>**

Atau lewat menu:

1. Buka halaman **repository** `devsysbless.github.io`, **bukan** halaman profil akun.
   Settings di menu foto profil (pojok kanan atas) adalah pengaturan akun, dan di sana tidak ada Pages.
2. Klik tab **⚙ Settings**, yang ada di baris tab paling kanan setelah *Code, Issues, Pull requests, Actions…*.
   Di layar sempit, tab ini bisa tersembunyi di balik tombol **⋯**.
3. Di menu kiri, pada kelompok **Code and automation**, klik **Pages**.
4. Pada **Build and deployment**, di bawah tulisan **Source** ada **kotak pilihan (dropdown)**
   yang awalnya bertuliskan **Deploy from a branch**. **Klik kotak itu**, lalu pilih **GitHub Actions**.

   ```
   Build and deployment
   Source
   [ Deploy from a branch  ▾ ]   ← klik di sini
       ├─ GitHub Actions          ← pilih ini
       └─ Deploy from a branch
   ```

5. Tidak ada tombol Save. Pilihan langsung tersimpan.

✅ **Hasilnya:** GitHub siap membangun website otomatis setiap kali Anda mengirim perubahan.

> ❓ **Menu Pages tidak muncul, atau muncul tulisan "Upgrade or make this repository public"?**
> Berarti repository masih **Private**. GitHub Pages gratis hanya untuk repository Public. Untuk mengubahnya:
> buka **Settings → General**, gulir ke paling bawah (**Danger Zone**), klik **Change visibility** → **Make public**.

---

## Langkah 4 — Buka Terminal di folder proyek

1. Buka folder `devsysbless` di **VS Code** (**File → Open Folder…**).
2. Buka terminal: menu **Terminal → New Terminal** (atau tekan **Ctrl + `**).
3. Pastikan lokasi terminal berakhiran `\devsysbless`, contohnya:
   ```
   PS C:\Users\NEXIA\Desktop\Aman\Playground\dev-sys-bless\devsysbless>
   ```
4. Cek apakah Git sudah terpasang. Ketik lalu tekan **Enter**:
   ```bash
   git --version
   ```
   - Muncul tulisan seperti `git version 2.49.0` → ✅ lanjut.
   - Muncul tulisan *"not recognized"* → unduh dan pasang Git dari **https://git-scm.com/download/win**
     (klik *Next* terus sampai selesai), lalu tutup dan buka lagi VS Code.

> ⚠️ **Penting:** semua perintah berikutnya harus dijalankan **di dalam folder `devsysbless`**,
> bukan di folder di atasnya. Kalau salah folder, website tidak akan ter-deploy.

---

## Langkah 5 — Perkenalkan diri ke Git (cukup sekali seumur komputer)

Ketik dua perintah ini satu per satu (ganti email dengan email Anda):

```bash
git config --global user.name "devsysbless"
git config --global user.email "namaanda@gmail.com"
```

✅ **Hasilnya:** tidak muncul apa-apa — itu tandanya berhasil.

---

## Langkah 6 — Kirim website ke GitHub

Jalankan perintah di bawah ini **satu baris demi satu baris**, tekan **Enter** setelah setiap baris:

```bash
git init
git add .
git commit -m "Website pertama Dev Sys Bless"
git branch -M main
git remote add origin https://github.com/devsysbless/devsysbless.github.io.git
git push -u origin main
```

Arti setiap baris (supaya tidak bingung):

| Perintah | Artinya |
|----------|---------|
| `git init` | Mulai mencatat riwayat perubahan di folder ini |
| `git add .` | Pilih semua file untuk dikirim |
| `git commit -m "..."` | Bungkus file jadi satu paket, beri catatan |
| `git branch -M main` | Beri nama jalur utama: `main` |
| `git remote add origin ...` | Beri tahu alamat repository GitHub tujuan |
| `git push -u origin main` | Kirim paketnya ke GitHub |

**Saat `git push` pertama kali**, akan muncul jendela login GitHub:

1. Pilih **Sign in with your browser**.
2. Browser terbuka → klik **Authorize** / **Authorize git-ecosystem**.
3. Kembali ke VS Code, proses pengiriman berlanjut sendiri.

✅ **Hasilnya:** di terminal muncul tulisan seperti
`branch 'main' set up to track 'origin/main'`. Saat halaman repository di GitHub di-refresh,
file-file Anda sudah terlihat.

---

## Langkah 7 — Tunggu GitHub membangun website

1. Di halaman repository, klik tab **Actions**.
2. Akan ada proses bernama **Deploy ke GitHub Pages**:
   - 🟡 Bulatan kuning = sedang diproses (tunggu ±1–3 menit)
   - ✅ Centang hijau = **berhasil**
   - ❌ Silang merah = gagal → lihat bagian **Kalau ada masalah** di bawah

---

## Langkah 8 — Buka website Anda 🎉

Buka **https://devsysbless.github.io** di browser.

Kalau belum muncul, tunggu 1–2 menit lalu tekan **Ctrl + F5** untuk memuat ulang.

**Selamat, website Dev Sys Bless sudah online!**

---

## Cara memperbarui website di kemudian hari

Setiap kali Anda mengubah isi website (misalnya menambah layanan di `src/data/content.js`),
cukup jalankan 3 perintah ini di terminal folder `devsysbless`:

```bash
git add .
git commit -m "Tulis catatan singkat perubahan di sini"
git push
```

Lalu tunggu ±2 menit — website otomatis terbarui.

> 💡 **Tips:** sebelum dikirim, Anda bisa melihat hasilnya di komputer sendiri dengan
> `npm install` (cukup sekali) lalu `npm run dev`, kemudian buka **http://localhost:5173**.

---

## Kalau ada masalah

| Pesan / Kejadian | Penyebab | Solusi |
|------------------|----------|--------|
| `'git' is not recognized` | Git belum terpasang | Pasang dari https://git-scm.com/download/win, lalu buka ulang VS Code |
| `remote origin already exists` | Alamat tujuan sudah pernah diatur | Jalankan `git remote set-url origin https://github.com/devsysbless/devsysbless.github.io.git` lalu `git push -u origin main` |
| `rejected ... (fetch first)` | Saat membuat repository, README ikut dicentang | Karena repository masih baru, aman untuk menimpa: `git push -u origin main --force` |
| Diminta **password** dan selalu gagal | GitHub tidak menerima password biasa di terminal | Tutup, ulangi `git push`, pilih **Sign in with your browser** |
| `Permission denied` / `403` | Login memakai akun GitHub yang lain | Buka **Credential Manager** di Windows → **Windows Credentials** → hapus entri `git:https://github.com`, lalu ulangi `git push` |
| Tab **Actions** kosong | File `.github` tidak ikut terkirim, atau push dari folder yang salah | Pastikan terminal berada di folder `devsysbless` dan folder `.github` ada di sana |
| Actions ❌ merah | Biasanya Pages belum diatur ke GitHub Actions | Ulangi **Langkah 3**, lalu di tab Actions klik proses yang gagal → **Re-run all jobs** |
| Website menampilkan **404** | Belum selesai / nama repository salah | Tunggu beberapa menit; pastikan nama repository persis `devsysbless.github.io` dan **Public** |
| Website tampil tapi isinya versi lama | Browser menyimpan versi lama | Tekan **Ctrl + F5** |
