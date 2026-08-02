# 📄 Product Requirements Document (PRD)

**Nama Proyek:** AI-Powered Kids Learning Platform (butuh nama yg kreatif)

**Draft:** 1.0

**Status:** Ready for Review

## 1. Problem Statement
* **Cognitive Overload (Kewalahan Materi):** Anak-anak sering bingung harus mulai belajar dari mana karena materi sekolah menumpuk dan penyampaiannya terlalu teoretis.
* **Low Engagement & Retention (Cepat Bosan):** Metode belajar mandiri konvensional pasif (membaca buku/menonton video panjang) tanpa interaksi *real-time* membuat tingkat fokus anak turun drastis.
* **Poor Execution & Preparation (Eksekusi Buruk):** Anak kesulitan memecah tugas kelompok yang besar serta tidak efektif dalam merangkum materi tebal (PDF/PPT) untuk persiapan ujian.
* **Lack of Immediate Reward (Kurang Motivasi):** Tidak adanya sistem apresiasi langsung (*instant feedback*) yang membuat kegiatan belajar harian terasa seperti beban, bukan aktivitas yang menyenangkan.

## 2. Product Goals & Success Metrics Goal 
**Personalisasi Alur Belajar** : 80% pengguna menyelesaikan alur *AI Roadmap* tanpa *drop-off* di tengah jalan. 
**Meningkatkan Retensi Belajar** : Rata-rata *Daily Active Users* (DAU) memiliki *Daily Streak* minimal **3 hari berturut-turut**.
**Efisiensi Persiapan Ujian** :Pemrosesan upload PDF/PPT menjadi ringkasan + 5 kuis membutuhkan waktu **< 10 detik**. 
**Pengalaman AI Ramah Anak** : Latensi balasan *AI Study Buddy* **< 3 detik** dengan tingkat keluhan konten tidak pantas **0%**.

## 3. Target User & UX Constraints
### Primary User: Anak Sekolah (9–15 Tahun / SD–SMP)
* **Karakteristik:** Menyukai visual interaktif, teks pendek, elemen *game*, serta respons instan.
* **UX Constraint:** *UI/UX harus touch-friendly* (tombol besar), memperbanyak *micro-animation* saat aksi berhasil (misal: efek *confetti* saat kuis selesai), dan menghindari bahasa baku yang kaku.

### Secondary User: Orang Tua / Wali Murid
* **Karakteristik:** Ingin kepraktisan untuk memantau apakah anak benar-benar belajar.
* **UX Constraint:** Dashboard pemantauan grafik *progress* harus ringkas dan bisa dipahami hanya dalam waktu 5 detik pandangan (*5-second rule*).

## 4. Prioritised User Stories & Acceptance Criteria
 **P0 (Must-Have / MVP):** Wajib ada di peluncuran pertama.
 **P1 (Should-Have):** Dikembangkan setelah sistem utama stabil.

 ID: Fitur(Prioritas) - User Story = Acceptance Criteria 
- **US-01**: Login / Register (**P0**) - Sebagai siswa, saya ingin registrasi/login cepat agar *progress* belajar tersimpan. = Dapat login via Google/Email dalam < 2 klik. Sesi tidak gampang *logout* otomatis.
- **US-02**: AI Roadmap (**P0** ) - Sebagai siswa, saya ingin melihat rute belajar terstruktur agar tahu melangkah dari mana. = Menampilkan modul dalam bentuk *step-by-step node* (mirip peta game). Node terbuka jika node sebelumnya tuntas.
- **US-03**: AI Study Buddy (**P0** ) - Sebagai siswa, saya ingin bertanya ke AI dengan gaya santai agar paham materi yang sulit. = Tersedia kolom *chat* dengan saran pertanyaan (*prompt suggestions*). Bahasa AI ramah anak, suportif, dan aman.
- **US-04**: Video + Teks (**P0** ) - Sebagai siswa, saya ingin menonton materi sekaligus membaca ringkasannya di bawah video. = Pemutar video dapat di-*pause/play* lancar, teks ringkasan menggunakan poin-poin yang scannable.
- **US-05** : Progress Dashboard (**P0**) - Sebagai siswa/orang tua, saya ingin melihat statistik waktu belajar dan status penguasaan materi. = Grafik total jam belajar harian/mingguan dan label jelas mana materi "Dikuasai" vs "Perlu Dipelajari Lagi".
- **US-06*: Upload PDF/PPT (**P1**) - Sebagai siswa, saya ingin mengunggah file materi agar dibuatkan kuis & ringkasan otomatis. = Sistem menerima PDF/PPT max 15MB, mengekstrak teks, dan memuat 5 soal pilihan ganda interaktif.
- **US-07**: Task Splitter (**P1*) - Sebagai siswa, saya ingin tugas kelompok besar dipecah jadi langkah harian kecil. = Menginput tenggat waktu -> AI membaginya menjadi *checklist* harian berdasarkan H- minus deadline.
- **US-08**: Gamification (**P1**) Sebagai siswa, saya ingin dapat poin, badge, dan *streak* agar makin semangat belajar harian. = *Streak* bertambah jika ada minimal 1 aktivitas belajar per hari. Pop-up *badge* muncul otomatis saat target tercapai. 

## 5. Functional Requirements & Edge Cases
### FR-1: Authentication & Safety
* **Requirement:** Pendaftaran menggunakan Email atau Single Sign-On (Google).
* **Edge Case Handling:** Jika pendaftar berusia di bawah 12 tahun, sistem secara opsional meminta input Email Orang Tua untuk notifikasi pemantauan.

### FR-2: AI Learning Roadmap Engine
* **Requirement:** Algoritma menghasilkan urutan materi dari tingkat paling dasar (*Basic*) ke tingkat lanjut (*Advanced*).
* **Edge Case Handling:** Jika pengguna gagal menjawab kuis evaluasi di akhir *node*, AI memberikan opsi "Ulangi Materi" atau "Tanyakan ke Study Buddy".

### FR-3: AI Study Buddy (Chatbot Interface)
* **Requirement:** *UI Chatbox* mengambang (*floating widget*) atau halaman khusus yang mendukung pesan teks dan pemutaran audio (*Text-to-Speech*).
* **Content Safety Filter (Wajib):** Menerapkan *prompt guardrails* ketat. Jika anak menanyakan hal di luar konteks belajar atau hal sensitif/berbahaya, AI akan merespons: *"Wah, pertanyaan itu di luar area belajarku nih! Yuk lanjut bahas materi sekolahmu lagi!"*

### FR-4: Document Parser & Quiz Generator
* **Requirement:** Sistem membaca dokumen PDF/PPT $\rightarrow$ AI memproses $\rightarrow$ Menampilkan 1 ringkasan + 5 soal kuis.
* **Edge Case Handling:** Jika file yang diunggah berupa gambar hasil *scan* tanpa teks (non-OCR) atau file rusak, sistem menampilkan pesan error ramah anak: *"File-nya tidak bisa terbaca nih, pastikan dokumenmu berisi teks ya!"*

### FR-5: Gamification Engine
* **Requirement:**
* Selesai 1 Video/Materi = **+50 Poin**
* Selesai Kuis sempurna = **+100 Poin**
* *Daily Streak* dihitung reset setiap pukul 00.00 malam.

## 6. Non-Functional Requirements (Keamanan & Performa)
* **Child Safety & Compliance:** Tidak menampilkan iklan pihak ketiga (*Zero Third-Party Ads*) dan tidak mengumpulkan data sensitif anak.
* **Performance:** *Page Load Time* seluruh halaman di bawah **2 detik** pada jaringan 4G standar.
* **Responsiveness:** Tampilan web harus dapat beradaptasi dengan baik (*fully responsive*) di perangkat Laptop/Desktop dan Tablet (iPad/Android Tablet).

## 7. Project Scope
Untuk menjaga agar pengerjaan proyek tepat waktu (*on-track*) dan tidak mengalami *scope creep* (pembengkakan fitur), berikut adalah batasan jelas pengembangan proyek:

### 🟢 In-Scope (Fitur & Area yang Dikerjakan)
* **Pengembangan Responsive Web App:** Berfokus pada layar Desktop/Laptop (1440px) dan Tablet (768px - 1024px).
* **Fitur Utama (MVP - P0 & P1):**
* Modul Autentikasi (Siswa & Opsi Email Orang Tua).
* AI Roadmap interaktif (*node-based path*).
* AI Study Buddy Chatbot (*text & voice output* sederhana).
* Video Player + Ringkasan Teks.
* Parser Dokumen (PDF/PPT max 15MB) $\rightarrow$ Ringkasan + 5 Soal Kuis.
* Task Splitter untuk tugas kelompok.
* Dashboard Progress Belajar & Logika *Gamification* (Poin, *Streak*, *Badge*).
* **Content Safety Filter:** Integrasi *prompt guardrails* untuk memastikan respons AI aman untuk anak-anak.
* **Bahasa Utama:** Bahasa Indonesia.

## 8. Design Guidelines & Color Palette

### 🎨 Color Palette
#### Primary Color (Smart AI Indigo)
Warna utama yang mencerminkan kecerdasan, teknologi AI, dan fokus belajar.
* **Base:** `#6C5CE7` (Digunakan untuk tombol utama/CTA, *node* aktif di Roadmap, ikon utama)
* **Dark:** `#4834D4` (Digunakan untuk efek *hover* tombol utama, teks *heading* dominan)
* **Mid:** `#A29BFE` (Digunakan untuk *stroke/border* aktif, aksen grafis, ikon sekunder)
* **Soft Tint:** `#F0EEFF` (Digunakan untuk latar belakang *card* aktif, *highlight* teks, *hover background*)

#### Secondary Color (Gamification Amber/Gold)
Warna sekunder untuk memicu semangat, mekanisme *reward*, dan memberikan kontras pada sistem *gamification*.
* **Base:** `#FF9F43` (Digunakan untuk indikator *Streak*, poin, tombol sekunder, *badge* pencapaian)
* **Dark:** `#E67E22` (Digunakan untuk efek *hover* tombol sekunder, teks penekanan skor/peringatan)
* **Mid:** `#FECA57` (Digunakan untuk ilustrasi bintang, piala, dan aksen *glowing*)
* **Soft Tint:** `#FFF9EC` (Digunakan untuk latar belakang modul *reward*, container kuis, banner piala)

#### Neutral Colors (Soft & Eye-Friendly)
* **Background Base:** `#F8F9FD` (Latar belakang utama seluruh halaman *website*)
* **Card Background:** `#FFFFFF` (Latar belakang elemen *card*, *chat bubble*, dan kontainer modul)
* **Text Primary:** `#2D3436` (Warna teks utama/paragraf — abu-abu gelap agar tidak sekeras hitam pekat)
* **Text Muted:** `#636E72` (Warna teks deskripsi, *sub-heading*, *timestamp* chat)
* **Border & Line:** `#E2E8F0` (Garis pembatas *card*, *input field*, dan pembatas *section*)

### Typography & Component Rules
* **Font Family Utama:** **Nunito** atau **Poppins** (Google Fonts). Font dengan karakter ujung agak membulat (*sans-serif rounded*) yang sangat mudah dibaca oleh anak-anak.
* **Border Radius:**
* Tombol & *Input Field*: `12px`
* *Card & Modal Pop-up*: `20px` – `24px` (menghindari sudut tajam/siku-siku).
* **Ukuran Target Sentuh (Touch Target):** Minimal `48px x 48px` untuk setiap tombol agar mudah diklik di layar sentuh tablet maupun dengan *mouse*.
* **Micro-Interactions:** Setiap kali siswa menyelesaikan kuis atau klaim poin, tampilkan animasi ringan berupa *confetti* atau efek piala membesar untuk memberikan kepuasan instan (*instant gratification*).

