# KontenPlan

Aplikasi desktop (Windows & macOS) untuk tim yang merencanakan konten **video** dan **poster**, dengan asisten AI.

## Fitur

- **Kalender konten**: tampilan bulanan. Geser (drag) konten ke tanggal lain untuk menjadwal ulang.
- **Papan Kanban**: Ide → Script/Brief → Produksi → Editing → Review → Terjadwal → Terbit. Geser kartu untuk mengubah status.
- **Script & storyboard video**: rasio, durasi target, hook, daftar scene (visual, voice-over, durasi, catatan), CTA.
- **Brief & desain poster**: ukuran template, tujuan, audiens, pesan utama, headline/copy, palet warna, font, moodboard gambar.
- **Caption & hashtag** untuk setiap konten.
- **Asisten AI** (Claude, ChatGPT, atau Gemini, pilih di Pengaturan): generator ide, hook, script lengkap, caption + hashtag, headline poster, serta saran palet dan font.
- **3 bahasa**: Indonesia, English, Melayu.
- **Ekspor**: PDF per konten (untuk dikirim ke editor/desainer) dan CSV semua konten.

## Cara kerja tim (folder bersama)

1. Buat satu folder di Google Drive, Dropbox, OneDrive, atau folder jaringan kantor, lalu bagikan ke semua anggota tim.
2. Pastikan folder itu **tersinkron ke komputer** masing-masing (misalnya aplikasi Google Drive for Desktop).
3. Saat pertama membuka KontenPlan, isi nama dan pilih folder tersebut.

KontenPlan menyimpan **satu file per konten** di `KontenPlan/items/`, gambar moodboard di `KontenPlan/assets/`, dan konten yang dihapus di `KontenPlan/trash/`. Karena tiap konten punya file sendiri, dua orang bisa mengedit konten yang berbeda di waktu yang sama tanpa bentrok. Kalau dua orang mengedit konten **yang sama**, aplikasi akan memberi peringatan dan menawarkan pilihan: timpa atau muat versi terbaru.

Perubahan dari anggota lain muncul otomatis dalam beberapa detik, setelah aplikasi sinkronisasi (Drive/Dropbox) menyelesaikan tugasnya.

## Asisten AI

Buka **Pengaturan → Asisten AI**, pilih penyedia, lalu tempel API key:

| Penyedia | Ambil API key di | Model bawaan |
|---|---|---|
| Google Gemini (ada kuota gratis) | https://aistudio.google.com/apikey | `gemini-2.5-flash` |
| Claude (Anthropic) | https://console.anthropic.com/settings/keys | `claude-sonnet-5-5` |
| ChatGPT (OpenAI) | https://platform.openai.com/api-keys | `gpt-5-mini` |

Nama model bisa diganti kapan saja di kolom **Model**. API key disimpan terenkripsi **hanya di komputer masing-masing** dan tidak pernah ditulis ke folder tim.

## Menjalankan dari kode

Butuh [Node.js](https://nodejs.org) versi 20 atau lebih baru.

```bash
npm install
npm start
```

## Membuat installer .exe dan .dmg

### Cara termudah: GitHub Actions (gratis, tanpa perlu punya Mac)

1. Buat repository baru di GitHub, lalu upload seluruh isi folder ini (folder `node_modules` dan `dist` tidak perlu ikut).
2. Buka tab **Actions** → **Build KontenPlan (.exe & .dmg)** → **Run workflow**.
3. Tunggu sekitar 10 menit. Hasilnya bisa diunduh di bagian **Artifacts** pada halaman run tersebut:
   - `KontenPlan-windows-latest` → `KontenPlan-Setup-1.0.0.exe`
   - `KontenPlan-macos-latest` → `KontenPlan-1.0.0.dmg` (universal: Mac Intel dan Apple Silicon)

Kalau kamu push tag versi (misalnya `git tag v1.0.1 && git push --tags`), installer juga otomatis dilampirkan ke halaman **Releases**.

### Build manual

- Di Windows: `npm run dist:win` → `dist/KontenPlan-Setup-x.y.z.exe`
- Di Mac: `npm run dist:mac` → `dist/KontenPlan-x.y.z.dmg`

File .dmg hanya bisa dibuat di komputer Mac (atau lewat GitHub Actions).

## Peringatan keamanan saat instal (normal)

Installer belum ditandatangani (*code signing*), jadi:

- **Windows**: muncul "Windows protected your PC". Klik **More info** → **Run anyway**.
- **macOS**: muncul "tidak dapat dibuka karena dari pengembang yang tidak dikenal". Klik kanan aplikasi → **Open** → **Open**. Di macOS terbaru, kalau tetap diblokir, buka **System Settings → Privacy & Security** lalu klik **Open Anyway**.

Supaya peringatan ini hilang, kamu perlu Apple Developer Program (US$99 per tahun) untuk Mac dan sertifikat code signing untuk Windows.

## Mengganti versi

Ubah `"version"` di `package.json`, lalu build ulang.

## Struktur kode

```
main.js          proses utama Electron: file, folder tim, AI, ekspor
preload.js       jembatan aman antara tampilan dan sistem
src/index.html   halaman aplikasi
src/app.js       seluruh tampilan & logika (kalender, papan, editor, AI, pengaturan)
src/i18n.js      teks 3 bahasa
src/styles.css   desain
src/mock-api.js  data contoh, untuk membuka src/index.html langsung di browser sebagai pratinjau
build/icon.png   ikon aplikasi (1024×1024)
.github/workflows/build.yml   build otomatis .exe & .dmg
```
