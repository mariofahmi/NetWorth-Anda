# 📈 NetWorth Anda - Pelacak Nilai Bersih & Target Bebas Finansial

> **Aplikasi Web Finansial Pribadi Modern, Interaktif, dan 100% Privat.**  
> **Perancang Aplikasi:** **Mario Fahmi Syahrial**  
> **Repositori Resmi:** [https://github.com/mariofahmi/NetWorth-Anda](https://github.com/mariofahmi/NetWorth-Anda)

---

## ✨ Tentang NetWorth Anda

**NetWorth Anda** adalah instrumen kalkulator finansial komprehensif yang dirancang untuk membantu individu di Indonesia memetakan, mengaudit, dan mempercepat pencapaian kebebasan finansial (*Financial Independence, Retire Early* - FIRE).

Aplikasi ini beroperasi **100% offline-first dan privat**: seluruh data neraca kekayaan, aset, dan utang disimpan secara lokal di dalam browser perangkat Anda menggunakan `localStorage`, tanpa mengirim data sensitif ke server backend mana pun.

---

## 🚀 Fitur Unggulan

### 1. 🛡️ Gerbang Ketentuan & Disclaimer Legal
* Sebelum masuk ke dashboard, pengguna disajikan ringkasan ketentuan penggunaan, batasan tanggung jawab mandiri, dan penegasan bahwa instrumen ini adalah alat bantu kalkulasi edukasi (bukan nasihat investasi berlisensi OJK).

### 2. 💎 Ringkasan Nilai Bersih Real-Time (*Net Worth Dashboard*)
* Perhitungan otomatis: `Nilai Bersih = Total Aset − Total Utang`.
* Indikator rasio solvabilitas (*Debt-to-Asset Ratio*) dengan status kesehatan finansial.
* Ringkasan aset likuid (kas, reksa dana pasar uang, emas, saham) vs non-likuid.
* Bar komposisi proporsional aset dengan visualisasi warna dinamis per instrumen.

### 3. 🎯 Menu Profil & Target Tabungan
* Tetapkan nominal target tabungan dan tahun pencapaian yang diinginkan.
* Kalkulasi otomatis usia saat target tercapai, sisa tahun/bulan, dan kebutuhan tabungan rutin per bulan.
* Tombol jalan pintas nominal (100 Jt, 250 Jt, 500 Jt, 1 Miliar, 2 Miliar) dan tahun target.

### 4. 🔥 Kalkulator Angka Bebas Finansial (FIRE Calculator)
* Pengali fleksibel yang disesuaikan dengan imbal hasil investasi dan inflasi Indonesia:
  * **20x Pengeluaran Tahunan** (Tingkat Tarik Aman / SWR 5.0% - Agresif)
  * **25x Pengeluaran Tahunan** (SWR 4.0% - Standar Trinity Study)
  * **30x Pengeluaran Tahunan** (SWR 3.3% - Realistis Indonesia)
  * **33x Pengeluaran Tahunan** (SWR 3.0% - Konservatif)
  * Pengali kustom bebas diatur via slider.
* Indikator tonggak capaian (*Dana Darurat 6 bulan, Fondasi Awal 10%, Setengah Jalan 50%, Bebas Finansial 100%*).

### 5. ⚡ Prioritas Pelunasan Utang (*Metode Debt Avalanche*)
* Daftar liabilitas diurutkan otomatis dari suku bunga tahunan tertinggi (*Highest Interest Rate First*).
* Memisahkan utang konsumtif berbahaya (Pinjol, Paylater, Kartu Kredit) dari utang produktif (KPR, Kredit Usaha).
* Estimasi beban bunga bulanan dan tombol perayaan lunas (*Confetti Celebration*).

### 6. 📊 Portofolio Aset Terintegrasi Indonesia
* Mendukung kategori aset lokal:
  * Rekening Bank & Kas Tunai
  * Deposito Perbankan
  * SBN (Surat Berharga Negara: ORI, SR, SBR, ST)
  * Reksa Dana
  * Saham IDX
  * Emas Batangan (Antam, UBS)
  * BPJS Ketenagakerjaan (JHT / Jaminan Hari Tua)
  * Properti & Aset Lainnya

### 7. 📈 Grafik Riwayat Tren & Proyeksi
* Grafik visual interaktif dengan kurva *smooth Bezier* untuk memantau pertumbuhan nilai bersih dan tabungan bulanan.
* Pengguna smartphone dan tablet dapat menyentuh (*tap*) titik grafik untuk melihat tooltip detail riwayat.

### 8. ✅ Checklist Kebiasaan Finansial Cerdas
* Checklist disiplin finansial bertahap: **Harian**, **Mingguan**, **Bulanan**, dan **Tahunan** (SPT Tahunan, rebalancing, review polis asuransi).

### 9. 🖨️ Cetak Lembar Neraca Keuangan (PDF Report)
* Pratinjau cetak bersih yang diformat khusus untuk laporan audit keuangan privat atau disimpan sebagai PDF rapi.

---

## 📱 Responsivitas Smartphone & Tablet (*Mobile First*)

Aplikasi ini dioptimalkan penuh untuk kenyamanan sentuhan jari (*touch-friendly*):
* **Keyboard Numerik Otomatis**: Semua input angka (`Nominal`, `Usia`, `Bunga`, `Tahun`) menggunakan `inputMode="numeric"` sehingga keyboard ponsel otomatis membuka tombol angka 0–9.
* **Ukuran Sentuh Standar**: Seluruh tombol jalan pintas dan aksi memiliki tinggi ketukan ≥ 32px–44px untuk mencegah salah ketuk ibu jari (*thumb zone*).
* **Tata Letak Adaptif**: Grid berubah otomatis dari 1 kolom di smartphone (<480px) menjadi 2–3 kolom di tablet (768px–1024px) dan desktop.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend Framework:** React 19 + TypeScript
* **Styling:** Tailwind CSS v4
* **Bundler & Server:** Vite 8
* **Ikon:** Lucide React
* **Efek Interaktif:** Canvas Confetti

---

## 💻 Panduan Menjalankan Secara Lokal

### Prasyarat
* [Node.js](https://nodejs.org/) versi 18.x atau yang lebih baru
* Package manager `npm`

### Langkah-langkah:

```bash
# 1. Kloning repositori ini
git clone https://github.com/mariofahmi/NetWorth-Anda.git

# 2. Masuk ke direktori proyek
cd NetWorth-Anda

# 3. Instal dependensi
npm install

# 4. Jalankan dev server lokal
npm run dev
```

Buka peramban Anda di:
* **Local:** `http://localhost:3000/`
* **Mobile / Tablet (Wi-Fi):** `http://[IP-Lokal-Anda]:3000/`

### Build untuk Produksi:
```bash
npm run build
```
File siap saji akan dibuat di folder `dist/`.

---

## 👤 Perancang & Pengembang

* **Nama:** Mario Fahmi Syahrial
* **GitHub:** [@mariofahmi](https://github.com/mariofahmi)
* **Repositori:** [NetWorth-Anda](https://github.com/mariofahmi/NetWorth-Anda)

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan edukasi dan perencanaan finansial mandiri pribadi. Data finansial pengguna tersimpan aman secara privat di perangkat masing-masing.

